
import { useState, useCallback } from "react";
import PropTypes from 'prop-types';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useOCR } from '../../hooks/useOCR';
import { extractJobDataFromDescription } from '../InterviewPracticeSession/utils/promptGenerator';
import RadioOption from './RadioOption';
import JobDescriptionInput from './JobDescriptionInput';
import "./style.css";

const InterviewPracticeForm = ({ onStartPractice }) => {
  // Inline constants
  const CV_OPTIONS = {
    MY_CV: 'my-cv',
    JOB_DESCRIPTION: 'job-description',
  };
  const MESSAGES = {
    FORM_TITLE: 'Create your CV',
    FORM_DESCRIPTION: 'To start your interview practice, you need to have a CV. You can either use your existing CV or build one from scratch using our CV builder.',
    CV_HINT: 'Your current CV on file will be used for this practice.',
    START_PRACTICE: 'Start Practice',
  };
  const RADIO_OPTIONS = [
    {
      value: CV_OPTIONS.MY_CV,
      label: 'Based on My CV',
    },
    {
      value: CV_OPTIONS.JOB_DESCRIPTION,
      label: 'Based on Job Description',
    },
  ];

  const [cvOption, setCvOption] = useState(CV_OPTIONS.MY_CV);
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileUpload = useFileUpload();
  const ocr = useOCR();

  const handleJobDescriptionChange = useCallback((e) => {
    setJobDescription(e.target.value);
  }, []);

  const handleRemoveImage = useCallback(() => {
    fileUpload.removeImage();
    ocr.resetOCR();
  }, [fileUpload, ocr]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!onStartPractice) return;

    setIsSubmitting(true);

    try {
      let processedOCRResult = ocr.ocrResult;

      // Process OCR if file was uploaded and not already processed
      if (fileUpload.uploadedFile && !processedOCRResult) {
        processedOCRResult = await ocr.processOCR(fileUpload.uploadedFile);
      }

      // Prepare the job description text (from textarea or OCR)
      const jobDescriptionText = processedOCRResult || jobDescription;

      // Extract structured job data if job description option is selected
      let extractedJobData = null;
      if (cvOption === CV_OPTIONS.JOB_DESCRIPTION && jobDescriptionText.trim()) {
        try {
          extractedJobData = await extractJobDataFromDescription(jobDescriptionText);
          console.log('✅ Extracted job data:', extractedJobData);
        } catch (error) {
          console.error('❌ Failed to extract job data:', error);
          // Continue without extracted data if extraction fails
        }
      }

      await onStartPractice({
        cvOption,
        jobDescription: jobDescriptionText,
        extractedJobData, // Structured data with title, company, requirements, etc.
        ocrResult: processedOCRResult,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onStartPractice, cvOption, jobDescription, fileUpload.uploadedFile, ocr, CV_OPTIONS.JOB_DESCRIPTION]);

  const showJobDescriptionInput = cvOption === CV_OPTIONS.JOB_DESCRIPTION;

  return (
    <div className="content">
      <div className="content-inner">
        <h2 className="section-title">{MESSAGES.FORM_TITLE}</h2>
        <p className="paragraph">{MESSAGES.FORM_DESCRIPTION}</p>

        <div className="radio-group">
          {RADIO_OPTIONS.map((option) => (
            <RadioOption
              key={option.value}
              value={option.value}
              label={option.label}
              checked={cvOption === option.value}
              onChange={() => setCvOption(option.value)}
            />
          ))}
        </div>

        <p className="hint">{MESSAGES.CV_HINT}</p>

        {showJobDescriptionInput && (
          <JobDescriptionInput
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            isDragging={fileUpload.isDragging}
            onDragOver={fileUpload.handleDragOver}
            onDragLeave={fileUpload.handleDragLeave}
            onDrop={fileUpload.handleDrop}
            uploadedImage={fileUpload.uploadedImage}
            onRemoveImage={handleRemoveImage}
            onFileChange={fileUpload.handleFileInput}
            ocrResult={ocr.ocrResult}
          />
        )}

        {fileUpload.error && (
          <div className="error-message">{fileUpload.error}</div>
        )}

        {ocr.error && (
          <div className="error-message">{ocr.error}</div>
        )}

        <div className="btn-container">
          <button
            className="start-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || ocr.isProcessing}
          >
            {isSubmitting || ocr.isProcessing ? 'Processing...' : MESSAGES.START_PRACTICE}
          </button>
        </div>
      </div>
    </div>
  );
};

InterviewPracticeForm.propTypes = {
  onStartPractice: PropTypes.func.isRequired,
};

export default InterviewPracticeForm;