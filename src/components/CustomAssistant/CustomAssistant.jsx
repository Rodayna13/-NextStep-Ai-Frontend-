import { useState, useEffect } from 'react';
import "./CustomAssistant.css";

const CustomAssistant = ({ onStartSession }) => {
    const [config, setConfig] = useState({
        voice: 'alloy',
        voiceImage: '',
        tone: 'Very Professional',
        energy: 'Moderate',
        difficulty: 5,
        focusAreas: ['Technical', 'Behavioral'],
        language: 'ar-EG',
        feedbackStyle: 'Only at the end'
    });

    const voices = [
        // Male voices - professional business portraits
        {
            name: 'alloy',
            gender: 'male',
            image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&crop=faces'
        },
        {
            name: 'ash',
            gender: 'male',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces'
        },
        {
            name: 'onyx',
            gender: 'male',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces'
        },
        {
            name: 'sage',
            gender: 'male',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces'
        },
        {
            name: 'ballad',
            gender: 'male',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces'
        },
        {
            name: 'verse',
            gender: 'male',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces'
        },
        // Female voices - professional business portraits
        {
            name: 'coral',
            gender: 'female',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces'
        },
        {
            name: 'echo',
            gender: 'female',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces'
        },
        {
            name: 'fable',
            gender: 'female',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces'
        },
        {
            name: 'nova',
            gender: 'female',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces'
        },
        {
            name: 'shimmer',
            gender: 'female',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces'
        }
    ];

    // Ensure there's a default voice image set on mount
    useEffect(() => {
        if (!config.voiceImage && voices && voices.length > 0) {
            setConfig((prev) => ({ ...prev, voiceImage: voices[0].image }));
        }
        // we only want to run this once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tones = ['Very Professional', 'Neutral', 'Warm', 'Enthusiastic' , 'Humorous'];
    const energyLevels = ['Low', 'Moderate', 'High', 'Very High'];
    const languages = [
        { value: 'ar-EG', label: 'العربية (Egyptian)' },
        { value: 'en-US', label: 'English' },
        { value: 'es-ES', label: 'Spanish' },
        { value: 'fr-FR', label: 'French' }
    ];
    const feedbackStyles = ['Only at the end', 'After each question'];

    const removeFocusArea = (area) => {
        setConfig({ ...config, focusAreas: config.focusAreas.filter(a => a !== area) });
    };

    const addFocusArea = () => {
        const newArea = prompt('Enter focus area:');
        if (newArea && !config.focusAreas.includes(newArea)) {
            setConfig({ ...config, focusAreas: [...config.focusAreas, newArea] });
        }
    };

    const handleStartSession = () => {
        if (onStartSession) {
            onStartSession(config);
        }
    };

    return (
        <div className="assistant-config-container">
            <main className="assistant-config-main">
                <div className="config-header">
                    <h1>Configure Your Interview Assistant</h1>
                    <p>Customize your personal interview coach to match your practice needs.</p>
                </div>

                <div className="config-card">
                    {/* Identity Section */}
                    <div className="config-section">
                        <h2 className="section-title">Identity</h2>
                        <div className="section-content">
                            <div className="config-row">
                                <label className="config-label">Voice Avatar</label>
                                <div className="avatar-slider">
                                    {voices.map((voice) => (
                                        <button
                                            key={voice.name}
                                            type="button"
                                            className={`avatar-wrapper ${config.voice === voice.name ? 'selected' : ''}`}
                                            style={{ minWidth: 72, flex: '0 0 auto', background: 'transparent', border: 'none' }}
                                            aria-pressed={config.voice === voice.name}
                                            onClick={() => setConfig({ ...config, voice: voice.name, voiceImage: voice.image })}
                                        >
                                            <div
                                                className="avatar-option"
                                                style={{ backgroundImage: `url(${voice.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                            />
                                            <span className="avatar-label">{voice.name.charAt(0).toUpperCase() + voice.name.slice(1)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personality Section */}
                    <div className="config-section">
                        <h2 className="section-title">Personality</h2>
                        <div className="section-content">
                            <div className="config-row">
                                <label className="config-label">Tone</label>
                                <div className="button-group">
                                    {tones.map(tone => (
                                        <button
                                            key={tone}
                                            className={`option-btn ${config.tone === tone ? 'selected' : ''}`}
                                            onClick={() => setConfig({ ...config, tone })}
                                        >
                                            {tone}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="config-row">
                                <label className="config-label">Energy</label>
                                <div className="button-group">
                                    {energyLevels.map(energy => (
                                        <button
                                            key={energy}
                                            className={`option-btn ${config.energy === energy ? 'selected' : ''}`}
                                            onClick={() => setConfig({ ...config, energy })}
                                        >
                                            {energy}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interview Structure Section */}
                    <div className="config-section">
                        <h2 className="section-title">Interview Structure</h2>
                        <div className="section-content">
                            <div className="config-row">
                                <label className="config-label" htmlFor="difficulty-slider">Difficulty</label>
                                <div className="slider-container">
                                    <input
                                        className="config-slider"
                                        id="difficulty-slider"
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={config.difficulty}
                                        onChange={(e) => setConfig({ ...config, difficulty: parseInt(e.target.value) })}
                                    />
                                    <span className="slider-value">{config.difficulty}</span>
                                </div>
                            </div>
                            <div className="config-row">
                                <label className="config-label">Focus Areas</label>
                                <div className="tags-container">
                                    {config.focusAreas.map(area => (
                                        <span key={area} className="tag">
                                            {area}
                                            <button onClick={() => removeFocusArea(area)}>
                                                <span className="material-symbols-outlined">close</span>
                                            </button>
                                        </span>
                                    ))}
                                    <button className="add-tag-btn" onClick={addFocusArea}>
                                        <span className="material-symbols-outlined">add</span>
                                        Add Area
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Communication Style Section */}
                    <div className="config-section">
                        <h2 className="section-title">Communication Style</h2>
                        <div className="section-content">
                            <div className="config-row">
                                <label className="config-label" htmlFor="language-select">Language</label>
                                <select
                                    className="config-select"
                                    id="language-select"
                                    value={config.language}
                                    onChange={(e) => setConfig({ ...config, language: e.target.value })}
                                >
                                    {languages.map(lang => (
                                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="config-row">
                                <label className="config-label">Feedback Style</label>
                                <div className="button-group">
                                    {feedbackStyles.map(style => (
                                        <button
                                            key={style}
                                            className={`option-btn ${config.feedbackStyle === style ? 'selected' : ''}`}
                                            onClick={() => setConfig({ ...config, feedbackStyle: style })}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="config-footer">
                        <button className="start-session-btn" onClick={handleStartSession}>
                            <span className="material-symbols-outlined">play_circle</span>
                            Start Session
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CustomAssistant;