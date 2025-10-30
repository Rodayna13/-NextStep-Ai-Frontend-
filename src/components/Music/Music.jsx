import React, { useState, useRef } from 'react';

const POLLINATIONS_TTS_BASE = 'https://text.pollinations.ai';

function getTtsUrl(text, voice = 'alloy') {
    if (!text) return '';
    const prompt = `u act as interviewer coach in arabic language and egpyt accent.
    u asked user about what frameworks and libraries they used in their previous projects and why they chose them.
    he said he is using react and nextjs for frontend and nodejs for backend.
    you asked about backend frameworks and databases
    he said he is working with mongodb and expressjs
    you asked have u ever worked with nest js
    he said that "i don't understand the question"
    you said  "NestJS is a progressive Node.js framework for building efficient, scalable, and reliable server-side applications using TypeScript and JavaScript."
    he said "oh yes i have worked with it in a previous project and i liked it because of its modular architecture and dependency injection system"
    you said "great to hear that! how do you handle authentication and authorization in your applications?"
    he said "i usually use JWT tokens for authentication and role-based access control for authorization"
    you asked "can you explain how JWT works?"
    he said "JWT is a JSON Web Token that is used to securely transmit information between parties as a JSON object. it is signed using a secret or a public/private key pair"
    continue
    `;
    return `${POLLINATIONS_TTS_BASE}/${encodeURIComponent(prompt)}?model=openai-audio&voice=${voice}&token=nPJv5oK3kjl4x32Y`;
}

const Music = () => {
    const [text, setText] = useState('مرحبا كيف حالك');
    const [voice, setVoice] = useState('nova'); // You can add more voices if needed
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const handleSpeak = () => {
        const url = getTtsUrl(text, voice);
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
    };

    const handleAudioEnd = () => setIsPlaying(false);

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
            <h2>🗣️ Text-to-Speech Demo</h2>
            <textarea
                rows={4}
                style={{ width: '100%', marginBottom: 12 }}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="اكتب النص هنا..."
                dir="auto"
            />
            <div style={{ marginBottom: 12 }}>
                <label>
                    Voice:
                    <select value={voice} onChange={e => setVoice(e.target.value)} style={{ marginLeft: 8 }}>
                        <option value="alloy">Alloy (default)</option>
                        <option value="echo">Echo</option>
                        <option value="fable">Fable</option>
                        <option value="onyx">Onyx</option>
                        <option value="nova">Nova</option>
                        <option value="shimmer">Shimmer</option>
                        {/* Add more voices if supported */}
                    </select>
                </label>
            </div>
            <button onClick={handleSpeak} disabled={isPlaying || !text.trim()}>
                {isPlaying ? 'Playing...' : 'Speak'}
            </button>
            <audio
                ref={audioRef}
                onEnded={handleAudioEnd}
                style={{ display: 'block', margin: '16px auto 0' }}
                controls
            />
        </div>
    );
};

export default Music;