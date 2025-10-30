import React, { useEffect, useRef, useState } from "react";
import "./AiVoiceChat.css";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import axios from "axios";
import { apiEndpoints } from "../../api/endpoints";

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

  return (
    <div
      className="main-container"
      style={{ display: isVisible ? "flex" : "none" }}
    >
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        style={{ display: "none" }}
        controls
        autoPlay={true}
      />
      <div className="split">
        {/* ---------- Left Side (User) ---------- */}
        <div
          className={`left flex-col items-center justify-center gap-8 ${
            isUserSpeaking ? "speaking" : ""
          }`}
        >
          <div
            className={`avatar user-avatar ${
              isUserSpeaking ? "speaking-avatar" : ""
            }`}
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoVbGVJ2dMzVCXv-3cDzhSVNuIPIOejlOeMWcIFb29-uZ_MOxFkdM_LLatTUeMZR32JZlutmQZSOg7TSHAdKqfUOawDwMe4C-VTQmlVGEL5ruOh9Ar3JPrDuQsz-EoK2WRXlUh2OX-Oh256PhSkBm1iC5jQ4zpJYSsLSrOCz_jcN0gLyF6clsgDwFwYTH1NjjlH0l70ZjHXui4Q_WkM1R3LdvGgeKY7_ZA3QMQgAkbN2TN_obgr96YuOOgBJEbTUgcp5yt3_0Bkqo")',
            }}
          ></div>
          <div className="text-center">
            <p className="user-name">You</p>
            <p className="user-status">
              {isUserSpeaking ? "Speaking" : "Listening"}
            </p>
          </div>
          <button
            className="mic-button"
            title="Push-to-Talk"
            onClick={() => {
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
            }}
          >
            <span className="material-symbols-outlined">mic</span>
          </button>
          <div className="volume-bar">
            <div
              className="volume-bar-fill user-fill"
              style={{ height: isUserSpeaking ? "60%" : "10%" }}
            ></div>
          </div>
          transcript :
          <div
            style={{
              display:
                speechRecognition.interim || speechRecognition.transcript
                  ? "block"
                  : "none",
              background: "rgba(255,255,255,0.35)",
              borderRadius: "1rem",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              backdropFilter: "blur(8px)",
              padding: "0.75rem 1.25rem",
              margin: "0.5rem 0",
              border: "1px solid rgba(255,255,255,0.5)",
              color: "#222",
              fontWeight: 500,
              fontSize: "1.1rem",
              letterSpacing: "0.01em",
              textShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            {speechRecognition.transcript}
            <span style={{ color: "#aaa" }}>
              {speechRecognition.interim && " " + speechRecognition.interim}
            </span>
          </div>
        </div>

        {/* ---------- Right Side (AI) ---------- */}
        <div
          className={`right flex-col items-center justify-center gap-8 ${
            isAiSpeaking ? "speaking" : ""
          }`}
        >
          <div
            className={`avatar ai-avatar ${
              isAiSpeaking ? "speaking-avatar" : ""
            }`}
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB17O8_JtZ0602cyoM6TGbO_A13eexqB1xKziTqZEIrryHyIp2ltacJcfuluVQpRmAlK1vEX_2gVryf5i0azoFVxuZUcoU236NfCs6WaOTXRxfD7xOoKMA3LzP30zAhCQuGggCu_-fKqRa4gK3LdDLaB4M4yF5RvLWI5rImOxZFqBxKsJibAO6fN14CgFR0FvZkOypv-h8-seBiOBlwqHPei0CClDiZwF1LTu9g8mr89ccqGlTKBAB66LEBOtLRAt8u65cHGuCXo88")',
            }}
          ></div>

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
            onClick={() => {
              setIsAiSpeaking(!isAiSpeaking);
              setIsUserSpeaking(false);
            }}
          >
            <span className="material-symbols-outlined">
              {isAiSpeaking ? "volume_up" : "volume_off"}
            </span>
          </button>

          <div className="volume-bar">
            <div
              className="volume-bar-fill ai-fill"
              style={{ height: isAiSpeaking ? "70%" : "10%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* ---------- Waveform ---------- */}
      {isLoading && (
        <div className="waveform">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{ "--i": i + 1 }}
            ></div>
          ))}
        </div>
      )}

      <p className="text-center connected">Connected</p>

      {/* ---------- Transcript ---------- */}
      <div className="transcript-container" id="transcript-container">
        <div className="message">
          <p>
            <strong className="user-status">You:</strong> Hey, can you help me
            brainstorm some ideas for a new project?
          </p>
        </div>
        <div className="message">
          <p>
            <strong className="ai-status">AI:</strong> Of course! I'd be happy
            to. What kind of project are you thinking about?
          </p>
        </div>
      </div>

      {/* ---------- Controls ---------- */}
      <div className="bottom-controls">
        <button title="Mute">
          <div>
            <span className="material-symbols-outlined">mic_off</span>
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
          <div>
            <span className="material-symbols-outlined">subtitles</span>
          </div>
        </button>

        <button className="end-call" title="End Call">
          <div>
            <span className="material-symbols-outlined">call_end</span>
          </div>
        </button>
      </div>
    </div>
  );
}
