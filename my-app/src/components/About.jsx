import React, { useState } from "react";
import "./About.css";

export default function About() {
  const [openStepId, setOpenStepId] = useState(1);

  return (
    <section className="about-section" id="about">
      {/* Row 1: About Text & Image */}
      <div className="about-grid-row">
        {/* Left: Text Content */}
        <div className="about-text-content">
          <div className="heritage-badge">
            <i className="fas fa-history"></i> Since 1985
          </div>
          <h2 className="section-title-large">
            Shaping Excellence at LBS Public School
          </h2>
          <p className="section-desc-main">
            With a legacy of over{" "}
            <span className="highlight-text">39 years</span>, we have been a
            cornerstone of quality education, disciplined learning, and holistic
            development in the community.
          </p>
          <p className="section-desc-sub">
            Our mission is to nurture curious minds into global leaders. We
            provide a state-of-the-art environment where traditional values meet
            modern innovation, ensuring every child finds their path to success.
          </p>
          <div className="about-features">
            <div className="feature-item">
              <i className="fas fa-check-circle"></i> CBSE Affiliated
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i> Modern Infrastructure
            </div>
          </div>
          <a href="/about" className="neu-button-dark btn-inline">
            Discover Our Legacy
          </a>
        </div>

        {/* Right: School Image Card */}
        <div className="about-image-card">
          <div className="image-overlay-box">
            <img
              src="/schoolImage.png"
              alt="LBS School Campus"
              className="main-about-img"
            />
            <div className="experience-badge">
              <span className="years">39+</span>
              <span className="label">Years of Excellence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Academics & Admission Steps */}
      <div className="about-grid-row mt-20" id="academics">
        {/* Left: Academics Box */}
        <div className="neu-card academics-card">
          <div className="card-header-flex">
            <h3 className="section-title-md">Our Academic Segments</h3>
            <span className="badge-outline">K-12 Education</span>
          </div>
          <div className="academics-icons-grid">
            {[
              { icon: "fas fa-shapes", label: "Pre-Primary" },
              { icon: "fas fa-child", label: "Primary" },
              { icon: "fas fa-book", label: "Middle" },
              {
                icon: "fas fa-graduation-cap",
                label: "Secondary",
                active: true,
              },
              { icon: "fas fa-microscope", label: "Sr. Secondary" },
            ].map((item, i) => (
              <div
                className={`acad-grid-item ${item.active ? "active" : ""}`}
                key={i}
              >
                <div className="acad-icon-box">
                  <i className={item.icon}></i>
                </div>
                <span className="acad-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Admission Steps accordion */}
        <div className="neu-card admission-card">
          <h3 className="section-title-md">Start Your Journey</h3>
          <p className="admission-sub">
            Follow these simple steps for a seamless admission process.
          </p>

          <div className="admission-steps-list">
            {[
              {
                id: 1,
                icon: "fas fa-comment-dots",
                title: "1. Initial Enquiry",
                content:
                  "Visit our campus or fill out the online form to connect with our admissions counselor.",
              },
              {
                id: 2,
                icon: "fas fa-file-signature",
                title: "2. Submission",
                content:
                  "Submit the registration form along with necessary documents (Birth Cert, Transfer Cert, etc.)",
              },
              {
                id: 3,
                icon: "fas fa-user-friends",
                title: "3. Interaction",
                content:
                  "A friendly interaction session with the student and parents to align on educational goals.",
              },
            ].map((step) => {
              const isOpen = openStepId === step.id;

              return (
                <div
                  key={step.id}
                  className={`admission-step-glass ${isOpen ? "step-open" : ""}`}
                >
                  <div
                    className="step-glass-header"
                    onClick={() => setOpenStepId(isOpen ? null : step.id)}
                  >
                    <div className="step-left">
                      <i className={`${step.icon} step-icon`}></i>
                      <span className="step-label">{step.title}</span>
                    </div>
                    <span className="step-toggle-icon">
                      <i
                        className={`fas fa-chevron-${isOpen ? "up" : "down"}`}
                      ></i>
                    </span>
                  </div>

                  <div
                    className={`step-glass-content-wrapper ${isOpen ? "open" : ""}`}
                  >
                    <div className="step-glass-content">{step.content}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="apply-btn-premium">
            Apply for Admission <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
