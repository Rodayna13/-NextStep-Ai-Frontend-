import React from 'react';

const EditableElement = ({ 
    id, 
    activeElement, 
    onElementClick, 
    onEdit, 
    onDelete, 
    children, 
    className = '',
    stopPropagation = false 
}) => {
    const handleClick = (e) => {
        if (stopPropagation) {
            e.stopPropagation();
        }
        onElementClick(id);
    };

    const handleEdit = (e) => {
        if (stopPropagation) {
            e.stopPropagation();
        }
        onEdit(id);
    };

    const handleDelete = (e) => {
        if (stopPropagation) {
            e.stopPropagation();
        }
        onDelete(id);
    };

    return (
        <div 
            id={id}
            className={`editable-element ${activeElement === id ? 'active' : ''} ${className}`}
            onClick={handleClick}
        >
            {children}
            {activeElement === id && (
                <div className="edit-buttons">
                    <button onClick={handleEdit} className="edit-btn">Edit</button>
                    <button onClick={handleDelete} className="delete-btn">Delete</button>
                </div>
            )}
        </div>
    );
};

export default EditableElement;