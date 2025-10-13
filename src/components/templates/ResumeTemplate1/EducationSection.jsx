import React from 'react';
import EditableElement from './EditableElement';

const EducationSection = ({
    activeElement,
    onElementClick,
    onEdit,
    onDelete,
    educations
}) => {
    return (
        <section style={{ marginBottom: '1.5rem' }}>
            <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#1f2937',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.25rem'
            }}>
                Education
            </h2>

            {educations.map((education, index) => (
                <EditableElement
                    key={index}
                    id={`education-${index}`}
                    activeElement={activeElement}
                    onElementClick={onElementClick}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    style={{ marginBottom: index < educations.length - 1 ? '1rem' : '0' }}
                >
                    <div style={{
                        paddingLeft: '0.75rem',
                        borderLeft: '2px solid #f3f4f6',
                        paddingBottom: '0.5rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '0.25rem',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                        }}>
                            <EditableElement
                                id={`education-title-${index}`}
                                activeElement={activeElement}
                                onElementClick={onElementClick}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                stopPropagation={true}
                            >

                                <div className='d-flex align-items-center gap-2' style={{ marginBottom: '0.75rem' }}>
                                    {education.logo && <img src={education.logo} width={20} height={20} style={{ borderRadius: '2px' }} />}

                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        margin: '0',
                                        color: '#1f2937',
                                        lineHeight: '1.3'
                                    }}>


                                        {education.title || "Degree Title"}
                                    </h3>
                                </div>
                            </EditableElement>

                            <EditableElement
                                id={`education-date-${index}`}
                                activeElement={activeElement}
                                onElementClick={onElementClick}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                stopPropagation={true}
                            >
                                <span style={{
                                    fontSize: '0.8rem',
                                    color: '#6b7280',
                                    fontWeight: '400',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {education.startDate || "Start Date"} – {education.endDate || "End Date"}
                                </span>
                            </EditableElement>
                        </div>

                        <EditableElement
                            id={`education-institution-${index}`}
                            activeElement={activeElement}
                            onElementClick={onElementClick}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            stopPropagation={true}
                        >
                            <p style={{
                                fontSize: '0.9rem',
                                color: '#4b5563',
                                margin: '0',
                                lineHeight: '1.4',
                                fontWeight: '500'
                            }}>
                                {education.caption || "Institution Name"}
                            </p>
                        </EditableElement>
                    </div>
                </EditableElement>
            ))}
        </section>
    );
};

export default EducationSection;