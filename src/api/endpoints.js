export const apiEndpoints = {
    BASE_URL: import.meta.env.VITE_API_URL,
    autoComplete : `${import.meta.env.VITE_API_URL}/api/autocomplete`,
    linkedin: {
        fetchProfile: `${import.meta.env.VITE_API_URL}/api/linkedin-profile`,
        fetchSnapshot: `${import.meta.env.VITE_API_URL}/api/linkedin-snapshot`,
        fetchSnapshotStatus: `${import.meta.env.VITE_API_URL}/api/snapshot-status`,
        fetchCacheProfile: `${import.meta.env.VITE_API_URL}/api/linkedin-profile-cache`
    },

}