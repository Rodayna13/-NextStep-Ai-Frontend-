import { useState } from "react";
import PropTypes from 'prop-types';
import LiveVoiceChat from '../LiveVoiceChat/LiveVoiceChat';
import "./InterviewPracticeSession.css";

const InterviewPracticeSession = ({ sessionId, initialQuestion }) => {
    const [isLoading] = useState(false);

    if (!sessionId || !initialQuestion) {
        return (
            <div className="interview-practice-session">
                <div className="session-error">
                    Unable to start session. Please try again.
                </div>
            </div>
        );
    }

    return (
        <div className="interview-practice-session">
            <LiveVoiceChat
                sessionId={sessionId}
                isVisible={true}
                isLoading={isLoading}
                text={initialQuestion}
            />
        </div>
    );
};

InterviewPracticeSession.propTypes = {
    sessionId: PropTypes.string.isRequired,
    initialQuestion: PropTypes.string.isRequired,
};

export default InterviewPracticeSession;