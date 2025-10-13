import { useSelector } from 'react-redux';

export function useSelectedResumeOption() {
    const linkedInProfile = useSelector(state => state.linkedin.profile);
    const ocrResult = useSelector(state => state.ocr.ocrResult);
    const manualEntry = useSelector(state => state.manualEntry.active);
    const hasSelectedOption = ocrResult || manualEntry || (linkedInProfile && Object.keys(linkedInProfile).length > 0);
    return { linkedInProfile, ocrResult, manualEntry, hasSelectedOption };
}
