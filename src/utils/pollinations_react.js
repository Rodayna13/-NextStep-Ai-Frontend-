// pollinations_react.js
// Utility to speak text using browser TTS with Arabic support

// Detect if text contains Arabic characters
function isArabicText(text) {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicPattern.test(text);
}

export function speakText(text, options = {}) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        // Wait for voices to load
        const speak = () => {
            const utterance = new window.SpeechSynthesisUtterance(text);
            utterance.rate = options.rate || 0.85;
            utterance.pitch = options.pitch || 1.0;
            utterance.volume = options.volume || 1.0;
            
            const voices = window.speechSynthesis.getVoices();
            
            // Auto-detect Arabic text or use specified language
            const isArabic = options.lang?.startsWith('ar') || isArabicText(text);
            
            if (isArabic) {
                // Try to find the best Arabic voice (Egyptian preferred)
                const arabicVoice = voices.find(v => 
                    v.lang.includes('ar-EG') || // Egyptian Arabic
                    v.lang.includes('ar-SA') || // Saudi Arabic
                    v.lang.includes('ar-') ||   // Any Arabic dialect
                    v.lang === 'ar' ||
                    v.name.toLowerCase().includes('arabic') ||
                    v.name.includes('Hoda') ||
                    v.name.includes('Naayf')
                );
                
                if (arabicVoice) {
                    utterance.voice = arabicVoice;
                    utterance.lang = arabicVoice.lang;
                    console.log('Using Arabic voice:', arabicVoice.name, arabicVoice.lang);
                } else {
                    utterance.lang = 'ar-EG'; // Default to Egyptian Arabic
                    console.log('No Arabic voice found, using default language setting');
                }
            } else {
                // Default to English for non-Arabic text
                utterance.lang = options.lang || 'en-US';
            }
            
            if (options.voice) utterance.voice = options.voice;
            
            window.speechSynthesis.speak(utterance);
        };
        
        // Ensure voices are loaded before speaking
        if (window.speechSynthesis.getVoices().length > 0) {
            speak();
        } else {
            window.speechSynthesis.onvoiceschanged = speak;
        }
    } else {
        alert('Speech synthesis not supported / تطبيق الكلام غير مدعوم');
    }
}
