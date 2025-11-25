import { useCallback, useState } from "react";
import InterviewPracticeForm from '../../components/InterviewPracticeForm';
import InterviewPracticeSession from '../../components/InterviewPracticeSession';
import { generateSessionId } from '../../utils/sessionUtils';
import "./InterviewPractice.css";

const InterviewPractice = () => {
    const [sessionId, setSessionId] = useState(null);
    const [error, setError] = useState(null);
    const [basedOnJobDescription, setBasedOnJobDescription] = useState(null)
    const [cvData, setCvData] = useState(null)
    const handleStartPractice = useCallback(async (formData) => {


        const user = JSON.parse(localStorage.getItem('user'));
        const userData = {
            name: user?.firstName + ' ' + user?.lastName || 'John Doe',
            email: user?.email || 'john.doe@email.com',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN2DrjjFPrSN-Fp7l9nUUAX1MuEiiUpqb5sptN_wa7mlw5kAJpue3fFrqXNogEdyfj9pZk0tog8LFiPMzCj3sTHHiNns7U2yCVBK1dWg06DilPpBTUq8sjtXhYc9IB2FWTW9r3WxWQDwHIRfADfhYkxdOvyZckECM3yHpYqJQU3w071zpIaku0BEJ3TrMP0ZeUkD4PlJdVYB0AMhGFuIjT_p7I1o6XbJy0d3wCO2uu0M0OAE1KFLTXWJCBJxDuULlbms6ZLaB9iyhP'
        };
      
        const fetchCVData = async () => {


            if (userData.email && userData.email !== 'john.doe@email.com') {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cv/${userData.email}`);
                    console.log('response:', response);
                    if (response.ok) {
                        const cvData = await response.json();
                        console.log('Profile CV data:', cvData);
                        setCvData(cvData);
                    } else {
                        console.log('CV not found for this email');
                    }
                } catch (error) {
                    console.error('Error fetching CV data:', error);
                }
            }
        };

        console.log(formData)
        setError(null);
        const newSessionId = generateSessionId();
        const basedOnCV = formData.cvOption === "my-cv"
        console.log("formData.extractedJobData", formData.extractedJobData)
        if (!basedOnCV) {
            setBasedOnJobDescription(formData.extractedJobData);
        } else {
            fetchCVData();
            setBasedOnJobDescription(null);
        }



        setSessionId(newSessionId);


    }, []);

    const isSessionActive = sessionId;

    if (isSessionActive) {
        return (
            <div className="interview-practice-container">
                <InterviewPracticeSession
                    sessionId={sessionId}
                    jobDescription={basedOnJobDescription}
                    cvData={cvData}
                />
            </div >
        );
    }

    return (
        <div className="interview-practice-container">
            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}
            <InterviewPracticeForm onStartPractice={handleStartPractice} />
        </div>
    );
};

export default InterviewPractice;
