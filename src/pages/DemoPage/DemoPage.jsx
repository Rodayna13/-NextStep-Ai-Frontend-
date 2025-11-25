import { useState } from 'react';
import axios from 'axios';
import { apiEndpoints } from '../../api/endpoints';
import CustomAssistant from '../../components/CustomAssistant/CustomAssistant';
import '../../components/LiveVoiceChat/AIVoiceChat.css';
import useSpeak from '../../hooks/useSpeak';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import AIPanel from './components/AIPanel';
import AnalysisResult from './components/AnalysisResult';
import ControlPanel from './components/ControlPanel';
import UserPanel from './components/UserPanel';
import Waveform from './components/Waveform';
import { useInterviewSession } from './hooks/useInterviewSession';
import { generateSystemPrompt, getInitialGreeting } from './utils/promptGenerator';

const DemoPage = () => {
    const [showConfig, setShowConfig] = useState(true);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { handleSpeak, isPlaying, audioRef, handleAudioEnd } = useSpeak();
    const speechRecognition = useSpeechRecognition({ defaultLanguage: 'ar-EG' });

    const {
        history,
        isProcessing,
        setAssistantConfig,
        processAIResponse
    } = useInterviewSession(handleSpeak, speechRecognition);

    const handleEndCall = async () => {
        if (history.length < 2) {
            alert('No conversation to analyze yet!');
            return;
        }

        setIsAnalyzing(true);
        try {
            // Get user email from localStorage or use default
            const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';

            const response = await axios.post(
                `${apiEndpoints.BASE_URL}/api/analyze-chat`,
                {
                    userEmail,
                    conversation: history.filter(msg => msg.role !== 'system')
                }
            );

            if (response.data.success) {
                setAnalysisResult(response.data.analysis);
            } else {
                alert('Failed to analyze conversation');
            }
        } catch (error) {
            console.error('❌ Analysis error:', error);
            alert('Error analyzing conversation: ' + error.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleStartSession = (config) => {
        setAssistantConfig(config);

        // Update speech recognition language
        if (config.language !== speechRecognition.defaultLanguage) {
            speechRecognition.defaultLanguage = config.language;
        }

        setShowConfig(false);

        // Start AI speaking with greeting
        setTimeout(() => {
            processAIResponse([
                {
                    role: "system",
                    content: generateSystemPrompt(config)
                },
                {
                    role: "assistant",
                    content: getInitialGreeting(config.language)
                }
            ]);
        }, 100);
    };

    if (showConfig) {
        return <CustomAssistant onStartSession={handleStartSession} />;
    }
    return (
        <div className="main-container visible">
            <audio
                ref={audioRef}
                onEnded={handleAudioEnd}
                className="audio-hidden"
                controls
                autoPlay={true}
            />

            <div className="split">
                <UserPanel
                    isRecording={speechRecognition.isRecording}
                    transcript={speechRecognition.transcript}
                    interim={speechRecognition.interim}
                    onStartRecording={() => {
                        console.log('🎤 Mic button clicked, isRecording:', speechRecognition.isRecording);
                        if (!isProcessing && !isPlaying) {
                            if (speechRecognition.isRecording) {
                                // Stop recording
                                console.log('⏹️ Stopping recording');
                                speechRecognition.stopRecognition();
                            } else {
                                // Start recording
                                console.log('▶️ Starting recording');
                                audioRef.current?.pause();
                                audioRef.current.currentTime = 0;
                                speechRecognition.resetRecognition();
                                speechRecognition.startRecognition();
                            }
                        }
                    }}
                />

                <AIPanel
                    isPlaying={isPlaying}
                    audioRef={audioRef}
                />
            </div>

            <Waveform isVisible={isProcessing} />

            <p className="text-center connected">Connected</p>

            <ControlPanel
                onStartRecording={() => {
                    if (!isProcessing && !isPlaying) {
                        audioRef.current?.pause();
                        audioRef.current.currentTime = 0;
                        speechRecognition.resetRecognition();
                        speechRecognition.startRecognition();
                    }
                }}
                onEndCall={handleEndCall}
            />

            {/* Analysis Result Modal */}
            {analysisResult && (
                <AnalysisResult 
                    analysis={analysisResult} 
                    onClose={() => setAnalysisResult(null)} 
                />
            )}

            {/* Loading Overlay */}
            {isAnalyzing && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    zIndex: 999
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '2rem' }}>⏳</div>
                        <div>جاري تحليل أدائك...</div>
                        <div style={{ fontSize: '1rem', opacity: 0.8 }}>Analyzing your performance...</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DemoPage