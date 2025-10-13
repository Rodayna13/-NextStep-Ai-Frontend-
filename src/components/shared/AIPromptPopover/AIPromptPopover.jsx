import React from "react";
import "./AIPromptPopover.css";

const AIPromptPopover = React.forwardRef(({
    showPopover,
    prompt,
    onPromptChange,
    onPromptSubmit,
    onClose
}, ref) => {
    if (!showPopover) return null;
    return (
        <div
            ref={ref}
            className="ai-prompt-popover"
        >
            <button
                type="button"
                className="ai-prompt-close-btn"
                onClick={onClose}
                aria-label="Close"
            >
                ×
            </button>
            <form onSubmit={onPromptSubmit} className="ai-prompt-form">
                <div className="ai-prompt-textarea-wrapper">
                    <textarea
                        value={prompt}
                        onChange={onPromptChange}
                        placeholder="Write your prompt..."
                        rows={3}
                        className="ai-prompt-textarea"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="ai-prompt-send-btn"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
});

export default AIPromptPopover;
