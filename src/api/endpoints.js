
export const apiEndpoints = {
    BASE_URL: import.meta.env.VITE_API_URL,
    autoComplete: `${import.meta.env.VITE_API_URL}/api/autocomplete`,
    linkedin: {
        fetchProfile: `${import.meta.env.VITE_API_URL}/api/linkedin-profile`,
        fetchSnapshot: `${import.meta.env.VITE_API_URL}/api/linkedin-snapshot`,
        fetchSnapshotStatus: `${import.meta.env.VITE_API_URL}/api/snapshot-status`,
        fetchCacheProfile: `${import.meta.env.VITE_API_URL}/api/linkedin-profile-cache`
    },
    auth: {
        login: '/api/Auth/login',
        validateToken: '/api/Auth/validate-token',
        register: '/api/Auth/register',
        forgotPassword: '/api/Auth/forgot-password',
        resetPassword: '/api/Auth/reset-password',
        verifyEmail: '/api/Auth/verify-email',
    },
    enhanceInputWithAI: `${import.meta.env.VITE_API_URL}/api/resume-enhance/input`,
    ocr: `${import.meta.env.VITE_API_URL}/api/ocr`,
    InterviewPractice: `${import.meta.env.VITE_API_URL}/api/mock-interview`,
    videoRag: `${import.meta.env.VITE_API_URL}/api/videorag`,
    videoStores: `${import.meta.env.VITE_API_URL}/api/video-stores`,
    chat: `${import.meta.env.VITE_API_URL}/api/chat`,
    analyzeChat: `${import.meta.env.VITE_API_URL}/api/analyze-chat`,
    saveCV: `${import.meta.env.VITE_API_URL}/api/cv`,
    analyzeResume: `/api/ResumeAnalyzer/analyze`,
    submitQuizAnswer: `/api/SkillsAssessment/submit-answer`,
}