import React from 'react';
import EditableElement from './EditableElement';

const ProfileSection = ({
    activeElement,
    onElementClick,
    onEdit,
    onDelete,
    profilePic,
    fullName,
    headline
}) => {
    return (
        <EditableElement
            id="xprofile"
            activeElement={activeElement}
            onElementClick={onElementClick}
            onEdit={onEdit}
            onDelete={onDelete}
            className="resume-profile-pic-container"
        >
            <img
                src={profilePic || "https://cdn.vectorstock.com/i/1000v/51/05/male-profile-avatar-with-brown-hair-vector-12055105.jpg"}
                alt="profile"
                className="resume-profile-pic"

            />
            <EditableElement
                id="xfullName"
                activeElement={activeElement}
                onElementClick={onElementClick}
                onEdit={onEdit}
                onDelete={onDelete}
                stopPropagation={true}
            >
                <h2>{fullName}</h2>
            </EditableElement>
            <EditableElement
                id="xheadline"
                activeElement={activeElement}
                onElementClick={onElementClick}
                onEdit={onEdit}
                onDelete={onDelete}
                stopPropagation={true}
            >
                <p>{headline}</p>
            </EditableElement>
        </EditableElement>
    );
};

export default ProfileSection;