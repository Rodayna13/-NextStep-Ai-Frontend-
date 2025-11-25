import PropTypes from 'prop-types';

/**
 * AI panel component showing AI avatar and status
 */
const AIPanel = ({ isPlaying, audioRef, voiceImage }) => {
    const handleToggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };

    return (
        <div className={`right flex-col items-center justify-center gap-8 ${isPlaying ? "speaking" : ""}`}>
            <div
                className={`avatar ai-avatar ai-avatar-bg ${isPlaying ? "speaking-avatar" : ""}`}
                style={{
                    backgroundImage: voiceImage ? `url(${voiceImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
      
            <div className="text-center">
                <p className="ai-name">AI Coach</p>
                <p className="ai-status">
                    {isPlaying ? "Speaking" : "Waiting for turn"}
                </p>
            </div>

            <button
                className="ai-speak-button"
                title="Toggle AI Speaking"
                onClick={handleToggleAudio}
            >
                <span className="material-symbols-outlined">
                    {isPlaying ? "volume_up" : "volume_off"}
                </span>
            </button>

            <div className="volume-bar">
                <div className="volume-bar-fill ai-fill"></div>
            </div>
        </div>
    );
};

AIPanel.propTypes = {
    isPlaying: PropTypes.bool.isRequired,
    audioRef: PropTypes.object.isRequired
};

export default AIPanel;
