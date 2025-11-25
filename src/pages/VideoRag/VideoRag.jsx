

import React, { useState, useEffect } from "react";
import "./VideoRag.css";
import axios from "axios";
import { apiEndpoints } from './../../api/endpoints';
import { useForm } from "react-hook-form";
import VideoPlayer from './../../components/VideoPlayer/VideoPlayer';
import useTypewriterEffect from '../../hooks/useTypewriterEffect';

// TypewriterMessage Component
const TypewriterMessage = ({ text, onComplete }) => {
    const { displayedText, isTyping } = useTypewriterEffect(text, 20);
    
    React.useEffect(() => {
        if (!isTyping && displayedText && onComplete) {
            onComplete();
        }
    }, [isTyping, displayedText, onComplete]);
    
    // Return the displayed text with formatting applied
    if (!displayedText) return '';
    
    return displayedText.split('\n').map((line, i) => {
        // Remove leading " - " or "- " from the line
        const cleanedLine = line.replace(/^\s*-\s*/, '');

        // Check if line starts with numbered pattern like "1. text:" or "2. text:"
        const isNumberedItem = /^\d+\.\s+.+:/.test(cleanedLine);

        const parts = cleanedLine.split(/(\*\*.*?\*\*)/).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });

        const content = (
            <React.Fragment key={i}>
                {parts}
                {i < displayedText.split('\n').length - 1 && <br />}
            </React.Fragment>
        );

        // Wrap numbered items in a container
        if (isNumberedItem) {
            return (
                <div 
                    key={i} 
                    className="numbered-item"
                 
                >
                    {parts}
                    {i < displayedText.split('\n').length - 1 && <br />}
                </div>
            );
        }

        return content;
    });
};

export default function CVAssistant() {
    const [messages, setMessages] = useState([]);
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [videoStores, setVideoStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const formatText = (text) => {
        if (!text) return '';

        return text.split('\n').map((line, i) => {
            // Remove leading " - " or "- " from the line
            const cleanedLine = line.replace(/^\s*-\s*/, '');

            // Check if line starts with numbered pattern like "1. text:" or "2. text:"
            const isNumberedItem = /^\d+\.\s+.+:/.test(cleanedLine);

            const parts = cleanedLine.split(/(\*\*.*?\*\*)/).map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });

            const content = (
                <React.Fragment key={i}>
                    {parts}
                    {i < text.split('\n').length - 1 && <br />}
                </React.Fragment>
            );

            // Wrap numbered items in a container
            if (isNumberedItem) {
                return (
                    <div 
                        key={i} 
                        className="numbered-item"
                        style={{
                            padding: '4px 8px',
                            margin: '4px 0',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(232, 232, 232, 0.325)',
                            fontWeight: '500'
                        }}
                    >
                        {parts}
                        {i < text.split('\n').length - 1 && <br />}
                    </div>
                );
            }

            return content;
        });
    }

    const { register, handleSubmit, reset } = useForm();
    const [videoList, setVideoList] = useState([]);
    
    useEffect(() => {
        // Fetch video stores on component mount
        axios.get(apiEndpoints.videoStores)
            .then(res => {
                const files = res.data.files || [];
                setVideoStores(files);
                if (files.length > 0) {
                    setSelectedStore(files[0].filename);
                }
            })
            .catch(err => {
                console.error('Error fetching video stores:', err);
            });
    }, []);
    
    const onSubmit = (data) => {
        if (!data.prompt?.trim()) return;
        const userMessage = { sender: "user", text: data.prompt };
        setMessages([...messages, userMessage]);
        setIsApiLoading(true);
        console.log('selectedStore  ' , selectedStore);
        axios.post(apiEndpoints.videoRag, {
            query: data.prompt,
            vectorStoreFile: selectedStore
        }).then(res => {
            setIsApiLoading(false);
            const botMessage = { 
                sender: "bot", 
                text: res.data.answer || "No response received",
                id: Date.now(),
                isTyping: true
            };
            setMessages(prev => [...prev, botMessage]);
            setVideoList(res.data.videoUrls || []);
        }).catch(err => {
            console.error('Error:', err);
            setIsApiLoading(false);
            setMessages(prev => [...prev, { 
                sender: "bot", 
                text: "Sorry, there was an error processing your request.",
                id: Date.now(),
                isTyping: false
            }]);
        });
        reset();
    };

    return (
        <div className="app-container light">
            <div className="layout">
                {/* الشريط الجانبي */}
                <aside className="sidebar">
                    <div className="sidebar-inner">
                        <div className="profile-section">
                            <div className="avatar" />
                     
                        </div>

                        <div className="chat-list">
                            {videoStores.length > 0 ? (
                                videoStores.map((store, index) => (
                                    <div 
                                        key={index} 
                                        className={`chat-item ${selectedStore === store.filename ? 'active' : ''}`}
                                        onClick={() => setSelectedStore(store.filename)}
                                        style={{cursor: 'pointer'}}
                                    >
                                        <span className="icon">🎥</span>
                                        <p>{store.name}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="chat-item">
                                    <span className="icon">📂</span>
                                    <p>لا توجد ملفات فيديو</p>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* المحادثة الرئيسية */}
                <main className="main">
                    {/* الرأس */}
                    <header className="header">
                        <div className="header-left">
                            <div className="avatar small" />
                            <div>
                                <h2 className="header-title">
                                     مساعد السيرة الذاتية 
                                    {selectedStore && videoStores.length > 0 && (
                                        <span> in {videoStores.find(s => s.filename === selectedStore)?.name || ''}</span>
                                    )}
                                </h2>
                                <p className="header-sub">اسألني أي شيء عن سيرتك الذاتية</p>
                            </div>
                        </div>
                        <button className="more-btn">⋮</button>
                    </header>

                    {/* رسائل المحادثة */}
                    <div className="chat-window">
                        {messages.map((msg, idx) => (
                            <div key={msg.id || idx} className={`msg-row ${msg.sender}`}>
                                <div className={`msg-bubble ${msg.sender}-bubble`} dir="rtl">
                                    {msg.sender === 'bot' && msg.isTyping ? (
                                        <TypewriterMessage 
                                            text={msg.text}
                                            onComplete={() => {
                                                console.log('Typewriter completed for message:', msg.id);
                                                setMessages(prev => prev.map(m => 
                                                    m.id === msg.id ? { ...m, isTyping: false } : m
                                                ));
                                            }}
                                        />
                                    ) : (
                                        formatText(msg.text)
                                    )}
                                    {
                                        msg.sender === 'bot' && !msg.isTyping && videoList.length > 0 && idx === messages.length - 1 && (
                                            <div className="video-embed mx-auto" dir="ltr">
                                                <VideoPlayer
                                                    src={videoList[0]}
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        ))}



                        {/* <div className="mx-auto">
                            <video src={videoList[0]} width={800} height={420} controls autoPlay loop muted>
                            </video>
                        </div> */}

                        {isApiLoading && (
                            <div className="typing">
                                <div className="dot" />
                                <div className="dot" />
                                <div className="dot" />
                            </div>
                        )}
                    </div>

                    {/* الإدخال */}
                    <form className="input-area" onSubmit={handleSubmit(onSubmit)}>
                        <textarea
                            placeholder="اطلب مني اى سؤال ..."
                            {...register("prompt", { required: true })}
                            autoComplete="off"
                            rows={1}
                            dir="rtl"
                        // onKeyDown={(e) => {
                        //     if (e.key === 'Enter') {
                        //     handle Submit
                        //     }

                        // }}
                        />
                        <button className="send-btn" type="submit">إرسال</button>
                    </form>
                </main>
            </div >
        </div >
    );
}
