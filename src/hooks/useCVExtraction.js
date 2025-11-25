import { useState, useCallback } from 'react';
import { apiEndpoints } from '../api/endpoints';
import { useOCR } from './useOCR';

/**
 * Custom hook for extracting CV data from PDF or image files
 * @returns {Object} CV extraction state and handlers
 */
// System message for CV extraction
const CV_EXTRACTION_SYSTEM_MESSAGE = "You are an AI model that extracts clean, structured data from OCR-extracted CV text. The OCR text may include noise, symbols, extra spaces, or line breaks — ignore all formatting issues and focus on the content meaning. Return only a valid JSON object (not inside quotes or markdown). Each key should represent a clear CV field. Use the following schema as guidance: {\"fullName\": null, \"email\": null, \"about\": null, \"location\": null, \"jobTitle\": null, \"summary\": null, \"mobileNumber\": null, \"educations\": [{\"logo\": null, \"title\": null, \"startDate\": null, \"endDate\": null}], \"experiences\": [{\"company\": null, \"subComponents\": [{\"title\": null, \"startDate\": null, \"endDate\": null}]}], \"skills\": [{\"title\": null}]}. Remove newline characters, bullet symbols, and escape sequences from text values. If a field is missing, return null or an empty list as appropriate.";

export const useCVExtraction = () => {
    const { processOCR, isProcessing: isOCRProcessing, error: ocrError } = useOCR();
    const [extractedData, setExtractedData] = useState(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [error, setError] = useState(null);

    const extractCVData = useCallback(async (ocrText) => {
        try {
            console.log('extractCVData: Creating prompt with OCR text');
            const prompt = `Extract CV data from the following OCR text:\n\n${ocrText}`;
            
            console.log('extractCVData: Calling chat API at:', apiEndpoints.chat);
            const response = await fetch(apiEndpoints.chat, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt,
                    systemMsg: CV_EXTRACTION_SYSTEM_MESSAGE,
                    temperature: 0.3
                })
            });

            console.log('extractCVData: Response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('extractCVData: API Error Response:', errorText);
                throw new Error('Failed to extract CV data');
            }

            const result = await response.json();
            console.log('extractCVData: Raw API response:', result);
            
            // Parse the response - the AI might return the JSON in different formats
            let parsedData;
            try {
                // Check if the response is already an object
                if (typeof result === 'object' && result !== null) {
                    // If result has a 'data' or 'response' or 'message' field, use that
                    parsedData = result.data || result.response || result.message || result;
                    
                    // If it's a string, parse it
                    if (typeof parsedData === 'string') {
                        // Remove markdown code blocks if present
                        parsedData = parsedData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                        parsedData = JSON.parse(parsedData);
                    }
                } else if (typeof result === 'string') {
                    // Remove markdown code blocks if present
                    parsedData = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                    parsedData = JSON.parse(parsedData);
                } else {
                    parsedData = result;
                }
            } catch (parseError) {
                console.error('Failed to parse AI response:', parseError);
                throw new Error('Failed to parse extracted CV data');
            }

            return parsedData;
        } catch (err) {
            console.error('CV extraction error:', err);
            throw err;
        }
    }, []);

    const processCVFile = useCallback(async (file) => {
        if (!file) return null;

        console.log('useCVExtraction: Starting file processing');
        setIsExtracting(true);
        setError(null);
        setExtractedData(null);

        try {
            // Step 1: Process OCR
            console.log('useCVExtraction: Processing OCR...');
            const ocrResult = await processOCR(file);
            console.log('useCVExtraction: OCR Result:', ocrResult);
            
            if (!ocrResult) {
                console.error('useCVExtraction: OCR returned null');
                throw new Error('Failed to extract text from file');
            }

            // Try different possible response formats
            let extractedText = null;
            
            // Check if it's a string
            if (typeof ocrResult === 'string') {
                extractedText = ocrResult;
            }
            // Check for OCR.space API format
            else if (ocrResult.ParsedResults && ocrResult.ParsedResults.length > 0) {
                extractedText = ocrResult.ParsedResults[0].ParsedText;
            }
            // Check for other common formats
            else {
                extractedText = ocrResult.text || ocrResult.data?.text || ocrResult.extractedText || ocrResult.content;
            }
            
            console.log('useCVExtraction: Extracted text:', extractedText);
            
            if (!extractedText) {
                console.error('useCVExtraction: No text found in OCR result. Full result:', JSON.stringify(ocrResult));
                throw new Error('Failed to extract text from file');
            }

            console.log('useCVExtraction: OCR text length:', extractedText.length);

            // Step 2: Extract structured data from OCR text
            console.log('useCVExtraction: Extracting CV data from OCR text...');
            const cvData = await extractCVData(extractedText);
            console.log('useCVExtraction: Extracted CV Data:', cvData);
            
            setExtractedData(cvData);
            return cvData;
        } catch (err) {
            const errorMessage = err.message || 'Failed to process CV file';
            setError(errorMessage);
            console.error('useCVExtraction: CV processing error:', err);
            return null;
        } finally {
            setIsExtracting(false);
            console.log('useCVExtraction: Processing complete');
        }
    }, [processOCR, extractCVData]);

    const resetExtraction = useCallback(() => {
        setExtractedData(null);
        setError(null);
        setIsExtracting(false);
    }, []);

    return {
        extractedData,
        isExtracting: isExtracting || isOCRProcessing,
        error: error || ocrError,
        processCVFile,
        resetExtraction,
    };
};
