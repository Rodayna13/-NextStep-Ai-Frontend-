import { useEffect, useState, useRef, useCallback } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import useSpeak from './../../hooks/useSpeak';
import useTranscription from './handleTranscription';
import VoiceOrb from '../../components/VoiceOrb';

const DemoPage = () => {
    const speechRecognition = useSpeechRecognition();
    const { handleSpeak, currentText, isPlaying, audioRef, handleAudioEnd } = useSpeak();
    const { transcribeAudioSimple } = useTranscription();

    const [history, setHistory] = useState([
        { role: 'system', content: 'act as interviewer coach in arabic language with egyptian accent' },
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

            <VoiceOrb name="Nova" description="Bright and inquisitive" active={isPlaying} />

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
            </div>

            <audio
                ref={audioRef}
                onEnded={handleAudioEnd}
                className="demo-page__audio"
            />
            <div className="bottom-controls">
                <button title="Mic On" onClick={startRecording}>
                    <div>
                        <span className="material-symbols-outlined">mic</span>
                    </div>
                </button>

                <button
                    title="Show Transcript"
                    onClick={() =>
                        document
                            .getElementById("transcript-container")
                            .classList.toggle("transcript-visible")
                    }
                >
                </button>

                <button className="end-call" title="End Call">
                    <div>
                        <span className="material-symbols-outlined">call_end</span>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default DemoPage