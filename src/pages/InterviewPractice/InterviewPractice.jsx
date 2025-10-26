import axios from "axios";
import { useState } from "react";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { apiEndpoints } from './../../api/endpoints';
import LiveVoiceChat from './../../components/LiveVoiceChat/LiveVoiceChat';
import "./InterviewPractice.css";

// Helper to read image file and set preview
const readImageFile = (file, setPreview) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        setPreview({
            url: event.target.result,
            name: file.name
        });
    };
    reader.readAsDataURL(file);
};

const InterviewPractice = () => {
    const [cvOption, setCvOption] = useState("my-cv");
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [ocrResult, setOcrResult] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [sessionId, setSessionId] = useState(null)
    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleImageSelect(file);
    };

    // File input handler
    const handleFileInput = (e) => {
        const file = e.target.files?.[0];
        handleImageSelect(file);
    };

    // Image select logic
    const handleImageSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            readImageFile(file, setUploadedImage);
            setUploadedFile(file);
        }
    };

    // Remove image
    const removeImage = () => {
        setUploadedImage(null);
        setUploadedFile(null);
        setOcrResult(null);
    };

    // OCR upload
    const handleOCRUpload = async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(apiEndpoints.ocr, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to upload image');
            const result = await response.json();
            setOcrResult(result);
        } catch (error) {
            setOcrResult(null);
            console.error('Error uploading image:', error);
        }
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (uploadedFile) {
            await handleOCRUpload(uploadedFile);
        }


        const xsessionId = `sess-${Date.now()}-${Math.floor(Math.random() * 900000 + 100000)}`;
        setSessionId(xsessionId);


        try {
            const response = await axios.post(`${apiEndpoints.InterviewPractice}/start`, { sessionId: xsessionId });
            console.log('Interview practice started:', response.data);
            setCurrentQuestion(response.data.question);
        } catch (error) {
            console.error('Error starting interview practice:', error);
        }




    };

    const [isLoading, setIsLoading] = useState(false);




    if (currentQuestion) {
        return (
            <div className="interview-practice-container">

                <LiveVoiceChat

                    sessionId={sessionId}
                    isVisible={currentQuestion}
                    isLoading={isLoading}
                    text={currentQuestion} />
            </div>
        )
    }

    return (
        <div className="interview-practice-container">


            <div className="content">
                here
                {/* {speechRecognition.transcript} */}
                {/* <Demo /> */}
                <div className="content-inner">

                    <h2 className="section-title">Create your CV</h2>
                    <p className="paragraph">
                        To start your interview practice, you need to have a CV. You can either use your existing CV or build one
                        from scratch using our CV builder.
                    </p>

                    <div className="radio-group">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="cv-option"
                                checked={cvOption === "my-cv"}
                                onChange={() => setCvOption("my-cv")}
                            />
                            <div>
                                <p>Based on My CV</p>
                            </div>
                        </label>

                        <label className="radio-label">
                            <input
                                type="radio"
                                name="cv-option"
                                checked={cvOption === "job-description"}
                                onChange={() => setCvOption("job-description")}
                            />
                            <div>
                                <p>Based on Job Description</p>
                            </div>
                        </label>
                    </div>

                    <p className="hint">Your current CV on file will be used for this practice.</p>

                    {cvOption === "job-description" && (
                        <div
                            className={`textarea-container ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="textarea-wrapper">
                                <textarea
                                    placeholder="Enter Job Description or Job URL"
                                    rows={6}
                                    cols={50}
                                    value={jobDescription}
                                    onChange={e => setJobDescription(e.target.value)}
                                ></textarea>
                                {uploadedImage && (
                                    <div className="image-thumbnail">
                                        <img src={uploadedImage.url} alt={uploadedImage.name} />
                                        <button
                                            className="remove-image-btn"
                                            onClick={removeImage}
                                            aria-label="Remove image"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="file-upload-section">
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept="image/*"
                                    onChange={handleFileInput}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="file-upload" className="upload-label">
                                    📎 Attach image
                                </label>
                                <span className="drag-hint">or drag and drop</span>
                            </div>
                            {/* OCR result feedback */}
                            {ocrResult && (
                                <div className="ocr-result">
                                    <strong>OCR Result:</strong>
                                    <pre>{JSON.stringify(ocrResult, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="btn-container">
                        <button className="start-btn" onClick={handleSubmit}>Start Practice</button>
                        {/* {currentQuestion && (
                            <Music text={currentQuestion} />
                        )} */}
                    </div>



                </div>
            </div>
        </div>
    );
};

export default InterviewPractice;
