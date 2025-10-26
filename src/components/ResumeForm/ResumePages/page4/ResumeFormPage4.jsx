import { useFormContext, useWatch } from 'react-hook-form';
import React from "react";
import FormInput from '../../../shared/FormInput/FormInput';
import "./ResumeFormPage4.css"
const ResumeFormPage4 = ({ isVisible }) => {
    const { register, setValue } = useFormContext();
    const watchedValues = useWatch();
    const skills = watchedValues.skills || [];

    // Handlers
    const handleAddNewSkill = () => {
        setValue('skills', [...skills, { title: '', }]);
    };

    // No handleAddPosition for education; if you want to add multiple degrees per school, use a different structure

    return (
        <div className={`resume-form-page ${isVisible ? 'visible' : 'hidden'}`}>

            <h2 className='resume-form-page-title'>
                <span className='text-warning'>S</span>
                kills Section</h2>

            <div className='row g-3 justify-content-start mb-3 align-items-center'>
                {skills.map((skill, index) => (
                    <div className='col-6' key={index}>
                        <FormInput
                            name={`skills.${index}.title`}
                            placeholder="e.g. JavaScript, Python, React"
                            register={register}
                            autoComplete={true}
                        />

                    </div>
                ))}
            </div>
            <button
                type="button"
                className="resumeform-link-btn"
                onClick={handleAddNewSkill}
            >
                Add New Skill
            </button>

        </div>
    );
};

export default ResumeFormPage4;