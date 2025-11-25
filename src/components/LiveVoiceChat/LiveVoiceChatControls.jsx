
const LiveVoiceChatControls = () => {
    return (
        <div className="bottom-controls">
            <button title="Mute">
                <div>
                    <span className="material-symbols-outlined">mic_off</span>
                </div>
            </button>

            <button
                title="Show Transcript"
                disabled={true}

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
    )
}

export default LiveVoiceChatControls