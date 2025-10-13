import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { useFormContext } from "react-hook-form";
import "./ResumeTemplate1.css"
import ProfileSection from "./ProfileSection";
import ContactSection from "./ContactSection";
import SkillsSection from "./SkillsSection";
import AboutSection from "./AboutSection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";


const ResumeTemplate1 = ({cvRef}) => {
    // const cvRef = useRef();
    const { watch } = useFormContext();
    const [activeElement, setActiveElement] = useState(null);

    // Default values for the form fields
    const defaultValues = {
        fullName: "",
        email: "",
        headline: "",
        mobileNumber: "",
        location: "",
        about: "",
        profilePic: "",
        educations: [
            {
                logo: "",
                title: "",
                caption: "",
                startDate: "",
                endDate: "",
            }
        ],
        experiences: [
            {
                logo: "",
                title: "",
                caption: "",
                company: "",
                subComponents: [
                    { title: "", startDate: "", endDate: "", description: "" }
                ]
            }
        ]
    };

    const handleDownloadPdf = () => {
        const element = cvRef.current;
        const options = {
            margin: 0,
            filename: "My_CV.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, scrollY: 0 },
            jsPDF: { unit: "pt", format: "a4", orientation: "portrait" }
        };
        html2pdf().set(options).from(element).save();
    };

    const handleElementClick = (elementId) => {
        setActiveElement(elementId);
    };

    const handleEdit = (elementId) => {
        console.log(document.getElementById(elementId))
        document.getElementById(elementId).style.display = 'none';
        console.log(`Edit ${elementId}`);
        // Add edit functionality here
    };

    const handleDelete = (elementId) => {
        console.log(document.getElementById(elementId))
        document.getElementById(elementId).style.display = 'none';
        console.log(`Edit ${elementId}`);
        // Add delete functionality here
    };


    return (
        <div
            ref={cvRef}
            className="resume-template"
        >
            {/* CV PREVIEW AREA */}
            <div
                ref={cvRef}
                className="resume-preview"
            >
                {/* LEFT SIDEBAR */}
                <div className="resume-sidebar">
                    <ProfileSection
                        activeElement={activeElement}
                        onElementClick={handleElementClick}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        profilePic={watch('profilePic')}
                        fullName={watch('fullName') || defaultValues.fullName}
                        headline={watch('headline') || defaultValues.headline}
                    />

                    <ContactSection
                        activeElement={activeElement}
                        onElementClick={handleElementClick}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        email={watch('email') || defaultValues.email}
                        phone={watch('mobileNumber') || defaultValues.mobileNumber}
                        location={watch('location') || defaultValues.location}
                    />

                    <SkillsSection
                        activeElement={activeElement}
                        onElementClick={handleElementClick}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                {/* RIGHT CONTENT */}
                <div className="resume-content">
                    <AboutSection
                        activeElement={activeElement}
                        onElementClick={handleElementClick}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        about={watch('about') || defaultValues.about}
                    />

                    <ExperienceSection
                        activeElement={activeElement}
                        onElementClick={handleElementClick}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        experiences={watch('experiences', defaultValues.experiences)}
                    />

                    <EducationSection
                        activeElement={activeElement}
                        onElementClick={handleElementClick}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        educations={watch('educations', defaultValues.educations)}
                    />
                </div>
            </div>

            {/* DOWNLOAD BUTTON */}
            <div className="download-btn-container">
                <button onClick={handleDownloadPdf} className="download-button">
                    Download as PDF
                </button>
            </div>
        </div>
    );
};

export default ResumeTemplate1;
