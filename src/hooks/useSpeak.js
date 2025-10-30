import axios from "axios";
import { useRef, useState } from "react";

const useSpeak = () => {
    const [currentText, setCurrentText] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const handleAudioEnd = () => {
        setIsPlaying(false);
    };

    const handleSpeak = async (text, voice) => {
        if (!text) return '';
        const prompt = text;
        const url = `${'https://text.pollinations.ai'}/${encodeURIComponent(prompt)}?model=openai-audio&voice=${voice}&token=nPJv5oK3kjl4x32Y`;

        setCurrentText(text);

        try {
            const response = await axios.get(url, { responseType: 'blob' });
            const audioBlob = response.data;
            const audioUrl = URL.createObjectURL(audioBlob);


            if (audioRef.current) {
                audioRef.current.src = audioUrl;

                audioRef.current.playbackRate = 0.95;

                await audioRef.current.play();
                setIsPlaying(true);
            }

            return audioBlob;

        } catch (error) {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
            setCurrentText('');
        }
    };

    return { handleSpeak, currentText, isPlaying, audioRef, handleAudioEnd };
};

export default useSpeak;