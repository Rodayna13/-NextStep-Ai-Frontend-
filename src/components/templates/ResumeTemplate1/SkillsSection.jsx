import React from 'react';
import EditableElement from './EditableElement';

const SkillsSection = ({ 
    activeElement, 
    onElementClick, 
    onEdit, 
    onDelete, 
    skills = ["HTML / CSS", "JavaScript / React", "Node.js / MongoDB", "UI Design"]
}) => {
    return (
        <EditableElement
            id="skills"
            activeElement={activeElement}
            onElementClick={onElementClick}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            <h3>Skills</h3>
            <ul>
                {skills.map((skill, index) => (
                    <EditableElement
                        key={index}
                        id={`skill-${index}`}
                        activeElement={activeElement}
                        onElementClick={onElementClick}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        stopPropagation={true}
                    >
                        <li>{skill}</li>
                    </EditableElement>
                ))}
            </ul>
        </EditableElement>
    );
};

export default SkillsSection;