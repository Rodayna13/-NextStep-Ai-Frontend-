import axios from 'axios';
import { apiEndpoints } from '../../../api/endpoints';

/**
 * Summarize chat conversation
 * @param {Array} messages - Array of chat messages
 * @returns {Promise<string|null>} Summary or null if failed
 */
export const summarizeChat = async (messages) => {
    if (messages.length <= 2) return null; // Skip if only system + initial greeting

    try {
        const response = await axios.post(
            `${apiEndpoints.BASE_URL}/api/summarize-chat`,
            { messages: messages.filter(msg => msg.role !== 'system') }
        );

        if (response.data.success) {
            console.log('✅ Chat summary generated:', response.data.summary);
            return response.data.summary;
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error summarizing chat:', error);
        return null;
    }
};

/**
 * Process AI response with TTS and transcription
 * @param {Array} conversationHistory - Conversation history
 * @param {Function} handleSpeak - TTS function
 * @param {Function} transcribeAudioSimple - Transcription function
 * @param {string} voice - Voice to use for TTS
 * @returns {Promise<string|null>} Bot response or null if failed
 */
export const processAIResponse = async (conversationHistory, handleSpeak, transcribeAudioSimple, voice = 'alloy') => {
    try {
        const conversationText = conversationHistory
            .map(item => typeof item === 'string' ? item : `${item.role}: ${item.content}`)
            .join('\n');

        const audioBlob = await handleSpeak(conversationText, voice);
        const botResponse = await transcribeAudioSimple(audioBlob);

        return botResponse;
    } catch (error) {
        console.error('Error processing AI response:', error);
        return null;
    }
};
