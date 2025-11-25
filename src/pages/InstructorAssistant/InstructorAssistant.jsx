import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InstructorAssistant.css';

const InstructorAssistant = () => {
  const navigate = useNavigate();

  const handleGoogleDriveClick = () => {
    navigate('/google-drive-picker');
  };

  const uploadedVideos = [
    {
      id: 1,
      title: 'Quantum_Physics_Intro.mp4',
      duration: '12:45 min',
      uploadedDate: 'Uploaded 2 days ago',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNw3A5CGVq5YqJN6kQ9UVH9-L-DzQKA9JlzoYEw0GnOmhwRG4VBht_d8Lf_-d-L1ljoczHVT2gWqXyoltGOXvsZ2WlWXZARRTSNPON_pvNsUWrC3MxfDBJeb0yBzD8qWfLli8IcOArXQRJiXMoc7f-NzGYZlz03mVH9nqe_uSeWxejft7Q5vDaxLBJetWqt4oKzlNMGUVCjU7rMiKrm0vAitAns3CHfU7PFXT9eksP5TgqWjdksZz4W63L1PNrwXPgusVTPQhHf2od',
      status: 'Processed'
    },
    {
      id: 2,
      title: 'History_of_Rome_S1E2.mov',
      duration: '45:12 min',
      uploadedDate: 'Uploaded 5 days ago',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-ZB86AJkmJ0PKINZ9sIfbFSqA7QSoqeRw2AFcQ6SGEayS7-6UZypCiy94tkJ_8S1-7fHM_iGXgpzVukTYXJMpW5l3eSQvkGEbi-c3dU1i4ZaarHT-0zaAuPrWfM2Nq5APa8yhxZA3qfEtioZ_HtSnUDSB7cqOmpd8iUfPZOi5RscQIKWoIZYXZkFDCIof1_gLqe0Bd3F5GLjnNFppR9vEena1NDCo69wfLLcGdMjIqSqpFrfS4Dp8cbQsU9d1uzSvPPtvOxPNUt-C',
      status: 'Processed'
    }
  ];

  return (
    <div className="instructor-assistant">
      <div className="ia-container">
        {/* Page Heading */}
        <div className="ia-header">
          <div className="ia-header-content">
            <h1 className="ia-title">Instructor Assistant</h1>
            <p className="ia-subtitle">
              Upload a video to enhance your profile. Choose your preferred source below.
            </p>
          </div>
        </div>

        {/* Upload Options */}
        <div className="ia-upload-grid">
          {/* Upload from Device */}
          <div className="ia-card">
            <div className="ia-card-content">
              <div className="ia-icon-wrapper ia-icon-primary">
                <svg className="ia-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="ia-card-text">
                <p className="ia-card-title">Upload from Device</p>
                <p className="ia-card-description">
                  Drag & drop or click to select a video from your computer.
                </p>
              </div>
            </div>
            <button className="ia-btn ia-btn-primary">Select Video</button>
          </div>

          {/* Google Drive */}
          <div className="ia-card">
            <div className="ia-card-content">
              <img 
                className="ia-service-logo" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEdlvvokR0xUOXRo4TwdoKXJFLPmm_WfXV4K9XddtRrcV0K_rV0wM7XLYFzVPmn_rqwyIIkWMgEvm6gZf9eCeZBtu9w9oJa3OXKejpemr2AuX25BdBwFg0WKWrAmRxEBBgIOUaZ3mK2j7R8ac_zRXRSzVfxIBlqKduM6rHqKwDntt5HV41-VWx0abmzl4808joxVU6pFEp6odXB3txmKM6b2kezHnIl_U9qXhik4BAA640473BALYqpbeQekYAip1M7NUO0P74skvH" 
                alt="Google Drive logo" 
              />
              <div className="ia-card-text">
                <p className="ia-card-title">Attach from Google Drive</p>
                <p className="ia-card-description">
                  Connect your account to import videos directly from Drive.
                </p>
              </div>
            </div>
            <button className="ia-btn ia-btn-secondary" onClick={handleGoogleDriveClick}>Connect Google Drive</button>
          </div>

          {/* MS Teams */}
          <div className="ia-card">
            <div className="ia-card-content">
              <img 
                className="ia-service-logo" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz9O-tNcAyNBaENy6z_FPfhvzDq7_-x2dJ0wNwtDzBqjiPp0CSWaFC3MR5YkLDztjW6_fA0H5gPUS8sVkmm-5YyLxiiwyNaSHKNJGj24N66eV5tpqMlImHr6ol7k2O9rDZHYHVNAK_ipx0xS0uk6IAtkAlXIHY9wcwGvczqvdplDx4ApkefTTPxhFtBS0-YDWtLTBOuMFXIK6fZrd3YOBV39dLMdlAL-E7ELr7AWMkEQc6zm2CO8iqvUB5wsg0qNiC5qBHlHYgmITO" 
                alt="MS Teams logo" 
              />
              <div className="ia-card-text">
                <p className="ia-card-title">Attach from MS Teams</p>
                <p className="ia-card-description">
                  Sign in to import recordings stored in your MS Teams.
                </p>
              </div>
            </div>
            <button className="ia-btn ia-btn-secondary">Connect MS Teams</button>
          </div>
        </div>

        {/* Section Header */}
        <h2 className="ia-section-title">My Uploaded Videos</h2>

        {/* Uploaded Videos List */}
        <div className="ia-videos-list">
          {uploadedVideos.map((video) => (
            <div key={video.id} className="ia-video-item">
              <div className="ia-video-info">
                <div 
                  className="ia-video-thumbnail"
                  style={{ backgroundImage: `url(${video.thumbnail})` }}
                />
                <div className="ia-video-details">
                  <p className="ia-video-title">{video.title}</p>
                  <p className="ia-video-meta">
                    {video.duration} - {video.uploadedDate}
                  </p>
                </div>
              </div>
              <div className="ia-video-actions">
                <span className="ia-status-badge">
                  <span className="ia-status-dot"></span>
                  {video.status}
                </span>
                <button className="ia-menu-btn">
                  <svg className="ia-menu-icon" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorAssistant;
