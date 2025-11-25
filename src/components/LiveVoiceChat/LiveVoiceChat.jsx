import React, { useEffect, useRef, useState } from "react";
import "./AiVoiceChat.css";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import axios from "axios";
import { apiEndpoints } from "../../api/endpoints";
import LiveVoiceChatControls from './LiveVoiceChatControls';

export default function AiVoiceChat({ isVisible, sessionId, text }) {
  const [isAiSpeaking, setIsAiSpeaking] = useState(true);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const speechRecognition = useSpeechRecognition({ defaultLanguage: "ar-EG" });
  const POLLINATIONS_TTS_BASE = "https://text.pollinations.ai";
  const audioRef = useRef(null);
  const handleAudioEnd = () => setIsAiSpeaking(false);

  const handleSpeak = (text) => {
    const url = getTtsUrl(text, "nova");
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current
        .play()
        .then(() => setIsAiSpeaking(true))
        .catch(() => setIsAiSpeaking(false));
    }
  };

  function getTtsUrl(text, voice) {
    if (!text) return "";
    const prompt = `You are an interviewer coach. Speak in a friendly, clear, and professional. 
    Important: Pronounce all letters correctly and accurately. Maintain a natural rhythm and pace throughout your speech. 
    Read the following: ${text}`;
    return `${POLLINATIONS_TTS_BASE}/${encodeURIComponent(
      prompt
    )}?model=openai-audio&voice=${voice}&token=nPJv5oK3kjl4x32Y`;
  }

  useEffect(() => {
    handleSpeak(text);
    return () => speechRecognition.stopRecognition();
  }, [text]);

  useEffect(() => {
    if (speechRecognition.transcript) {
      const timeout = setTimeout(async () => {
        speechRecognition.stopRecognition();

        setIsUserSpeaking(false);
        setIsLoading(true);
        try {
          const response = await axios.post(
            `${apiEndpoints.InterviewPractice}/answer`,
            { sessionId, answer: speechRecognition.transcript }
          );
          // alert(response.data.response)
          setIsLoading(false);
          console.log("Interview practice started:", response.data.response);
          handleSpeak(response.data.response);
        } catch (error) {
          console.error("Error starting interview practice:", error);
        }
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [speechRecognition.transcript, isUserSpeaking]);




  const handleUserSpeakBtn = () => {

    if (!isUserSpeaking) {
      speechRecognition.stopRecognition();

      setTimeout(() => {
        speechRecognition.startRecognition();
      }, 100);

      setIsUserSpeaking(true);
    } else {
      setIsUserSpeaking(false);
      speechRecognition.stopRecognition();
    }

    setIsAiSpeaking(false);

  }
  const handleAISpeakBtn = () => {
    setIsAiSpeaking(!isAiSpeaking);
    setIsUserSpeaking(false);
  }

  return (
    <div className={`main-container ${isVisible ? "visible" : "hidden"}`}>
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        className="audio-hidden"
        controls
        autoPlay={true}
      />
      <div className="split">
        {/* ---------- Left Side (User) ---------- */}
        <div className={`left flex-col items-center justify-center gap-8 ${isUserSpeaking ? "speaking" : ""}`}>
          <div className={`avatar user-avatar user-avatar-bg ${isUserSpeaking ? "speaking-avatar" : ""}`} />
          <div className="text-center">
            <p className="user-name">You</p>
            <p className="user-status">
              {isUserSpeaking ? "Speaking" : "Listening"}
            </p>
          </div>
          <button
            className="mic-button"
            title="Push-to-Talk"
            onClick={handleUserSpeakBtn}
          >
            <span className="material-symbols-outlined">mic</span>
          </button>
          <div className="volume-bar">
            <div className="volume-bar-fill user-fill"></div>
          </div>
          transcript :
          <div className={`interim-transcript ${speechRecognition.interim || speechRecognition.transcript ? "visible" : ""
            }`}>
            {speechRecognition.transcript}
            <span className="interim-subtext">{speechRecognition.interim && " " + speechRecognition.interim}</span>
          </div>
        </div>

        {/* ---------- Right Side (AI) ---------- */}
        <div className={`right flex-col items-center justify-center gap-8 ${isAiSpeaking ? "speaking" : ""}`}>
          <div className={`avatar ai-avatar ai-avatar-bg ${isAiSpeaking ? "speaking-avatar" : ""}`} />

          <div className="text-center">
            <p className="ai-name">AI</p>
            <p className="ai-status">
              {isAiSpeaking ? "Speaking" : "Waiting for turn"}
            </p>
            {text}
          </div>

          <button
            className="ai-speak-button"
            title="Toggle AI Speaking"
            onClick={handleAISpeakBtn}
          >
            <span className="material-symbols-outlined">
              {isAiSpeaking ? "volume_up" : "volume_off"}
            </span>
          </button>

          <div className="volume-bar">
            <div className="volume-bar-fill ai-fill"></div>
          </div>
        </div>
      </div>

      {/* ---------- Waveform ---------- */}
      {isLoading && (
        <div className="waveform">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className={`waveform-bar i-${i + 1}`}></div>
          ))}
        </div>
      )}

      <p className="text-center connected">Connected</p>



      {/* ---------- Controls ---------- */}
      <LiveVoiceChatControls />
    </div>
  );
}
