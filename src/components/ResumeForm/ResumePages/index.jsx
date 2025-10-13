import React, { useState } from 'react'
import ResumeFormPage1 from './ResumeFormPage1'
import ResumeFormPage2 from './ResumeFormPage2';
import ResumeFormPage3 from './ResumeFormPage3';

const Index = () => {
    const [currentPage, setCurrentPage] = useState(1)
    return (
        <div className='resume-form-container p-3'>
            <span className='cv-title'>Build Your CV</span>


            <ResumeFormPage1 isVisible={currentPage === 1} />
            <ResumeFormPage2 isVisible={currentPage === 2} />
            <ResumeFormPage3 isVisible={currentPage === 3} />

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
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === 3}
                >
                    Next
                </button>
            </div>

        </div>
    )
}

export default Index