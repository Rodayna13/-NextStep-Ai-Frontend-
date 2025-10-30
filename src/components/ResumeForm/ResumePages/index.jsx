import React, { useState } from 'react'
import ResumeFormPage1 from './page1/ResumeFormPage1'
import ResumeFormPage2 from './page2/ResumeFormPage2';
import ResumeFormPage3 from './page3/ResumeFormPage3';
import ResumeFormPage4 from './page4/ResumeFormPage4';

const Index = () => {
    const [currentPage, setCurrentPage] = useState(1)
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
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === 4}
                >
                    Next
                </button>
            </div>

        </div>
    )
}

export default Index