import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, setViewModal, setProfile } from "../../store/slices/LinkedinSlice";
import { useCVExtraction } from "../../hooks/useCVExtraction";

const ModalFooter = ({ linkedinUrl }) => {
    const { loading } = useSelector(state => state.linkedin.loading)
    const dispatch = useDispatch()
    const fileInputRef = useRef(null);
    const { processCVFile, isExtracting } = useCVExtraction();

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a PDF or image file (JPEG, JPG, PNG)');
            return;
        }

        try {
            const cvData = await processCVFile(file);
            
            if (cvData) {
                // Dispatch the extracted data to Redux store
                dispatch(setProfile(cvData));
            }
        } catch (error) {
            console.error('Failed to process CV:', error);
            alert('Failed to extract data from CV. Please try again.');
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="custom-modal-actions">
            <button className="btn btn-primary" onClick={() => {
                dispatch(fetchProfile(linkedinUrl))
            }} disabled={loading || isExtracting}>
                {loading ? "Loading..." : "Submit"}
            </button>

            <button 
                className="btn btn-primary" 
                onClick={handleFileUpload}
                disabled={loading || isExtracting}
            >
                {isExtracting ? "Processing..." : "Upload CV"}
            </button>

            <button className="btn btn-secondary" onClick={() => {
                dispatch(setViewModal(false))
            }} disabled={isExtracting}>
                Cancel
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    )
};

export default ModalFooter;