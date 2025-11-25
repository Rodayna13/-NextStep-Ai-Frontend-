import React, { useState, useEffect, useCallback } from 'react';
import './GoogleDrivePicker.css';
import { apiEndpoints } from '../../api/endpoints';
import { useNavigate } from 'react-router-dom';

const GoogleDrivePicker = () => {
    const [userId, setUserId] = useState('');
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentFolder, setCurrentFolder] = useState(null);
    const [folderStack, setFolderStack] = useState([]);

    const API_BASE = 'http://localhost:3000/api/google-drive';
    const navigate = useNavigate();
    // Check authentication status and load root files
    const checkAuthentication = useCallback(async () => {
        if (!userId.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE}/files/${userId}`);
            const data = await response.json();

            if (data.success) {
                setIsAuthenticated(true);
                setFiles(data.files || []);
                setCurrentFolder(null);
                setFolderStack([]);
            } else {
                setIsAuthenticated(false);
                setFiles([]);
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // Authenticate with Google Drive
    const handleAuthenticate = async () => {
        if (!userId.trim()) {
            alert('Please enter your email address first');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/auth/url?userId=${userId}`);
            const data = await response.json();

            if (data.success) {
                const authWindow = window.open(data.authUrl, '_blank', 'width=500,height=600');

                // Poll for authentication completion
                const pollAuth = setInterval(async () => {
                    if (authWindow.closed) {
                        clearInterval(pollAuth);
                        setTimeout(() => checkAuthentication(), 1000);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Authentication failed:', error);
            alert('Authentication failed. Please try again.');
        }
    };

    // Search files
    const handleSearch = async () => {
        if (!isAuthenticated || !searchTerm.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE}/search/${userId}?term=${encodeURIComponent(searchTerm)}`
            );
            const data = await response.json();

            if (data.success) {
                setFiles(data.files || []);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Navigate to a folder
    const navigateToFolder = async (folderId, folderName) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE}/folder/${userId}/${folderId}`);
            const data = await response.json();

            if (data.success) {
                // Update folder stack for breadcrumb navigation
                if (currentFolder) {
                    setFolderStack(prev => [...prev, currentFolder]);
                }
                setCurrentFolder({ id: folderId, name: folderName });
                setFiles(data.files || []);
            }
        } catch (error) {
            console.error('Failed to navigate to folder:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Navigate back to parent folder
    const navigateBack = async () => {
        if (folderStack.length === 0) {
            // Go back to root
            checkAuthentication();
            return;
        }

        const parentFolder = folderStack[folderStack.length - 1];
        setFolderStack(prev => prev.slice(0, -1));

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE}/folder/${userId}/${parentFolder.id}`);
            const data = await response.json();

            if (data.success) {
                setCurrentFolder(parentFolder);
                setFiles(data.files || []);
            }
        } catch (error) {
            console.error('Failed to navigate back:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Select single file
    const handleSelectFile = async (file) => {
        try {
            const response = await fetch(`${API_BASE}/select-file`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    fileId: file.id
                })
            });

            const data = await response.json();

            if (data.success) {
                const isAlreadySelected = selectedFiles.some(f => f.id === file.id);
                if (!isAlreadySelected) {
                    // Add directUrl by converting webViewLink to direct download format
                    const fileWithDirectUrl = {
                        ...data.file,
                        directUrl: data.file.webViewLink
                            ? `https://drive.google.com/uc?export=download&id=${data.file.id}`
                            : `https://drive.google.com/uc?export=download&id=${data.file.id}`
                    };
                    setSelectedFiles(prev => [...prev, fileWithDirectUrl]);
                }
            }
        } catch (error) {
            console.error('File selection failed:', error);
        }
    };

    // Remove selected file
    const removeSelectedFile = (fileId) => {
        setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    // Handle continue with selected files
    const handleContinue = async () => {
        if (selectedFiles.length === 0) {
            alert('Please select at least one file');
            return;
        }

        try {
            const videoProcessPromises = selectedFiles.map(file =>
                fetch(`${apiEndpoints.BASE_URL}/api/video-process`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        videoUrl: file.directUrl,
                        videoName: file.name
                    })
                })
            );

            const responses = await Promise.all(videoProcessPromises);
            const results = await Promise.all(responses.map(res => res.json()));

            console.log('Video processing results:', results);
            alert('Videos sent for processing successfully!');
            navigate('/video-bot')
        } catch (error) {
            console.error('Failed to process videos:', error);
            alert('Failed to process videos. Please try again.');
        }
    };

    // Get file icon based on mime type
    const getFileIcon = (mimeType) => {
        if (mimeType?.includes('pdf')) return '📄';
        if (mimeType?.includes('image')) return '🖼️';
        if (mimeType?.includes('video')) return '🎥';
        if (mimeType?.includes('audio')) return '🎵';
        if (mimeType?.includes('document')) return '📝';
        if (mimeType?.includes('spreadsheet')) return '📊';
        if (mimeType?.includes('presentation')) return '📽️';
        if (mimeType?.includes('folder')) return '📁';
        return '📄';
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A';
        const kb = 1024;
        const mb = kb * 1024;
        const gb = mb * 1024;

        if (bytes >= gb) return `${(bytes / gb).toFixed(1)} GB`;
        if (bytes >= mb) return `${(bytes / mb).toFixed(1)} MB`;
        if (bytes >= kb) return `${(bytes / kb).toFixed(1)} KB`;
        return `${bytes} bytes`;
    };

    useEffect(() => {
        if (userId.trim()) {
            checkAuthentication();
        }
    }, [userId, checkAuthentication]);

    return (
        <div className="google-drive-picker">
            <div className="container">
                <header className="picker-header">
                    <h1>🗂️ Google Drive File Picker</h1>
                    <p>Connect your Google Drive and select files to get their URLs</p>
                </header>

                {/* Authentication Section */}
                <div className="auth-section">
                    <div className="user-input">
                        <input
                            type="email"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter your email address"
                            className="email-input"
                        />
                        {!isAuthenticated && (
                            <button
                                onClick={handleAuthenticate}
                                className="auth-btn"
                                disabled={!userId.trim()}
                            >
                                🔗 Connect Google Drive
                            </button>
                        )}
                        {isAuthenticated && (
                            <div className="auth-status">
                                ✅ Connected as {userId}
                            </div>
                        )}
                    </div>
                </div>

                {isAuthenticated && (
                    <>
                        {/* Navigation & Search */}
                        <div className="navigation-section">
                            <div className="nav-controls">
                                <button
                                    onClick={checkAuthentication}
                                    className="nav-btn"
                                    disabled={isLoading}
                                >
                                    🏠 Root
                                </button>
                                {(currentFolder || folderStack.length > 0) && (
                                    <button
                                        onClick={navigateBack}
                                        className="nav-btn"
                                        disabled={isLoading}
                                    >
                                        ⬅️ Back
                                    </button>
                                )}
                                {currentFolder && (
                                    <div className="breadcrumb">
                                        {folderStack.map((folder) => (
                                            <span key={folder.id}>
                                                📁 {folder.name} /
                                            </span>
                                        ))}
                                        <span className="current-folder">
                                            📁 {currentFolder.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="search-controls">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search files..."
                                    className="search-input"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="search-btn"
                                    disabled={isLoading || !searchTerm.trim()}
                                >
                                    🔍
                                </button>
                            </div>
                        </div>

                        {/* Files Grid */}
                        <div className="files-section">
                            {isLoading && <div className="loading">Loading...</div>}

                            <div className="files-grid">
                                {files.map((file) => {
                                    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                                    return (
                                        <div
                                            key={file.id}
                                            className={`file-card ${isFolder ? 'folder-card' : ''}`}
                                            onClick={isFolder ? () => navigateToFolder(file.id, file.name) : undefined}
                                            style={isFolder ? { cursor: 'pointer' } : {}}
                                        >
                                            <div className="file-icon">
                                                {getFileIcon(file.mimeType)}
                                            </div>
                                            <div className="file-info">
                                                <div className="file-name" title={file.name}>
                                                    {file.name}
                                                </div>
                                                <div className="file-meta">
                                                    {isFolder ? 'Folder' : formatFileSize(file.size)}
                                                </div>
                                            </div>
                                            {!isFolder && (
                                                <button
                                                    onClick={() => handleSelectFile(file)}
                                                    className="select-btn"
                                                    disabled={selectedFiles.some(f => f.id === file.id)}
                                                >
                                                    {selectedFiles.some(f => f.id === file.id) ? '✓' : '+'}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {!isLoading && files.length === 0 && (
                                <div className="empty-state">
                                    📭 No files found
                                </div>
                            )}
                        </div>

                        {/* Selected Files */}
                        {selectedFiles.length > 0 && (
                            <div className="selected-section">
                                <h3>📋 Selected Files ({selectedFiles.length})</h3>
                                <div className="selected-files">
                                    {selectedFiles.map((file) => (
                                        <div key={file.id} className="selected-file">
                                            <div className="selected-file-info">
                                                <div className="selected-file-icon">
                                                    {getFileIcon(file.mimeType)}
                                                </div>
                                                <div className="selected-file-details">
                                                    <div className="selected-file-name">{file.name}</div>
                                                    <div className="selected-file-meta">
                                                        {formatFileSize(file.size)} • {file.mimeType}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="url-actions">
                                                <button
                                                    onClick={() => removeSelectedFile(file.id)}
                                                    className="remove-btn"
                                                    title="Remove from selection"
                                                >
                                                    ✖️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="continue-section">
                                    <button
                                        onClick={handleContinue}
                                        className="continue-btn"
                                    >
                                        Continue →
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default GoogleDrivePicker;