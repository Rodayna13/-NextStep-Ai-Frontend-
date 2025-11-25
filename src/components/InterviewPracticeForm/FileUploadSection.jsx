import PropTypes from 'prop-types';

const FileUploadSection = ({ onFileChange }) => {
    return (
        <div className="file-upload-section">
            <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={onFileChange}
                style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="upload-label">
                📎 Attach image
            </label>
            <span className="drag-hint">or drag and drop</span>
        </div>
    );
};

FileUploadSection.propTypes = {
    onFileChange: PropTypes.func.isRequired,
};

export default FileUploadSection;
