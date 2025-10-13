import { FaLinkedin, FaPlusCircle, FaUpload } from "react-icons/fa";
import "./HomeHero.css";

import { useDispatch } from "react-redux";
import { setViewModal } from "../../store/slices/LinkedinSlice";
import { useSelectedResumeOption } from '../../hooks/useSelectedResumeOption';
import { setManualEntryActive } from "../../store/slices/ManualEntrySlice";

const HomeHero = () => {
    const dispatch = useDispatch();

    const { hasSelectedOption } = useSelectedResumeOption();


    const handleViewModal = () => {
        dispatch(setViewModal(true));
    }

    if (hasSelectedOption) {
        return (
            <div className="btn-group my-3">

          
            </div>
        )
    }
    return (
        <section className="hero mb-3">

            <h2>Ready to build resume</h2>

            <div className="hero-buttons">
                <button className="btn-primary" onClick={()=> {dispatch(setManualEntryActive(true))}}>
                    <FaPlusCircle /> Create New
                </button>
                <button className="btn-outline">
                    <FaUpload /> Upload CV
                </button>
                <button className="btn-outline" onClick={handleViewModal}>
                    <FaLinkedin /> Import LinkedIn
                </button>
            </div>
        </section>
    );
};

export default HomeHero;
