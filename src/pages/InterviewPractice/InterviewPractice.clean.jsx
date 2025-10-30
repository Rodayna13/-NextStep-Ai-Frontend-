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
                        {currentQuestion && (
                            <Music text={currentQuestion} />
                        )}
                    </div>
