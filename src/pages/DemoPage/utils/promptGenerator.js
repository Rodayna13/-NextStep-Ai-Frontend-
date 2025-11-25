/**
 * Language mappings for system prompts
 */
const LANGUAGE_MAP = {
    'ar-EG': 'Egyptian Arabic dialect',
    'en-US': 'English',
    'es-ES': 'Spanish',
    'fr-FR': 'French'
};

/**
 * Tone mappings for system prompts
 */
const TONE_MAP = {
    'Very Professional': 'very professional and formal',
    'Neutral': 'neutral and balanced',
    'Warm': 'warm and friendly',
    'Enthusiastic': 'enthusiastic and energetic'
};

/**
 * Energy level mappings for system prompts
 */
const ENERGY_MAP = {
    'Low': 'calm and measured pace',
    'Moderate': 'moderate and steady pace',
    'High': 'energetic and dynamic pace',
    'Very High': 'very energetic and fast-paced'
};

/**
 * Get difficulty description based on numeric level
 * @param {number} difficulty - Difficulty level (1-10)
 * @returns {string} Difficulty description
 */
const getDifficultyDescription = (difficulty) => {
    if (difficulty <= 3) return 'easy to moderate';
    if (difficulty <= 6) return 'moderate';
    if (difficulty <= 8) return 'challenging';
    return 'very difficult and advanced';
};

/**
 * Generate custom system prompt based on configuration
 * @param {Object} config - Assistant configuration
 * @returns {string} Generated system prompt
 */
export const generateSystemPrompt = (config) => {
    if (!config) return getDefaultSystemPrompt();

    const focusAreas = config.focusAreas.length > 0 ? config.focusAreas.join(', ') : 'general';
    const feedback = config.feedbackStyle === 'Only at the end' ? 'at end only' : 'after each answer';

    return `Professional interviewer. Speak ${LANGUAGE_MAP[config.language]}, ${TONE_MAP[config.tone]}, ${ENERGY_MAP[config.energy]}.\n\n` +
        `Rules: Ask ONE question at a time. SHORT responses (1-2 sentences). ${feedback === 'at end only' ? 'Feedback at end only.' : 'Brief feedback after each.'} Difficulty: ${getDifficultyDescription(config.difficulty)}. Focus: ${focusAreas}.\n\n`;
};

/**
 * Get default system prompt
 * @returns {string} Default system prompt
 */
export const getDefaultSystemPrompt = () => {
    return "Professional interviewer. Egyptian Arabic, calm tone.\n\n" +
        "Rules: Ask ONE question. SHORT responses (1-2 sentences). Brief feedback then next question. No tips.\n\n" +
        "Flow: 1) Target job 2) Behavioral 3) Technical 4) Situational";
};

/**
 * Get initial greeting based on configuration
 * @param {Object|null} config - Assistant configuration
 * @returns {string} Initial greeting message
 */
export const getInitialGreeting = (language) => {
    if (!language) return 'EG-AR'

    return "you're interview coach assistant say greeting message with following language and dialect/accent: " + language;
};
