import { useEffect, useState, useRef, useCallback } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import useSpeak from './../../hooks/useSpeak';
import useTranscription from './handleTranscription';

const DemoPage = () => {
    const speechRecognition = useSpeechRecognition();
    const { handleSpeak, currentText, isPlaying, audioRef, handleAudioEnd } = useSpeak();
    const { transcribeAudioSimple } = useTranscription();

    const [history, setHistory] = useState([
        { role: 'system', content: 'act as my clingy girlfriend and start interview in arabic language and egypt accent' },
        { role: 'assistant', content: 'ask your first question about js' }
    ]);

    const [isProcessing, setIsProcessing] = useState(false);
    const hasProcessedTranscript = useRef(false);

    // Process AI response
    const processAIResponse = useCallback(async (conversationHistory) => {
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            const conversationText = conversationHistory
                .map(item => typeof item === 'string' ? item : `${item.role}: ${item.content}`)
                .join('\n');

            const audioBlob = await handleSpeak(conversationText, 'nova');
            const botResponse = await transcribeAudioSimple(audioBlob);

            if (botResponse) {
                setHistory(prev => [...prev, { role: 'assistant', content: botResponse }]);
            }
        } catch (error) {
            console.error('Error processing AI response:', error);
        } finally {
            setIsProcessing(false);
        }
    }, [isProcessing, handleSpeak, transcribeAudioSimple]);

    // Initialize conversation
    useEffect(() => {
        processAIResponse(history);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle user speech completion
    useEffect(() => {
        if (
            speechRecognition.isRecording &&
            speechRecognition.transcript &&
            !speechRecognition.isSpeaking &&
            !isProcessing &&
            !hasProcessedTranscript.current
        ) {
            hasProcessedTranscript.current = true;

            const newHistory = [
                ...history,
                { role: 'user', content: speechRecognition.transcript }
            ];

            setHistory(newHistory);
            speechRecognition.stopRecognition();

            // Process AI response after a short delay to ensure state is updated
            setTimeout(() => {
                processAIResponse(newHistory);
            }, 100);
        }

        // Reset flag when recording stops
        if (!speechRecognition.isRecording) {
            hasProcessedTranscript.current = false;
        }
    }, [
        speechRecognition.isRecording,
        speechRecognition.transcript,
        speechRecognition.isSpeaking,
        isProcessing,
        history,
        speechRecognition,
        processAIResponse
    ]);

    const startRecording = () => {
        if (!isProcessing && !isPlaying) {
            audioRef.current?.pause();
            audioRef.current.currentTime = 0;
            speechRecognition.resetRecognition();
            speechRecognition.startRecognition();
        }
    };




    return (
        <div className="demo-page">
            <h1>AI Interview Coach</h1>
            <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
                Click the circle to start a conversation
            </p>

            {/* Talking Avatar Circle */}
            <div className="avatar-container">
                <div
                    className={`bot-avatar-container ${
                        isPlaying ? 'avatar-playing' :
                        speechRecognition.isRecording ? 'avatar-listening' :
                        isProcessing ? 'avatar-processing' : ''
                    }`}
                    onClick={startRecording}
                    style={{
                        cursor: isProcessing || isPlaying ? 'not-allowed' : 'pointer',
                        opacity: isProcessing || isPlaying ? 0.8 : 1
                    }}
                >
                    <div className="avatar-content">
                        {isProcessing && (
                            <div className="processing-indicator">
                                <div className="dot dot1"></div>
                                <div className="dot dot2"></div>
                                <div className="dot dot3"></div>
                            </div>
                        )}

                        {speechRecognition.isRecording && (
                            <div className="listening-indicator">
                                <span className="mic-icon">🎤</span>
                                <div className="sound-wave">
                                    <div className="wave-bar"></div>
                                    <div className="wave-bar"></div>
                                    <div className="wave-bar"></div>
                                    <div className="wave-bar"></div>
                                </div>
                            </div>
                        )}

                        {isPlaying && (
                            <div className="speaking-indicator">
                                <span className="speaker-icon">🔊</span>
                                <div className="mouth-animation">
                                    <div className="mouth-line"></div>
                                </div>
                            </div>
                        )}

                        {!isProcessing && !speechRecognition.isRecording && !isPlaying && (
                            <div className="idle-indicator">
                                <span className="face-icon">😊</span>
                                <p className="tap-text">Tap to talk</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Display */}
            <div className="status-display">
                {speechRecognition.interim && (
                    <div className="status-item listening">
                        <span className="status-icon">👂</span>
                        <span className="status-text">{speechRecognition.interim}</span>
                    </div>
                )}

                {speechRecognition.transcript && (
                    <div className="status-item transcript">
                        <span className="status-icon">💬</span>
                        <span className="status-text">{speechRecognition.transcript}</span>
                    </div>
                )}

                {currentText && (
                    <div className="status-item speaking">
                        <span className="status-icon">🎯</span>
                        <span className="status-text">{currentText}</span>
                    </div>
                )}

                {isProcessing && (
                    <div className="status-item processing">
                        <span className="status-icon">🤖</span>
                        <span className="status-text">Thinking...</span>
                    </div>
                )}
            </div>

            <audio
                ref={audioRef}
                onEnded={handleAudioEnd}
                className="demo-page__audio"
            />

            {/* Minimal Controls */}
            <div className="minimal-controls">
                <button
                    className="control-btn stop-btn"
                    onClick={() => {
                        audioRef.current?.pause();
                        speechRecognition.stopRecognition();
                    }}
                    title="Stop everything"
                >
                    ⏹️
                </button>

                <button
                    className="control-btn reset-btn"
                    onClick={() => speechRecognition.resetRecognition()}
                    title="Reset conversation"
                >
                    🔄
                </button>
            </div>
        </div>
    )

            <div className="current-status">
                {speechRecognition.interim && (
                    <div style={{ marginBottom: '10px', fontStyle: 'italic', color: '#666' }}>
                        <strong>Listening:</strong> {speechRecognition.interim}
                    </div>
                )}

                {speechRecognition.transcript && (
                    <div className="demo-page__transcript" style={{
                        marginBottom: '10px',
                        padding: '10px',
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '5px'
                    }}>
                        <p><strong>Current Transcript:</strong> {speechRecognition.transcript}</p>
                    </div>
                )}

                {currentText && (
                    <div className="demo-page__question" style={{
                        marginBottom: '10px',
                        padding: '10px',
                        backgroundColor: '#d1ecf1',
                        border: '1px solid #bee5eb',
                        borderRadius: '5px'
                    }}>
                        <p><strong>AI Speaking:</strong> {currentText}</p>
                        <p><strong>Status:</strong> {isPlaying ? '🔊 Playing...' : '🔇 Stopped'}</p>
                    </div>
                )}

                {isProcessing && (
                    <div style={{
                        marginBottom: '10px',
                        padding: '10px',
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '5px',
                        textAlign: 'center'
                    }}>
                        <strong>🤖 Processing AI response...</strong>
                    </div>
                )}
            </div>

            <audio
                ref={audioRef}
                onEnded={handleAudioEnd}
                className="demo-page__audio"
            />

            <div className="controls" style={{ marginTop: '20px' }}>
                <button
                    className={`btn ${speechRecognition.isRecording ? 'btn-danger' : 'btn-primary'}`}
                    onClick={startRecording}
                    disabled={isProcessing || isPlaying}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: isProcessing || isPlaying ? 'not-allowed' : 'pointer',
                        opacity: isProcessing || isPlaying ? 0.6 : 1
                    }}
                >
                    {speechRecognition.isRecording ? '🔴 Recording...' : '🎤 Start Recording'}
                </button>

                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        audioRef.current?.pause();
                        speechRecognition.stopRecognition();
                    }}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    ⏹️ Stop
                </button>

                <button
                    className="btn btn-warning"
                    onClick={() => speechRecognition.resetRecognition()}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    � Reset
                </button>
            </div>
        </div>
    )
}

export default DemoPage