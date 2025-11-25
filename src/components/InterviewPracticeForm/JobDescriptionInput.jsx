import PropTypes from 'prop-types';
import ImageThumbnail from './ImageThumbnail';
import FileUploadSection from './FileUploadSection';

const JobDescriptionInput = ({
    value,
    onChange,
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    uploadedImage,
    onRemoveImage,
    onFileChange,
    ocrResult,
}) => {
    return (
        <div
            className={`textarea-container ${isDragging ? 'dragging' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className="textarea-wrapper">
                <textarea
                    placeholder="Enter Job Description or Job URL"
                    rows={6}
                    value={value}
                    onChange={onChange}
                    aria-label="Job description"
                />
                <ImageThumbnail image={uploadedImage} onRemove={onRemoveImage} />
            </div>
            <FileUploadSection onFileChange={onFileChange} />
            {ocrResult && (
                <div className="ocr-result">
                    <strong>OCR Result:</strong>
                    <pre>{JSON.stringify(ocrResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

JobDescriptionInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    onDragOver: PropTypes.func.isRequired,
    onDragLeave: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    uploadedImage: PropTypes.shape({
        url: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
    onRemoveImage: PropTypes.func.isRequired,
    onFileChange: PropTypes.func.isRequired,
    ocrResult: PropTypes.object,
};

export default JobDescriptionInput;
