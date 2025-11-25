import React, { useEffect, useState } from 'react';
import './Profile.css';
import { apiEndpoints } from '../../api/endpoints';
import translateObjectToArabic from '../../api/translate';
import FeedbackModal from '../../components/FeedbackModal/FeedbackModal';

const Profile = () => {
  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // Add edit profile logic here
  };

  const handleResumeAction = (action, resumeId) => {
    console.log(`${action} resume:`, resumeId);
    // Add resume actions logic here
  };

  const [cvData, setCvData] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [analyzerResultState, setAnalyzerResultState] = useState(null);
  const [translatedResultState, setTranslatedResultState] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFeedbackClick = async (resumeId) => {
    setFeedbackLoading(true);
    try {
      console.log('Feedback/analysis requested for resume:', resumeId);
      // Use stored cvData if available
      if (!cvData) {
        console.warn('No CV data available to send to analyzer');
        alert('No CV data found to analyze.');
        return;
      }

      const token = localStorage.getItem('accessToken');

      // Build multipart/form-data payload expected by the analyzer
      const formData = new FormData();
      // If you want to send an actual file, append a File object as ResumeFile
      // formData.append('ResumeFile', fileInput.files[0]);
      formData.append('ResumeText', JSON.stringify(cvData));

      // Do NOT set Content-Type header; the browser will set the correct boundary for multipart
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const analyzerResp = await fetch(apiEndpoints.analyzeResume, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (analyzerResp.ok) {
        const contentType = analyzerResp.headers.get('content-type') || '';
        const analyzerResult = contentType.includes('application/json') ? await analyzerResp.json() : await analyzerResp.text();

        // Store original result for modal display
        setAnalyzerResultState(analyzerResult);
        setTranslatedResultState(null);
        setIsModalOpen(true);

        // Generate HTML page from analyzer result
        if (analyzerResult && typeof analyzerResult === 'object') {
          try {
            // Show loading state in modal
            setFeedbackLoading(true);
            // Request the LLM to generate HTML page with three sections
            const htmlResponse = await translateObjectToArabic(analyzerResult);
            setTranslatedResultState(htmlResponse);
          } catch (tranErr) {
            console.error('HTML generation error:', tranErr);
            setTranslatedResultState({ error: 'HTML generation failed. See console for details.' });
          } finally {
            setFeedbackLoading(false);
          }
        }

      } else {
        console.warn('Analyzer proxy request failed with status', analyzerResp.status);
        const text = await analyzerResp.text().catch(() => null);
        if (text) console.warn('Analyzer proxy response:', text);
        alert('Analysis failed. See console for details.');
      }
    } catch (anErr) {
      console.error('Error calling Resume Analyzer proxy:', anErr);
      alert('Error running analysis. See console for details.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
      console.log('Delete account confirmed');
      // Add delete account logic here
    }
  };

  // Mock user data - replace with actual user data from your state management
  const user = JSON.parse(localStorage.getItem('user'));
  const userData = {
    name: user?.firstName + ' ' + user?.lastName || 'John Doe',
    email: user?.email || 'john.doe@email.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN2DrjjFPrSN-Fp7l9nUUAX1MuEiiUpqb5sptN_wa7mlw5kAJpue3fFrqXNogEdyfj9pZk0tog8LFiPMzCj3sTHHiNns7U2yCVBK1dWg06DilPpBTUq8sjtXhYc9IB2FWTW9r3WxWQDwHIRfADfhYkxdOvyZckECM3yHpYqJQU3w071zpIaku0BEJ3TrMP0ZeUkD4PlJdVYB0AMhGFuIjT_p7I1o6XbJy0d3wCO2uu0M0OAE1KFLTXWJCBJxDuULlbms6ZLaB9iyhP'
  };

  useEffect(() => {
    const fetchCVData = async () => {
      if (userData.email && userData.email !== 'john.doe@email.com') {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cv/${userData.email}`);
          if (response.ok) {
            const cvData = await response.json();
            console.log('Profile CV data:', cvData);
            setCvData(cvData);
          } else {
            console.log('CV not found for this email');
          }
        } catch (error) {
          console.error('Error fetching CV data:', error);
        }
      }
    };
    fetchCVData();
  }, [userData.email]);

  const mockResumes = [
    {
      id: 1,
      title: 'Software Engineer Resume',

      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZMUrYfpH0GFyie-gGKmGHtuI4-03IsKnjGmi49s0gSRdbn77RaRjqkOyv5d_bhggx9qT5k3HCvusIRK1c2xFqsnT7GDTiY664Frsw_fA4sd6xJNGuEsuBtdIzgwstJNNinIF958p_ZboJKa1pk2T75q71Z-8UibnDS9jGTdjog5dq-m9BuJNHB_rWJOfPIL6EPNaOjOc0GjIaNCCkCpbSHE_RAAliD_aJl4LHtQZtZmEqA56MUGGm6JOgisK6KaLbPrl2xwjRKTSW'
    }
  ];

  return (
    <div className="profile-container">
      {/* Main Content */}
      <main className="main-content">
        <div className="content-grid">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="user-info">
              <div className="user-profile">
                <div 
                  className="user-avatar" 
                  style={{ backgroundImage: `url("${userData.avatar}")` }}
                ></div>
                <div className="user-details">
                  <h1>{userData.name}</h1>
                  <p>{userData.email}</p>
                </div>
              </div>
              <nav className="sidebar-nav">
                <a className="nav-item active" href="#profile">
                  <p>Profile</p>
                </a>
                <a className="nav-item" href="#my-resumes">
                  <p>My Resumes</p>
                </a>
                <a className="nav-item" href="#danger-zone">
                  <p>Danger Zone</p>
                </a>
              </nav>
            </div>
          </aside>

          {/* Main Sections */}
          <div className="sections-container">
            {/* Profile Section */}
            <section className="section" id="profile">
              <div className="section-header">
                <h2 className="section-title">Profile</h2>
              </div>
              <div className="card">
                <div className="profile-card-content">
                  <div className="profile-info">
                    <h3 className="profile-name">{userData.name}</h3>
                    <p className="profile-email">{userData.email}</p>
                    <button className="edit-profile-btn" onClick={handleEditProfile}>
                      Edit Profile
                    </button>
                  </div>
                  <div 
                    className="profile-avatar" 
                    style={{ backgroundImage: `url("${userData.avatar}")` }}
                  ></div>
                </div>
              </div>
            </section>

            {/* My Resumes Section */}
            <section className="section" id="my-resumes">
              <div className="section-header">
                <h2 className="section-title">My Resumes</h2>
              </div>
              <div className="resumes-grid">
                {/* Resume Cards */}
                {mockResumes.map((resume) => (
                  <div key={resume.id} className="resume-card">
                    <div className="resume-thumbnail">
                      <img alt="Resume template thumbnail" src={resume.thumbnail} />
                    </div>
                    <div className="resume-info">
                      <h4 className="resume-title">{cvData?.jobTitle}</h4>
                      <p className="resume-date">Last updated: {resume.lastUpdated}</p>
                    </div>
                    <div className="resume-actions">
                      <button 
                        className="action-btn" 
                        onClick={() => handleResumeAction('view', resume.id)}
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                      <button 
                        className="action-btn" 
                        onClick={() => handleResumeAction('edit', resume.id)}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button 
                        className="action-btn" 
                        onClick={() => handleResumeAction('delete', resume.id)}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    {/* Modern feedback / analysis button */}
                              <button className="feedback-btn" onClick={() => handleFeedbackClick(resume.id)} aria-label="Get feedback" disabled={feedbackLoading}>
                                <span className="feedback-label">{feedbackLoading ? 'Analyzing...' : 'Feedback'}</span>
                                <span className="material-symbols-outlined feedback-icon">analytics</span>
                              </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Danger Zone Section */}
            <section className="section" id="danger-zone">
              <div className="section-header">
                <h2 className="section-title danger">Danger Zone</h2>
              </div>
              <div className="danger-card">
                <div className="danger-content">
                  <div className="danger-info">
                    <h3>Delete Your Account</h3>
                    <p>Once you delete your account, there is no going back. All of your data, including your resumes and personal information, will be permanently removed. Please be certain.</p>
                  </div>
                  <button className="btn btn-danger delete-account-btn" onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

        {/* Feedback modal */}
        <FeedbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          original={analyzerResultState}
          translated={translatedResultState}
          loading={feedbackLoading}
        />
    </div>
  );
};

export default Profile;