import ModalHeader from './ModalHeader';
import "./style.css";
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import { useSelector } from 'react-redux';
import { useState } from 'react';
const LinkedinModal = () => {
    const viewModal = useSelector(state => state.linkedin.viewModal)
    const [linkedinUrl, setLinkedinUrl] = useState('')

    return (
        <div className={`custom-modal-overlay slide-in-fwd-center ${!viewModal ? 'd-none' : ''}`} >
            <div className="custom-modal">
                <ModalHeader />
                <ModalBody setLinkedinUrl={setLinkedinUrl} />
                <ModalFooter linkedinUrl={linkedinUrl} />
            </div>
        </div>
    )
}

export default LinkedinModal