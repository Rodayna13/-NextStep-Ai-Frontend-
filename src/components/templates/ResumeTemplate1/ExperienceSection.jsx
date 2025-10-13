import React from 'react';
import EditableElement from './EditableElement';

const ExperienceSection = ({
    activeElement,
    onElementClick,
    onEdit,
    onDelete,
    experiences
}) => {
    console.log('experiences:', experiences);
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
                Experience
            </h2>

            {experiences.map((exp, index) => (
                <React.Fragment key={index}>
                    {exp.company !== null && (
                        <div style={{ marginBottom: '1.25rem' }}>
                            <EditableElement
                                id={`xexperience-company-${index}`}
                                activeElement={activeElement}
                                onElementClick={onElementClick}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            >
                                <div className='d-flex align-items-center gap-2' style={{ marginBottom: '0.75rem' }}>
                                    {exp.logo && <img src={exp.logo} width={20} height={20} style={{ borderRadius: '2px' }} />}
                                    <h3 style={{ 
                                        fontSize: '1.1rem', 
                                        fontWeight: '600', 
                                        margin: '0',
                                        color: '#374151'
                                    }}>
                                        {exp.company || "Company Name"}
                                    </h3>
                                </div>
                            </EditableElement>
                            
                            {exp.subComponents && exp.subComponents.map((pos, posIndex) => (
                                <EditableElement
                                    key={posIndex}
                                    id={`xexperience-${index}-${posIndex}`}
                                    activeElement={activeElement}
                                    onElementClick={onElementClick}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    style={{ marginBottom: posIndex < exp.subComponents.length - 1 ? '1rem' : '0' }}
                                >
                                    <div style={{ marginLeft: '1rem', paddingLeft: '0.75rem', borderLeft: '2px solid #f3f4f6' }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'flex-start',
                                            marginBottom: '0.25rem',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem'
                                        }}>
                                            <EditableElement
                                                id={`xexperience-title-${index}-${posIndex}`}
                                                activeElement={activeElement}
                                                onElementClick={onElementClick}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                stopPropagation={true}
                                            >
                                                <h4 style={{ 
                                                    fontSize: '0.95rem', 
                                                    fontWeight: '500', 
                                                    margin: '0',
                                                    color: '#1f2937',
                                                    lineHeight: '1.3'
                                                }}>
                                                    {pos.title || "Job Title"}
                                                </h4>
                                            </EditableElement>

                                            <EditableElement
                                                id={`xexperience-date-${index}-${posIndex}`}
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
                                                    {pos.startDate || "Start Date"} – {pos.endDate || "End Date"}
                                                </span>
                                            </EditableElement>
                                        </div>

                                        <EditableElement
                                            id={`xexperience-description-${index}-${posIndex}`}
                                            activeElement={activeElement}
                                            onElementClick={onElementClick}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                            stopPropagation={true}
                                        >
                                            <p style={{ 
                                                fontSize: '0.85rem', 
                                                color: '#4b5563', 
                                                margin: '0',
                                                lineHeight: '1.4',
                                                textAlign: 'justify'
                                            }}>
                                                {pos.caption || "Description of the role and key achievements."}
                                            </p>
                                        </EditableElement>
                                    </div>
                                </EditableElement>
                            ))}
                        </div>
                    )}
                </React.Fragment>
            ))}
        </section>
    );
};

export default ExperienceSection;