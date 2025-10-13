import React from 'react';
import EditableElement from './EditableElement';

const AboutSection = ({ 
    activeElement, 
    onElementClick, 
    onEdit, 
    onDelete, 
    about 
}) => {
    return (
        <EditableElement
            id="about"
            activeElement={activeElement}
            onElementClick={onElementClick}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            <section>
                <h2>Profile</h2>
                <p>{about}</p>
            </section>
        </EditableElement>
    );
};

export default AboutSection;