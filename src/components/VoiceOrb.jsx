import React, { useState } from "react";
import "./VoiceOrb.css";

const VoiceOrb = ({ name = "Vale", description = "Bright and inquisitive", active }) => {


    return (
        <div className="voice-orb-page">
            <h2 className="voice-orb-title">Choose a voice</h2>
            <div className="voice-orb-container">
                <div
                    className={`voice-orb-gradient${active ? " voice-orb-active" : ""}`}

                >
                    <div className="voice-orb-highlight" />
                </div>
            </div>
            <div className="voice-orb-labels">
                <div className="voice-orb-name">{name}</div>
                <div className="voice-orb-desc">{description}</div>
            </div>
            {/* <div className="voice-orb-pagination">
        <span className="voice-orb-dot active" />
        {[...Array(7)].map((_, i) => (
          <span key={i} className="voice-orb-dot" />
        ))}
      </div> */}
        </div>
    );
};

export default VoiceOrb;
