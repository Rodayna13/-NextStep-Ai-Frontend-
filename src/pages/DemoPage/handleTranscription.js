import { useState } from "react";
import axios from "axios";

const useTranscription = () => {
    const [isTranscribing, setIsTranscribing] = useState(false);
    
    const transcribeAudioSimple = async (audioBlob) => {
        setIsTranscribing(true);
        const ASSEMBLY_AI_KEY = import.meta.env.VITE_ASSEMBLY_AI_KEY;

        try {
            // Step 1: Upload audio file
            const uploadResponse = await axios.post('https://api.assemblyai.com/v2/upload', audioBlob, {
                headers: {
                    'authorization': ASSEMBLY_AI_KEY,
                }
            });

            const { upload_url } = uploadResponse.data;

            // Step 2: Request transcription
            const transcriptResponse = await axios.post('https://api.assemblyai.com/v2/transcript', {
                audio_url: upload_url,
                language_code: 'ar' // Arabic
            }, {
                headers: {
                    'authorization': ASSEMBLY_AI_KEY,
                    'content-type': 'application/json'
                }
            });

            const { id } = transcriptResponse.data;

            // Step 3: Poll for completion
            let transcript = null;
            while (!transcript || transcript.status !== 'completed') {
                await new Promise(resolve => setTimeout(resolve, 1000));

                const pollingResponse = await axios.get(`https://api.assemblyai.com/v2/transcript/${id}`, {
                    headers: {
                        'authorization': ASSEMBLY_AI_KEY
                    }
                });

                transcript = pollingResponse.data;

                if (transcript.status === 'error') {
                    throw new Error('Transcription failed');
                }
            }

       
            setIsTranscribing(false);
            return transcript.text;

        } catch (error) {
            console.error('Transcription failed:', error);
            setIsTranscribing(false);
            return '';
        }
    };

    return { transcribeAudioSimple, isTranscribing };
};

export default useTranscription;