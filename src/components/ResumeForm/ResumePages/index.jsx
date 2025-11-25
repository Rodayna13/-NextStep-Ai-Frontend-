import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form';
import ResumeFormPage1 from './page1/ResumeFormPage1'
import ResumeFormPage2 from './page2/ResumeFormPage2';
import ResumeFormPage3 from './page3/ResumeFormPage3';
import ResumeFormPage4 from './page4/ResumeFormPage4';
import { apiEndpoints } from '../../../api/endpoints';

const Index = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [saving, setSaving] = useState(false);
    const { getValues } = useFormContext();

    const handleSave = async () => {
        setSaving(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const email = user?.email;

            console.log('email check before save:', email);
            if (!email) {
                alert('User not logged in or email not found');
                return;
            }

            const data = getValues();
            const token = localStorage.getItem('accessToken');

            // 1) Save CV to our backend
            const response = await fetch(apiEndpoints.saveCV, {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: `Bearer ${token}` } : {}),
                body: JSON.stringify({ email, data }),
            });

            if (response.ok) {
                alert('CV saved successfully');
            } else {
                const error = await response.json().catch(() => ({ error: response.statusText }));
                alert('Failed to save CV: ' + (error.error || 'Unknown error'));
            }
            console.log('email check before save: done ', email);
            // 2) Send the CV data as plain text to the backend proxy which will forward to the Resume Analyzer
            try {
                // Build multipart/form-data payload expected by the analyzer
                const formData = new FormData();
                // If you want to send an actual file, append a File object as ResumeFile
                // formData.append('ResumeFile', fileInput.files[0]);
                formData.append('ResumeText', JSON.stringify(data));

                // Do NOT set Content-Type header; the browser will set the correct boundary for multipart
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const analyzerResp = await fetch(apiEndpoints.analyzeResume, {
                    method: 'POST',
                    headers,
                    body: formData
                });

                if (analyzerResp.ok) {
                    const contentType = analyzerResp.headers.get('content-type') || '';
                    const analyzerResult = contentType.includes('application/json') ? await analyzerResp.json() : await analyzerResp.text();
                    console.log('Resume analyzer result (proxied, multipart):', analyzerResult);
                } else {
                    console.warn('Analyzer proxy request failed with status', analyzerResp.status);
                    const text = await analyzerResp.text().catch(() => null);
                    if (text) console.warn('Analyzer proxy response:', text);
                }
            } catch (anErr) {
                console.error('Error calling Resume Analyzer proxy:', anErr);
            }

        } catch (error) {
            console.error('Error saving CV:', error);
            alert('Error saving CV');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className='resume-form-container p-3'>
            <span className='cv-title'>Build Your CV</span>


            <ResumeFormPage1 isVisible={currentPage === 1} />
            <ResumeFormPage2 isVisible={currentPage === 2} />
            <ResumeFormPage3 isVisible={currentPage === 3} />
            <ResumeFormPage4 isVisible={currentPage === 4} />

            <div className="pagination">
                <button
                    className="nav-btn"
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    className="nav-btn"
                    onClick={() => {
                        if (currentPage !== 4) {
                            setCurrentPage(prev => prev + 1)
                        } else {
                            handleSave()
                        }
                    }}
                // disabled={currentPage === 4}
                >
                    {currentPage !== 4 ? 'Next' : saving ? 'Saving...' : 'Save CV'}
                </button>


            </div>

        </div>
    )
}

export default Index