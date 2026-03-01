import React from "react";
import "./AcademicPrograms.css";

const programs = [
  {
    title: "Pre-Primary",
    age: "3-6 Years",
    desc: "A nurturing environment for early learners to explore and grow.",
    color: "#dcfce7",
  },
  {
    title: "Primary",
    age: "6-11 Years",
    desc: "Foundational learning with focus on literacy and core skills.",
    color: "#e0f2fe",
  },
  {
    title: "Middle School",
    age: "11-14 Years",
    desc: "Holistic development with introduction to specialized subjects.",
    color: "#fef9c3",
  },
  {
    title: "Secondary",
    age: "14-16 Years",
    desc: "Advanced curriculum preparing students for higher education.",
    color: "#fee2e2",
  },
];

const AcademicPrograms = () => {
  return (
    <section className="academic-programs-section">
      <div className="section-header center">
        <span className="badge">CURRICULUM</span>
        <h2 className="title">
          Academic <span className="highlight">Programs</span>
        </h2>
        <p className="subtitle">
          Comprehensive education tiers tailored for every stage of development.
        </p>
      </div>

      <div className="programs-grid">
        {programs.map((prog, index) => (
          <div
            className="program-card"
            key={index}
            style={{ "--accent-sub": prog.color }}
          >
            <div className="prog-number">0{index + 1}</div>
            <h3 className="prog-title">{prog.title}</h3>
            <span className="prog-age">{prog.age}</span>
            <p className="prog-desc">{prog.desc}</p>
            <a href="#" className="prog-link">
              Learn More <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AcademicPrograms;
