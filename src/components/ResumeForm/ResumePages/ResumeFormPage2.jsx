import { useFormContext, useWatch } from 'react-hook-form';
import FormInput from '../../shared/FormInput/FormInput'
import './ResumeFormPage2.link.css';
import React from "react";

const ResumeFormPage2 = ({ isVisible }) => {
    const { register, setValue, getValues } = useFormContext();
    const watchedValues = useWatch();
    const experiences = watchedValues.experiences || [];

    // Handlers
    const handleAddExperience = () => {
        setValue('experiences', [
            ...experiences,
            {
                logo: '',
                title: '',
                caption: '',
                company: '',
                subComponents: [
                    { title: '', startDate: '', endDate: '', description: '' }
                ]
            }
        ]);
    };

    const handleAddPosition = () => {
        const lastExpIndex = experiences.length - 1;
        if (lastExpIndex >= 0) {
            const updatedExperiences = [...experiences];
            updatedExperiences[lastExpIndex].subComponents.push({
                title: '',
                startDate: '',
                endDate: '',
                description: ''
            });
            setValue('experiences', updatedExperiences);
        }
    };

    return (
        <div className={`resume-form-page ${isVisible ? 'visible' : 'hidden'}`}>
            {/* {JSON.stringify(experiences) } */}
            {/* {JSON.stringify(watchedValues) } */}
            {experiences.map((exp, index) => (
                <React.Fragment key={index}>
                    {getValues().experiences?.[index]?.company !== null && (
                        <FormInput
                            logo={getValues().experiences?.[index]?.logo}
                            name={`experiences.${index}.company`}
                            label="Company Name"
                            placeholder="e.g. Google, Microsoft, Amazon"
                            register={register}
                            autoComplete={true}
                            rules={{ required: 'Company name is required' }}
                        />
                    )}
                    {exp.subComponents && exp.subComponents.map((pos, posIndex) => (
                        <div className="d-flex gap-2" key={posIndex}>
                            <FormInput
                                label={posIndex === 0 ? 'Job Title' : ''}
                                name={`experiences.${index}.subComponents.${posIndex}.title`}
                                register={register}
                                autoComplete={true}
                                autoCompleteSortBy='position or job title'
                                placeholder="e.g. Software Engineer, Product Manager"
                                style={{ width: '50%' }}
                            />
                            <FormInput
                                label={posIndex === 0 ? 'Start Date' : ''}
                                name={`experiences.${index}.subComponents.${posIndex}.startDate`}
                                register={register}
                                placeholder="e.g. Jan 2020"
                                style={{ width: '25%' }}
                            />
                            <FormInput
                                label={posIndex === 0 ? 'End Date' : ''}
                                autoComplete={{ sortBy: 'title' }}
                                name={`experiences.${index}.subComponents.${posIndex}.endDate`}
                                register={register}
                                placeholder="e.g. Present or Sep 2023"
                                style={{ width: '25%' }}
                            />
                        </div>
                    ))}
                </React.Fragment>
            ))}

            <button
                type="button"
                className="resumeform-link-btn"
                onClick={handleAddExperience}
            >
                Add New Experience
            </button>
            <button
                type="button"
                className="resumeform-link-btn"
                onClick={handleAddPosition}
            >
                Add New Position
            </button>
        </div>
    );
};

export default ResumeFormPage2;