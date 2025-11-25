import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setManualEntryActive } from '../../store/slices/ManualEntrySlice';
import LinkedinModal from './../../components/LinkedinModal/LinkedinModal';
import ResumeForm from './../../components/ResumeForm/ResumeForm';

const CVBuilder = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setManualEntryActive(true));

        return () => dispatch(setManualEntryActive(false))
    }, [])
    return (
        <>
            <ResumeForm />
            <LinkedinModal />
        </>
    )
}

export default CVBuilder