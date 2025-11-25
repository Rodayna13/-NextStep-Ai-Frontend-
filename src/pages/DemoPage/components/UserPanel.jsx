import PropTypes from 'prop-types';

/**
 * User panel component showing user avatar and status
 */
const UserPanel = ({ isRecording, transcript, interim, onStartRecording }) => {
    return (
        <div className={`left flex-col items-center justify-center gap-8 ${isRecording ? "speaking" : ""}`}>
            <div className={`avatar user-avatar user-avatar-bg ${isRecording ? "speaking-avatar" : ""}`} />
            <div className="text-center">
                <p className="user-name">You</p>
                <p className="user-status">
                    {isRecording ? "Speaking" : "Listening"}
                </p>
            </div>
            <button
                className="mic-button"
                title="Push-to-Talk"
                onClick={onStartRecording}
            >
                <span className="material-symbols-outlined">mic</span>
            </button>
            <div className="volume-bar">
                <div className="volume-bar-fill user-fill"></div>
            </div>
            <div className={`interim-transcript ${interim || transcript ? "visible" : ""}`}>
                {transcript}
                <span className="interim-subtext">{interim && " " + interim}</span>
            </div>
        </div>
    );
};

UserPanel.propTypes = {
    isRecording: PropTypes.bool.isRequired,
    transcript: PropTypes.string,
    interim: PropTypes.string,
    onStartRecording: PropTypes.func.isRequired
};

export default UserPanel;
