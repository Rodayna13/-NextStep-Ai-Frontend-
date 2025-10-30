import React from 'react';
import EditableElement from './EditableElement';

const skillsData = [
    { title: "HTML / CSS" },
    { title: "JavaScript / React" },
    { title: "Node.js / MongoDB" },
    { title: "UI Design" }
];

const SkillsSection = ({ 
    activeElement, 
    onElementClick, 
    onEdit, 
    onDelete, 
    skills = skillsData
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
                        <li>{skill.title}</li>
                    </EditableElement>
                ))}
            </ul>
        </EditableElement>
    );
};

export default SkillsSection;