import { useState, useCallback, useRef, useEffect } from 'react';
import { processAIResponse as processAI, summarizeChat } from '../utils/chatService';
import useTranscription from '../../../../../DemoPage_old/handleTranscription';

/**
 * Custom hook to manage interview session state and logic
 */
export const useInterviewSession = (handleSpeak, speechRecognition) => {
    const [history, setHistory] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [assistantConfig, setAssistantConfig] = useState(null);
    const assistantConfigRef = useRef(null);
    const hasProcessedTranscript = useRef(false);
    const lastTranscript = useRef('');
    const { transcribeAudioSimple } = useTranscription();

    // Keep ref in sync with state
    useEffect(() => {
        assistantConfigRef.current = assistantConfig;
    }, [assistantConfig]);

    /**
     * Process AI response and update history
     */
    const processAIResponse = useCallback(async (conversationHistory) => {
        if (isProcessing) return;
        setIsProcessing(true);
        hasProcessedTranscript.current = true; // Prevent re-processing

        try {
            const voiceToUse = assistantConfigRef.current?.voice || 'alloy';
        
  
            const botResponse = await processAI(conversationHistory, handleSpeak, transcribeAudioSimple, voiceToUse);

            if (botResponse) {
                const updatedHistory = [...conversationHistory, { role: 'assistant', content: botResponse }];
                setHistory(updatedHistory);

                // Calculate total token count (rough estimate: 1 token ≈ 4 characters)
                const totalChars = updatedHistory.reduce((sum, msg) => sum + msg.content.length, 0);
                const estimatedTokens = Math.ceil(totalChars / 4);

                // Only summarize if estimated tokens exceed 2000 (to stay under 4096 limit)
                if (estimatedTokens > 1000) {
                    console.log(`📊 Estimated tokens: ${estimatedTokens}, triggering summarization...`);
                    setIsSummarizing(true);
                    const chatSummary = await summarizeChat(updatedHistory);
                    if (chatSummary) {
                        setSummary(chatSummary);

                        // Replace old history with: system prompt + summary + last 2 exchanges
                        const systemMessage = updatedHistory.find(msg => msg.role === 'system');
                        const lastMessages = updatedHistory.slice(-4); // Keep last 2 exchanges (user + assistant)

                        const condensedHistory = [
                            systemMessage,
                            { role: 'system', content: `Previous conversation summary:\n${chatSummary}` },
                            ...lastMessages
                        ].filter(Boolean);

                        setHistory(condensedHistory);
                        const newTokens = Math.ceil(condensedHistory.reduce((sum, msg) => sum + msg.content.length, 0) / 4);
                        console.log(`✅ History condensed from ${estimatedTokens} to ${newTokens} tokens`);
                    }
                    setIsSummarizing(false);
                }
            }
        } catch (error) {
            console.error('Error processing AI response:', error);
        } finally {
            setIsProcessing(false);
            hasProcessedTranscript.current = false; // Reset after processing
        }
    }, [isProcessing, handleSpeak, transcribeAudioSimple, assistantConfig]);

    /**
     * Handle user speech completion
     */
    useEffect(() => {
        console.log('🎤 Speech state:', {
            isRecording: speechRecognition.isRecording,
            transcript: speechRecognition.transcript,
            lastTranscript: lastTranscript.current,
            isProcessing,
            hasProcessed: hasProcessedTranscript.current,
            historyLength: history.length
        });

        // Check if user finished speaking and we have a new transcript
        if (
            !speechRecognition.isRecording &&
            speechRecognition.transcript &&
            speechRecognition.transcript !== lastTranscript.current &&
            !isProcessing &&
            !hasProcessedTranscript.current &&
            history.length > 0
        ) {
            console.log('✅ Processing user input:', speechRecognition.transcript);
            lastTranscript.current = speechRecognition.transcript;

            const newHistory = [
                ...history,
                { role: 'user', content: speechRecognition.transcript }
            ];

            setHistory(newHistory);

            // Process AI response after a short delay
            setTimeout(() => {
                processAIResponse(newHistory);
            }, 100);
        }
    }, [
        speechRecognition.isRecording,
        speechRecognition.transcript,
        isProcessing,
        history,
        processAIResponse
    ]);

    return {
        history,
        setHistory,
        isProcessing,
        summary,
        isSummarizing,
        assistantConfig,
        setAssistantConfig,
        processAIResponse
    };
};
