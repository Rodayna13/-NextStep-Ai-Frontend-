import React from "react";
import "./WhyChooseUs.css";

const features = [
    {
        icon: "🛠️",
        title: "Professional Templates",
        description:
            "Choose from a variety of professionally designed templates that are proven to get noticed.",
    },
    {
        icon: "✏️",
        title: "Easy to Customize",
        description:
            "Our intuitive editor makes it simple to customize your resume to match your personal brand.",
    },
    {
        icon: "⬇️",
        title: "Download as PDF",
        description:
            "Export your finished resume in high-quality PDF format, ready to send to employers.",
    },
];

const WhyChooseUs = () => (
    <section className="why-choose-us">
        <h2>Why Choose ResumeCraft?</h2>
        <p className="subtitle">
            Our platform is designed to make resume building fast, easy, and effective. Whether you're a recent graduate or an experienced professional, ResumeCraft helps you showcase your skills and achievements with confidence.
        </p>
        <div className="features">
            {features.map((feature, idx) => (
                <div className="feature-card" key={idx}>
                    <div className="icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                </div>
            ))}
        </div>
    </section>
);

export default WhyChooseUs;
