import React from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

const supportedLanguages = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'ar-EG', label: 'Arabic (Egypt)' },
    { code: 'fr-FR', label: 'French (France)' },
    // Add more as needed
];

const Demo = () => {
    const {
        transcript,
        interim,
        isRecording,
        error,
        status,
        language,
        isSupported,
        startRecognition,
        stopRecognition,
        setLanguage,
    } = useSpeechRecognition({ defaultLanguage: supportedLanguages[0].code });

    return (
        <div style={{ maxWidth: 500, margin: '2rem auto', fontFamily: 'sans-serif' }}>
            <h2>Web Speech API Demo</h2>
            {!isSupported && (
                <div style={{ color: 'red', marginBottom: 16 }}>
                    Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.
                </div>
            )}
            <div style={{ marginBottom: 16 }}>
                <label htmlFor="language-select">Language: </label>
                <select
                    id="language-select"
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    disabled={isRecording}
                >
                    {supportedLanguages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ marginBottom: 16 }}>
                <button onClick={startRecognition} disabled={isRecording || !isSupported}>
                    Start
                </button>
                <button onClick={stopRecognition} disabled={!isRecording} style={{ marginLeft: 8 }}>
                    Stop
                </button>
            </div>
            <div style={{ marginBottom: 8 }}>
                <strong>Status:</strong> {status}
            </div>
            {error && (
                <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>
            )}
            <div style={{ minHeight: 40, border: '1px solid #ccc', borderRadius: 4, padding: 8, background: '#fafafa' }}>
                <strong>Transcript:</strong>
                <div style={{ color: '#333', marginTop: 4 }}>
                    {transcript}
                    <span style={{ color: '#aaa' }}>{interim && ' ' + interim}</span>
                </div>
            </div>
        </div>
    );
};

export default Demo;