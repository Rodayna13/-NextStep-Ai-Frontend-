import React, { useState } from "react";
import "./style.css";
import { apiEndpoints } from "../../../api/endpoints";
import axios from "axios";
import { useFormContext } from "react-hook-form";
import useTypewriterEffect from "../../../hooks/useTypewriterEffect";
import AIPopoverActions from './AIPopoverActions';

const AIPromptPopover = React.forwardRef(({
    showPopover,
    name,
    inputValue,
    label,
    setShowAIPrompt
}, ref) => {


    const { getValues, setValue } = useFormContext()
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const [originalPrompt, setOriginalPrompt] = useState('');
    const [prompt, setPrompt] = useState();



    // Use the custom typewriter hook
    const { displayedText, isTyping, reset } = useTypewriterEffect(aiResponse, 30);

    const onPromptChange = (e) => {
        setPrompt(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setOriginalPrompt(prompt);



        try {
            let userPrompt = `${prompt}. The context is that this is a ${label} field in a resume form. The current value is: ${inputValue || getValues()[name] || ""}`;
            
            // If name includes "About" or "Summary", add skills, educations, and experiences to the prompt
            if (name && (name.toLowerCase().includes('about') || name.toLowerCase().includes('summary'))) {
                const skills = getValues('skills');
                const educations = getValues('educations');
                const experiences = getValues('experiences');
                
                if (skills) {
                    userPrompt += `. Skills: ${skills}`;
                }
                if (educations) {
                    userPrompt += `. Educations: ${JSON.stringify(educations)}`;
                }
                if (experiences) {
                    userPrompt += `. Experiences: ${JSON.stringify(experiences)}`;
                }
            }

            const response = await axios.post(apiEndpoints.enhanceInputWithAI, {
                prompt: userPrompt
            });
            setLoading(false);
            setAiResponse(response.data);
            console.log('AI response:', response.data);
        } catch (error) {
            setLoading(false);
            console.error('AI request error:', error);
        }
    }

    const onClose = () => {
        handleUndo();
        setShowAIPrompt(false);
    }

    const onAccept = () => {
        if (name && aiResponse) {
            setValue(name, aiResponse);
            onClose();
            setPrompt('')
        }
    }

    const handleUndo = () => {
        setAiResponse(null);
        reset();
        setPrompt(originalPrompt);
    }

    if (!showPopover) return null;
    return (
        <div
            ref={ref}
            className="ai-prompt-popover"
            onKeyDown={({ key: k }) => {
                k === 'Escape' && onClose()
            }}
     
        >
            <button
                type="button"
                className="ai-prompt-close-btn"
                onClick={onClose}
                aria-label="Close"
            >
                ×
            </button>
            {!aiResponse ? (
                <form onSubmit={handleSubmit} className="ai-prompt-form">
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
                            disabled={loading}
                        >
                            {loading ? 'Generating...' : 'Send'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="ai-response-container">
                    <div className="ai-response-header">
                        <h4>AI Generated Content:</h4>
                    </div>
                    <div className="ai-response-content">
                        <p>
                            {displayedText}
                            {isTyping && <span className="typing-cursor">|</span>}
                        </p>
                    </div>

                    <AIPopoverActions onAccept={onAccept} handleUndo={handleUndo} />
                </div>
            )}
        </div >
    );
});

export default AIPromptPopover;
