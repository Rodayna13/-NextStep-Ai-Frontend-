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
                <h2
                    style={{
                        fontSize: "1.45rem",
                        fontWeight: 600,
                        marginBottom: "1rem",
                        color: "rgb(31, 41, 55)",
                        borderBottom: "2px solid rgb(229, 231, 235)",
                        paddingBottom: "0.25rem"
                    }}
                >
                    Profile
                </h2>
                <p style={{ color: about ? "inherit" : "#9ca3af", fontStyle: about ? "normal" : "italic" }}>
                    {about || "Add your profile here. Click edit to add or update your profile section."}
                </p>
            </section>
        </EditableElement>
    );
};

export default AboutSection;