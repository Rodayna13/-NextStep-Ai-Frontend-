import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, setViewModal } from "../../store/slices/LinkedinSlice";

const ModalFooter = ({ linkedinUrl }) => {
    const { loading } = useSelector(state => state.linkedin.loading)
    const dispatch = useDispatch()
    return (
        <div className="custom-modal-actions">
            <button className="btn btn-primary" onClick={() => {
                dispatch(fetchProfile(linkedinUrl))
                

            }} disabled={loading}>
                {loading ? "Loading..." : "Submit"}
            </button>

            <button className="btn btn-secondary" onClick={() => {
                dispatch(setViewModal(false))
            }}>
                Cancel
            </button>
        </div>
    )
};

export default ModalFooter;