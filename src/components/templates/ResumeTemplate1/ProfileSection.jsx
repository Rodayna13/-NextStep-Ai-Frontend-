import React, { useState } from 'react';
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
    const [localProfilePic, setLocalProfilePic] = useState(profilePic);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLocalProfilePic(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <EditableElement
            id="xprofile"
            activeElement={activeElement}
            onElementClick={onElementClick}
            onEdit={onEdit}
            onDelete={onDelete}
            className="resume-profile-pic-container"
        >
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                    src={localProfilePic || profilePic || "https://cdn.vectorstock.com/i/1000v/51/05/male-profile-avatar-with-brown-hair-vector-12055105.jpg"}
                    alt="profile"
                    className="resume-profile-pic"
                    crossOrigin="anonymous"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "images/profile.png"
                    }}
                    onClick={(e) => { e.stopPropagation(); }}
                />
                <input
                    type="file"
                    accept="image/*"
                    style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    title="Upload profile picture"
                    onChange={handleFileChange}
                />
                <span style={{ position: 'absolute', bottom: 0, right: 0, background: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '0.8em', boxShadow: '0 0 2px #aaa' }}>✎</span>
            </div>
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