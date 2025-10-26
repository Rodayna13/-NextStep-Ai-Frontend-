import { useState, useEffect } from 'react';

const useTypewriterEffect = (text, speed = 30) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!text) {
            setDisplayedText('');
            setIsTyping(false);
            return;
        }

        setDisplayedText('');
        setIsTyping(true);
        let index = 0;

        const timer = setInterval(() => {
            setDisplayedText(text.substring(0, index + 1));
            index++;

            if (index >= text.length) {
                setIsTyping(false);
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    const reset = () => {
        setDisplayedText('');
        setIsTyping(false);
    };

    return { displayedText, isTyping, reset };
};

export default useTypewriterEffect;