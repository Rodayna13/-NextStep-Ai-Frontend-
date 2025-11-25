import { FaLinkedin, FaPlusCircle, FaUpload, FaFire } from "react-icons/fa";
import "./HomeHero.css";

import { useDispatch } from "react-redux";
import { setViewModal, setProfile } from "../../store/slices/LinkedinSlice";
import { useSelectedResumeOption } from '../../hooks/useSelectedResumeOption';
import { setManualEntryActive } from "../../store/slices/ManualEntrySlice";
import { useCVExtraction } from "../../hooks/useCVExtraction";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const HomeHero = () => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const { processCVFile, isExtracting } = useCVExtraction();

    const { hasSelectedOption } = useSelectedResumeOption();
    const navigate = useNavigate();

    const handleViewModal = () => {
        dispatch(setViewModal(true));
    }

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            console.log('No file selected');
            return;
        }

        console.log('File selected:', file.name, file.type);

        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a PDF or image file (JPEG, JPG, PNG)');
            return;
        }

        try {
            console.log('Starting CV processing...');
            const cvData = await processCVFile(file);
            
            console.log('CV Data extracted:', cvData);
            
            if (cvData) {
                console.log('Dispatching profile data to Redux');
                // Dispatch the extracted data to Redux store
                dispatch(setProfile(cvData));
                // Activate manual entry mode to show the CV builder
                dispatch(setManualEntryActive(true));
                console.log('CV data successfully loaded!');
                navigate('/cv-builder');
            } else {
                console.error('No CV data returned');
                alert('Failed to extract data from CV. Please check the console for details.');
            }
        } catch (error) {
            console.error('Failed to process CV:', error);
            const errorMessage = error.message || 'Unknown error occurred';
            alert(`Failed to extract data from CV:\n${errorMessage}\n\nPlease check the backend server.`);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // if (hasSelectedOption) {
    //     return (
    //         <div className="btn-group my-3">


    //         </div>
    //     )
    // }
    return (
        <section className="hero">

            <h2>Ready to build resume</h2>

            <div className="hero-buttons">
                <button className="btn-primary" onClick={() => { dispatch(setManualEntryActive(true)) }} disabled={isExtracting}>
                    <FaPlusCircle /> Create New
                </button>
                <button className="btn-outline btn-with-badge" onClick={handleFileUpload} disabled={isExtracting}>
                    <FaUpload /> {isExtracting ? 'Processing...' : 'Upload CV'}
                    <FaFire className="fire-badge" />
                </button>
                <button className="btn-outline" onClick={handleViewModal} disabled={isExtracting}>
                    <FaLinkedin /> Import LinkedIn
                </button>
                
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>
        </section>
    );
};

export default HomeHero;
