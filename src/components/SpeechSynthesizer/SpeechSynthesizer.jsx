//@ts-check
import React, { useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import "./SpeechSynthesizer.css";

const SpeechSynthesizer = ({ text, onSpeakComplete }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = async () => {
        if (!text) return;

        const speechKey = import.meta.env?.VITE_AZURE_SPEECH_KEY;
        const region = import.meta.env?.VITE_AZURE_SPEECH_REGION;

        const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, region);
        speechConfig.speechSynthesisVoiceName = "ar-SA-HamedNeural";

        const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
        setIsSpeaking(true);

        synthesizer.speakTextAsync(
            text,
            result => {
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    console.log("✅ Speech synthesis completed!");
                } else {
                    console.error("❌ Error:", result.errorDetails);
                }
                synthesizer.close();
                setIsSpeaking(false);
                if (onSpeakComplete) onSpeakComplete();
            },
            error => {
                console.error("Error during synthesis:", error);
                synthesizer.close();
                setIsSpeaking(false);
            }
        );
    };

    return (
        <div className="interviewer-bot">
            <div className="bot-container">
                {/* Bot Avatar */}
                <div className={`bot-avatar ${isSpeaking ? 'speaking' : ''}`}>
                    <div className="avatar-circle">
                        🤖
                    </div>
                    {isSpeaking && (
                        <div className="sound-waves">
                            <div className="wave wave-1"></div>
                            <div className="wave wave-2"></div>
                            <div className="wave wave-3"></div>
                        </div>
                    )}
                </div>

                {/* Conversation Bubble */}
                <div className="conversation-bubble">
                    <div className="bubble-header">
                        <span className="bot-name">AI Interviewer</span>
                        <span className={`status ${isSpeaking ? 'speaking' : 'idle'}`}>
                            {isSpeaking ? 'Speaking...' : 'Ready'}
                        </span>
                    </div>
                    
                    <div className="bubble-content">
                        <p className="question-text">
                            {text || "Hello! I'm your AI interviewer. Ready to begin?"}
                        </p>
                    </div>

                    <div className="bubble-controls">
                        <button
                            className={`speak-btn ${isSpeaking ? 'speaking' : ''}`}
                            onClick={speak}
                            disabled={isSpeaking}
                        >
                            {isSpeaking ? (
                                <>
                                    <span className="icon">🔊</span>
                                    Speaking...
                                </>
                            ) : (
                                <>
                                    <span className="icon">🎤</span>
                                    Speak Question
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpeechSynthesizer;
