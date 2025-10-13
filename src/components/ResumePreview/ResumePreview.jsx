import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import ResumeTemplate1 from '../templates/ResumeTemplate1';
import './ResumePreview.css';

const ResumePreview = ({setColWidth , colWidth}) => {
    const [zoomLevel, setZoomLevel] = useState(0.67);
    const resumeRef = useRef();


    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.1, 2)); // Max zoom 200%
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.1, 0.3)); // Min zoom 30%
    };

    const handleResetZoom = () => {
        setZoomLevel(0.67); // Reset to original size
    };

    const handleDownload = () => {
        const element = resumeRef.current;
        const options = {
            margin: 0,
            filename: "Resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, scrollY: 0 },
            jsPDF: { unit: "pt", format: "a4", orientation: "portrait" }
        };
        html2pdf().set(options).from(element).save();
    };

    return (
        <div className={colWidth}>

            <div className='d-flex resume-form-container flex-column  align-items-center' style={{ minHeight: '70vh', position: 'relative' }}>
                {/* Floating Zoom Controls */}

                {
                    colWidth === 'col-6' && (
                        <div className="floating-zoom-controls">
                            <button
                                onClick={handleZoomOut}
                                className="zoom-btn zoom-out-btn"
                                title="Zoom Out"
                            >
                                −
                            </button>
                            <button
                                onClick={handleZoomIn}
                                className="zoom-btn zoom-in-btn"
                                title="Zoom In"
                            >
                                +
                            </button>
                            <span className="zoom-level-display">
                                {Math.round(zoomLevel * 100)}%
                            </span>
                            <button
                                onClick={handleResetZoom}
                                className="zoom-btn reset-btn"
                                title="Reset Zoom"
                            >
                                ⟲
                            </button>
                            <button
                                onClick={handleDownload}
                                className="zoom-btn download-btn"
                                title="Download PDF"
                            >
                                ⬇
                            </button>
                        </div>
                    )
                }


                {/* Resume Preview with Dynamic Zoom */}
                {/* Collapse Button */}
                <button 
                    onClick={() => setColWidth(prev => prev === 'col-6' ? 'col-0-5' : 'col-6')}
                    className="collapse-btn"
                    title={colWidth === 'col-6' ? 'Minimize Preview' : 'Expand Preview'}
                >
                    {colWidth === 'col-6' ? '⮜' : '⮞'}
                </button>

                <div
                    style={{
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.3s ease'
                    }}
                    className='mt-1 d-flex'
                >
                    {colWidth === 'col-6' &&
                        <ResumeTemplate1 cvRef={resumeRef} />
                    }
                </div>
            </div>



        </div>
    )
}

export default ResumePreview