import { apiEndpoints } from './endpoints';

/**
 * Generate an HTML page with CV analysis
 * @param {Object} obj - Object containing analysis (with strengthPoints, weaknessPoints) and CV information
 */
export async function translateObjectToArabic(obj) {
  if (!obj || typeof obj !== 'object') {
    throw new Error('translateObjectToArabic expects a JSON object');
  }

  const prompt = `Create a beautiful, professional HTML page with the following three sections. Use modern styling with icons and a clean layout:

1. **Weakness Points Section**: Display the weakness points from the analysis with appropriate icons and styling
2. **Strength Points Section**: Display the strength points from the analysis with appropriate icons and styling  
3. **Enhanced CV Version**: Display an improved version of the CV based on the analysis

Here is the CV data:
${JSON.stringify(obj, null, 2)}

Requirements:
- Return a complete HTML page (including <html>, <head>, and <body> tags)
- Use inline CSS or a <style> tag for styling
- Include icons (you can use emoji or unicode symbols)
- Make it visually appealing with proper colors, spacing, and typography
- Use cards or sections to separate the three parts
- Make it responsive and professional
- Return ONLY the HTML code, no additional text or explanation`;

  const systemMsg = 'You are an expert HTML/CSS developer. Create beautiful, professional HTML pages with modern styling.';

  const resp = await fetch(apiEndpoints.chat, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt, systemMsg, temperature: 0.3 })
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => null);
    throw new Error(`LLM chat request failed: ${resp.status} ${resp.statusText} ${text || ''}`);
  }

  const data = await resp.json().catch((err) => {
    throw new Error(`Failed to parse JSON from chat response: ${err.message}`);
  });

  if (!data || !data.success) {
    throw new Error(data?.message || 'Chat API reported failure');
  }

  return data.response;
}

export default translateObjectToArabic;
