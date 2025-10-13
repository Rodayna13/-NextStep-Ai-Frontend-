import React from 'react';
import EditableElement from './EditableElement';

const ContactSection = ({ 
    activeElement, 
    onElementClick, 
    onEdit, 
    onDelete, 
    email, 
    phone, 
    location 
}) => {
    return (
        <EditableElement
            id="xcontact"
            activeElement={activeElement}
            onElementClick={onElementClick}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            <h3>Contact</h3>
            
            <EditableElement
                id="xemail"
                activeElement={activeElement}
                onElementClick={onElementClick}
                onEdit={onEdit}
                onDelete={onDelete}
                stopPropagation={true}
            >
                <p>Email: {email}</p>
            </EditableElement>

            <EditableElement
                id="xphone"
                activeElement={activeElement}
                onElementClick={onElementClick}
                onEdit={onEdit}
                onDelete={onDelete}
                stopPropagation={true}
            >
                <p>Phone: {phone}</p>
            </EditableElement>

            <EditableElement
                id="xlocation"
                activeElement={activeElement}
                onElementClick={onElementClick}
                onEdit={onEdit}
                onDelete={onDelete}
                stopPropagation={true}
            >
                <p>Location: {location}</p>
            </EditableElement>
        </EditableElement>
    );
};

export default ContactSection;