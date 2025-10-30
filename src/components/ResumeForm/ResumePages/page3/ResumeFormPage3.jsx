import { useFormContext, useWatch } from 'react-hook-form';
import FormInput from '../../../shared/FormInput/FormInput'
import React from "react";

const ResumeFormPage3 = ({ isVisible }) => {
    const { register, setValue, getValues } = useFormContext();
    const watchedValues = useWatch();
    const educations = watchedValues.educations || [];

    // Handlers
    const handleAddEducation = () => {
        setValue('educations', [
            ...educations,
            {
                logo: '',
                title: '',
                caption: '',
                startDate: '',
                endDate: '',
                description: ''
            }
        ]);
    };

    // No handleAddPosition for education; if you want to add multiple degrees per school, use a different structure

    return (
        <div className={`resume-form-page ${isVisible ? 'visible' : 'hidden'}`}>

            <h2 className='resume-form-page-title'>
                <span className='text-info'>E</span>
                ducation Section</h2>
            {educations.map((edu, index) => (
                <React.Fragment key={index}>
                    {getValues().educations?.[index]?.title !== null && (
                        <>
                            <FormInput
                                logo={getValues().educations?.[index]?.logo}
                                name={`educations.${index}.title`}
                                label="Company Name"
                                placeholder="e.g. Google, Microsoft, Amazon"
                                register={register}
                                autoComplete={true}
                                rules={{ required: 'Company name is required' }}
                            />
                            <div className="d-flex gap-2" >

                                <FormInput
                                    label='Start Date'
                                    name={`educations.${index}.startDate`}
                                    register={register}
                                    placeholder="e.g. Jan 2020"
                                    style={{ width: '50%' }}
                                />
                                <FormInput
                                    label='End Date'
                                    name={`educations.${index}.endDate`}
                                    register={register}
                                    placeholder="e.g. Present or Sep 2023"
                                    style={{ width: '50%' }}
                                />
                            </div>
                        </>


                    )}

                </React.Fragment>
            ))}

            <button
                type="button"
                className="resumeform-link-btn"
                onClick={handleAddEducation}
            >
                Add New Education
            </button>

        </div>
    );
};

export default ResumeFormPage3;