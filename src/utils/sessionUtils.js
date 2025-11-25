/**
 * Generates a unique session ID
 * @returns {string} - Unique session identifier
 */
export const generateSessionId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 900000 + 100000);
    return `sess-${timestamp}-${randomNumber}`;
};
