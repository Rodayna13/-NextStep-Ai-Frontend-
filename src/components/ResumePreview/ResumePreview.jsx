import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import ResumeTemplate1 from '../templates/ResumeTemplate1';
import './ResumePreview.css';

const ResumePreview = ({setColWidth , colWidth}) => {
    const [zoomLevel, setZoomLevel] = useState(0.79);
    const resumeRef = useRef(); 


    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.1, 2)); // Max zoom 200%
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.1, 0.3)); // Min zoom 30%
    };

    const handleResetZoom = () => {
        setZoomLevel(0.80); // Reset to original size
    };

    const handleDownload = async () => {
        const element = resumeRef.current;
        
        // Convert images to base64 before generating PDF
        await convertImagesToBase64(element);
        
        const options = {
            margin: 0,
            filename: "Resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                scrollY: 0,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            },
            jsPDF: { unit: "pt", format: "a4", orientation: "portrait" }
        };
        html2pdf().set(options).from(element).save();
    };

    const convertImagesToBase64 = async (element) => {
        const images = element.querySelectorAll('img');
        const promises = Array.from(images).map(async (img) => {
            try {
                if (img.src && !img.src.startsWith('data:')) {
                    const base64 = await convertImageToBase64(img.src);
                    img.src = base64;
                }
            } catch (error) {
                console.warn('Failed to convert image to base64:', error);
            }
        });
        await Promise.all(promises);
    };

    const convertImageToBase64 = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                try {
                    const base64 = canvas.toDataURL('image/jpeg', 0.9);
                    resolve(base64);
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = reject;
            img.src = url;
        });
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