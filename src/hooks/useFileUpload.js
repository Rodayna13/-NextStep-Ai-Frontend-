import { useState, useCallback } from 'react';
import { readImageFile, isImageFile } from '../utils/fileUtils';

/**
 * Custom hook for handling file upload functionality
 * @returns {Object} File upload state and handlers
 */
export const useFileUpload = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);

    const handleImageSelect = useCallback(async (file) => {
        if (!file) return;

        if (!isImageFile(file)) {
            setError('Please upload a valid image file');
            return;
        }

        try {
            const imageData = await readImageFile(file);
            setUploadedImage(imageData);
            setUploadedFile(file);
            setError(null);
        } catch (err) {
            setError('Failed to read image file');
            console.error('Error reading image:', err);
        }
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleImageSelect(file);
    }, [handleImageSelect]);

    const handleFileInput = useCallback((e) => {
        const file = e.target.files?.[0];
        handleImageSelect(file);
    }, [handleImageSelect]);

    const removeImage = useCallback(() => {
        setUploadedImage(null);
        setUploadedFile(null);
        setError(null);
    }, []);

    return {
        uploadedImage,
        uploadedFile,
        isDragging,
        error,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileInput,
        removeImage,
    };
};
