import React from "react";
import "./FacilitiesSection.css";

const facilities = [
  {
    title: "Smart Classes",
    icon: "fas fa-chalkboard",
    desc: "Interactive learning with advanced digital tools.",
  },
  {
    title: "Digital Library",
    icon: "fas fa-book-reader",
    desc: "Access to thousands of e-books and resources.",
  },
  {
    title: "Computer Lab",
    icon: "fas fa-desktop",
    desc: "Latest high-speed computers for technical growth.",
  },
  {
    title: "Science Lab",
    icon: "fas fa-flask",
    desc: "Well-equipped modular labs for experiments.",
  },
  {
    title: "Sports Academy",
    icon: "fas fa-running",
    desc: "Dedicated coaches for various indoor/outdoor sports.",
  },
  {
    title: "Transport",
    icon: "fas fa-bus",
    desc: "Safe and CCTV monitored bus routes for all areas.",
  },
];

const FacilitiesSection = () => {
  return (
    <section className="facilities-section">
      <div className="section-header center">
        <span className="badge">INFRASTRUCTURE</span>
        <h2 className="title">
          Modern <span className="highlight">Facilities</span>
        </h2>
        <p className="subtitle">
          World-class infrastructure designed for safety and excellence.
        </p>
      </div>

      <div className="facilities-grid">
        {facilities.map((fac, index) => (
          <div className="facility-item" key={index}>
            <div className="facility-icon">
              <i className={fac.icon}></i>
            </div>
            <div className="facility-text">
              <h4>{fac.title}</h4>
              <p>{fac.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FacilitiesSection;
