import React from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose, original, translated, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fm-backdrop" role="dialog" aria-modal="true">
      <div className="fm-modal fm-modal-large" >
        <header className="fm-header">
          <h3>Resume Analysis & Enhanced CV</h3>
          <button className="fm-close" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <div className="fm-body fm-body-iframe">
          {loading ? (
            <div className="fm-loading">
              <div className="fm-spinner"></div>
              <p>Generating your personalized CV analysis...</p>
            </div>
          ) : translated && typeof translated === 'string' ? (
            <div className="fm-iframe-container">
              <iframe
                title="cv-analysis"
                className="fm-iframe-full"
                srcDoc={translated}
                sandbox="allow-same-origin allow-popups"
              />
            </div>
          ) : (
            <div className="fm-error">
              <span className="material-symbols-outlined">error</span>
              <p>Failed to generate analysis. Please try again.</p>
            </div>
          )}
        </div>

        <footer className="fm-footer">
          <button className="fm-btn fm-btn-primary" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
};

export default FeedbackModal;
