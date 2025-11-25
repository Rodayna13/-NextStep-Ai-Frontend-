import { useState, useCallback } from 'react';
import { apiEndpoints } from '../api/endpoints';

/**
 * Custom hook for handling OCR functionality
 * @returns {Object} OCR state and handlers
 */
export const useOCR = () => {
    const [ocrResult, setOcrResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const processOCR = useCallback(async (file) => {
        if (!file) return null;

        console.log('useOCR: Processing file:', file.name);
        const formData = new FormData();
        formData.append('file', file);
        
        setIsProcessing(true);
        setError(null);

        try {
            console.log('useOCR: Calling OCR API at:', apiEndpoints.ocr);
            const response = await fetch(apiEndpoints.ocr, {
                method: 'POST',
                body: formData,
            });

            console.log('useOCR: Response status:', response.status);
            if (!response.ok) {
                let errorText = '';
                try {
                    const errorData = await response.json();
                    errorText = errorData.message || errorData.error || JSON.stringify(errorData);
                } catch {
                    errorText = await response.text();
                }
                console.error('useOCR: API Error Response:', errorText);
                throw new Error(`OCR API Error: ${errorText}`);
            }

            const result = await response.json();
            console.log('useOCR: OCR API Response:', result);
            setOcrResult(result);
            return result;
        } catch (err) {
            const errorMessage = 'Failed to extract text from image';
            setError(errorMessage);
            setOcrResult(null);
            console.error('useOCR: OCR Error:', err);
            return null;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const resetOCR = useCallback(() => {
        setOcrResult(null);
        setError(null);
        setIsProcessing(false);
    }, []);

    return {
        ocrResult,
        isProcessing,
        error,
        processOCR,
        resetOCR,
    };
};
