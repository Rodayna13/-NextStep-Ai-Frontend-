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
 * Summarize CV data using LLM for interview context
 * @param {Object} cvData - CV/resume data
 * @returns {Promise<string>} Summarized profile text
 */
const summarizeCVForInterview = async (cvData) => {

    if (!cvData) return '';

    // Import apiEndpoints dynamically
    const { apiEndpoints } = await import('../../../api/endpoints.js');

    const systemMsg = `You are a professional CV summarizer. Create a concise summary of the candidate's profile for an interviewer in this exact format:

Name: [Candidate's full name]
Summary: [3-4 sentence professional summary]

Focus the summary on:
- Current/most recent role and experience level
- Key technical skills and expertise areas
- Notable achievements or strengths
- Career focus or specialization

Keep it brief and professional. Return ONLY in the format shown above.`;

    const prompt = `Summarize this candidate's profile for an interview context:\n\n${JSON.stringify(cvData, null, 2)}`;

    try {
        const response = await fetch(apiEndpoints.chat, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                systemMsg,
                temperature: 0.4
            })
        });

        if (!response.ok) {
            console.error('Failed to summarize CV:', response.statusText);
            return '';
        }

        const data = await response.json();

        if (!data.success) {
            console.error('CV summarization failed:', data.message);
            return '';
        }

        return data.response || '';
    } catch (error) {
        console.error('Error summarizing CV:', error);
        return '';
    }
};

/**
 * Generate custom system prompt based on configuration
 * @param {Object} config - Assistant configuration
 * @param {Object} cvData - CV/resume data (optional)
 * @returns {Promise<string>} Generated system prompt
 */
export const generateSystemPrompt = async (config, cvData) => {
    console.log("   generateSystemPrompt cvData:", cvData);
    if (!config) return getDefaultSystemPrompt();

    const focusAreas = config.focusAreas.length > 0 ? config.focusAreas.join(', ') : 'general';
    const feedback = config.feedbackStyle === 'Only at the end' ? 'at end only' : 'after each answer';

    // Get CV summary if data is provided
    let cvContext = '';
    if (cvData) {
        const cvSummary = await summarizeCVForInterview(cvData);
        if (cvSummary) {
            cvContext = `\n\nCandidate Profile:\n${cvSummary}\n`;
        }
    }

    return `Professional interviewer. Speak ${LANGUAGE_MAP[config.language]}, ${TONE_MAP[config.tone]}, ${ENERGY_MAP[config.energy]}.${cvContext}\n` +
        `Rules: Ask ONE question at a time. SHORT responses (1-2 sentences). ${feedback === 'at end only' ? 'Feedback at end only.' : 'Brief feedback after each.'} Difficulty: ${getDifficultyDescription(config.difficulty)}. Focus: ${focusAreas}.\n` +
        `Tailor questions based on candidate's background and experience level.\n`;
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
 * Generate system prompt for job-specific interview practice
 * @param {Object} config - Assistant configuration
 * @param {Object} jobData - Job description data
 * @param {string} jobData.title - Job title
 * @param {string} jobData.company - Company name
 * @param {string} jobData.description - Job description
 * @param {Array<string>} jobData.requirements - Job requirements/qualifications
 * @param {Array<string>} jobData.responsibilities - Job responsibilities
 * @param {Array<string>} jobData.skills - Required skills
 * @returns {string} Generated system prompt for job interview
 */
export const generateSystemPromptForJob = (config, jobData) => {
    if (!config || !jobData) return getDefaultSystemPrompt();

    //  awaextractJobDataFromDescription(jobData)

    const { title, company, description, requirements = [], responsibilities = [], skills = [] } = jobData;

    // Build job context
    const jobContext = `Job: ${title}${company ? ` at ${company}` : ''}
${description ? `Description: ${description}` : ''}
${requirements.length > 0 ? `Requirements: ${requirements.join(', ')}` : ''}
${responsibilities.length > 0 ? `Responsibilities: ${responsibilities.join(', ')}` : ''}
${skills.length > 0 ? `Skills: ${skills.join(', ')}` : ''}`;

    const feedback = config.feedbackStyle === 'Only at the end' ? 'at end only' : 'after each answer';

    return `Professional job interviewer for ${title} position. Speak ${LANGUAGE_MAP[config.language]}, ${TONE_MAP[config.tone]}, ${ENERGY_MAP[config.energy]}.\n\n` +
        `${jobContext}\n\n` +
        `Rules:\n` +
        `- Ask ONE targeted question at a time based on job requirements\n` +
        `- SHORT responses (1-2 sentences)\n` +
        `- ${feedback === 'at end only' ? 'Provide comprehensive feedback at the end only' : 'Give brief feedback after each answer'}\n` +
        `- Difficulty: ${getDifficultyDescription(config.difficulty)}\n` +
        `- Focus questions on: job requirements, responsibilities, and required skills\n` +
        `- Assess candidate fit for this specific role\n\n` +
        `Interview Flow:\n` +
        `1) Experience relevant to ${title}\n` +
        `2) Technical skills matching job requirements\n` +
        `3) Behavioral questions related to responsibilities\n` +
        `4) Situational questions about job challenges`;
};

/**
 * Extract structured job data from job description using AI
 * @param {string} jobDescriptionText - Raw job description text
 * @returns {Promise<Object>} Structured job data
 */
export const extractJobDataFromDescription = async (jobDescriptionText) => {
    if (!jobDescriptionText || !jobDescriptionText.trim()) {
        throw new Error('Job description text is required');
    }

    // Import apiEndpoints dynamically
    const { apiEndpoints } = await import('../../../api/endpoints.js');

    const systemMsg = `You are a job description analyzer. Extract structured information from job postings and return ONLY valid JSON with this exact format:
{
  "title": "job title",
  "company": "company name or empty string",
  "description": "brief 1-2 sentence summary",
  "requirements": ["requirement 1", "requirement 2", "requirement 3"],
  "responsibilities": ["responsibility 1", "responsibility 2", "responsibility 3"],
  "skills": ["skill 1", "skill 2", "skill 3"]
}

Rules:
- Return ONLY the JSON object, no additional text
- Extract 3-5 items for each array
- Use empty string for missing company name
- Keep descriptions concise
- If information is not found, use empty arrays`;

    const prompt = `Analyze this job description and extract structured data:\n\n${jobDescriptionText}`;

    try {
        const response = await fetch(apiEndpoints.chat, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                systemMsg,
                temperature: 0.3 // Lower temperature for more consistent extraction
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to extract job data');
        }

        // Parse the JSON response
        const jobData = JSON.parse(data.response);

        // Validate required fields
        if (!jobData.title) {
            throw new Error('Could not extract job title from description');
        }

        return {
            title: jobData.title || '',
            company: jobData.company || '',
            description: jobData.description || '',
            requirements: Array.isArray(jobData.requirements) ? jobData.requirements : [],
            responsibilities: Array.isArray(jobData.responsibilities) ? jobData.responsibilities : [],
            skills: Array.isArray(jobData.skills) ? jobData.skills : []
        };

    } catch (error) {
        console.error('❌ Job extraction error:', error);
        throw new Error(`Failed to extract job data: ${error.message}`);
    }
};

/**
 * Get initial greeting based on configuration
 * @param {Object|null} config - Assistant configuration
 * @returns {string} Initial greeting message
 */
export const getInitialGreeting = (language) => {
    if (!language) return 'EG-AR'

    return `You are a professional interview coach. Start the session with a brief, warm greeting (1-2 sentences maximum) in ${LANGUAGE_MAP[language] || language}. Welcome the candidate`;
};
