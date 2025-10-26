import React from 'react'

const AIPopoverActions = ({ onAccept, handleUndo }) => {
    return (
        <div className="ai-response-actions">
            <button
                type="button"
                className="ai-response-btn ai-accept-btn"
                onClick={onAccept}
            >
                Accept
            </button>
            <button
                type="button"
                className="ai-response-btn ai-undo-btn"
                onClick={handleUndo}
            >
                Undo
            </button>
        </div>
    )
}

export default AIPopoverActions