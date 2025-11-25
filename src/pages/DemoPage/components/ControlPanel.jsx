import PropTypes from 'prop-types';

/**
 * Bottom control panel with mic, transcript toggle, and end call buttons
 */
const ControlPanel = ({ onStartRecording, onEndCall }) => {
    const toggleTranscript = () => {
        document
            .getElementById("transcript-container")
            ?.classList.toggle("transcript-visible");
    };

    return (
        <div className="bottom-controls">
            <button title="Mic On" onClick={onStartRecording}>
                <div>
                    <span className="material-symbols-outlined">mic</span>
                </div>
            </button>

            <button title="Show Transcript" onClick={toggleTranscript}>
                <div>
                    <span className="material-symbols-outlined">subtitles</span>
                </div>
            </button>

            <button className="end-call" title="End Call" onClick={onEndCall}>
                <div>
                    <span className="material-symbols-outlined">call_end</span>
                </div>
            </button>
        </div>
    );
};

ControlPanel.propTypes = {
    onStartRecording: PropTypes.func.isRequired,
    onEndCall: PropTypes.func
};

export default ControlPanel;
