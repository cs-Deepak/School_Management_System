import React from "react";
import { Link } from "react-router-dom";
import "./AdmissionCTA.css";

const AdmissionCTA = () => {
  return (
    <section className="admission-cta-section">
      <div className="cta-banner">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Join Our Community?</h2>
          <p className="cta-text">
            Admissions for the academic session 2026-27 are now open. Secure
            your child's future today with LBS Public School.
          </p>
          <div className="cta-buttons">
            <Link to="/admissions" className="btn-accent">
              Apply Online Now
            </Link>
            <a href="#" className="btn-outline-white">
              Download Prospectus
            </a>
          </div>
        </div>
        <div className="cta-decoration">
          <i className="fas fa-graduation-cap"></i>
        </div>
      </div>
    </section>
  );
};

export default AdmissionCTA;
