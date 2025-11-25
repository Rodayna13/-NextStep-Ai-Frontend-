import PropTypes from 'prop-types';

/**
 * Transcript panel component showing conversation history
 */
const TranscriptPanel = ({ history }) => {
    return (
        <div className="transcript-container" id="transcript-container">
            {history.filter(msg => msg.role !== 'system').map((msg, idx) => (
                <div key={idx} className="message">
                    <p>
                        <strong className={msg.role === 'user' ? 'user-status' : 'ai-status'}>
                            {msg.role === 'user' ? 'You' : 'AI Coach'}:
                        </strong> {msg.content}
                    </p>
                </div>
            ))}
        </div>
    );
};

TranscriptPanel.propTypes = {
    history: PropTypes.arrayOf(
        PropTypes.shape({
            role: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired
        })
    ).isRequired
};

export default TranscriptPanel;
