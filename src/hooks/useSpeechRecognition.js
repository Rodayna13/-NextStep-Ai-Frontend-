import { useRef, useState, useCallback } from 'react';

export function useSpeechRecognition({ defaultLanguage = 'ar-eg', onResult, onError, onSilence } = {}) {
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('🟢 Ready');
  const [language, setLanguage] = useState(defaultLanguage);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const isSupported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  // Create recognition instance only once
  const getRecognition = useCallback(() => {
    if (!isSupported) return null;
    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      recognitionRef.current = recognition;
    }
    return recognitionRef.current;
  }, [isSupported, language]);

  const showError = useCallback((msg) => {
    setError(msg);
    setStatus('❌ Error');
    if (onError) onError(msg);
  }, [onError]);

  const updateStatus = useCallback((label) => {
    setStatus(label);
  }, []);

  const startSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      setIsSpeaking(false);
      updateStatus('🟢 Ready (silence detected)');
      if (onSilence) onSilence();
    }, 1200);
  }, [onSilence, updateStatus]);

  const resetSilenceTimer = useCallback(() => {
    setIsSpeaking(true);
    updateStatus('🔴 Recording... (speaking)');
    startSilenceTimer();
  }, [startSilenceTimer, updateStatus]);

  const updateTranscript = useCallback((text, isFinal) => {
    if (isFinal) {
      setTranscript((prev) => prev + (prev ? ' ' : '') + text);
      setInterim('');
      if (onResult) onResult(text, true);
    } else {
      setInterim(text);
      if (onResult) onResult(text, false);
    }
  }, [onResult]);

  const startRecognition = useCallback(() => {
    if (!isSupported) return;
    const recognition = getRecognition();
    if (!recognition) return;

    recognition.lang = language;

    recognition.onstart = () => {
      updateStatus('🔴 Recording...');
      setIsRecording(true);
      setTranscript('');
      setInterim('');
      setError('');
      setIsSpeaking(false);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      if (finalTranscript) {
        updateTranscript(finalTranscript.trim(), true);
        resetSilenceTimer();
      } else if (interimTranscript) {
        updateTranscript(interimTranscript, false);
        resetSilenceTimer();
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        showError('Microphone access denied. Please allow microphone permission.');
      } else {
        showError('Speech recognition error: ' + event.error);
      }
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      } else {
        updateStatus('🟢 Ready');
      }
    };

    recognition.start();
  }, [getRecognition, isSupported, language, updateStatus, updateTranscript, showError, isRecording, resetSilenceTimer]);

  const stopRecognition = useCallback(() => {
    setIsRecording(false);
    setIsSpeaking(false);
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    const recognition = getRecognition();
    if (recognition) {
      recognition.onend = null;
      recognition.stop();
    }
  }, [getRecognition]);

  const handleLanguageChange = useCallback((newLang) => {
    setLanguage(newLang);
    const recognition = getRecognition();
    if (recognition) {
      recognition.lang = newLang;
    }
  }, [getRecognition]);

  const resetRecognition = useCallback(() => {
    setTranscript('');
    setInterim('');
    setError('');
    setStatus('🟢 Ready');
    setIsSpeaking(false);
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  return {
    transcript,
    interim,
    isRecording,
    isSpeaking,
    error,
    status,
    language,
    isSupported,
    startRecognition,
    stopRecognition,
    setLanguage: handleLanguageChange,
    resetRecognition,
  };
}
