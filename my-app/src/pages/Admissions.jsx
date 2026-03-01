import React from "react";
import "./Admissions.css";

const Admissions = () => {
  return (
    <div className="admissions-page">
      <section className="page-hero">
        <div className="container">
          <h1>Join LBS Public School</h1>
          <p>Your journey towards excellence starts here</p>
        </div>
      </section>

      <div className="container">
        <section className="admission-process">
          <div className="section-header">
            <h2>
              Admission <span className="highlight">Process</span>
            </h2>
            <p>Our admission process is transparent and straightforward.</p>
          </div>

          <div className="process-timeline">
            {[
              {
                step: "01",
                title: "Enquiry",
                desc: "Visit our campus or fill out the online enquiry form to get started.",
              },
              {
                step: "02",
                title: "Registration",
                desc: "Submit the registration form along with the required documents.",
              },
              {
                step: "03",
                title: "Interaction",
                desc: "A brief meeting with the student and parents to understand expectations.",
              },
              {
                step: "04",
                title: "Admission",
                desc: "Complete the formalities and secure your seat in the session.",
              },
            ].map((p, i) => (
              <div className="process-step" key={i}>
                <div className="step-num">{p.step}</div>
                <div className="step-content">
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="eligibility-fees">
          <div className="eligibility-card">
            <h3>Eligibility Criteria</h3>
            <ul>
              <li>
                <i className="fas fa-check-circle"></i> Minimum age for
                Pre-Primary is 3 years.
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Transfer Certificate
                from the previous school.
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Academic records of the
                last two classes attended.
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Birth certificate and
                residence proof.
              </li>
            </ul>
          </div>
          <div className="enquiry-form-card">
            <h3>Quick Enquiry</h3>
            <form className="quick-form">
              <input type="text" placeholder="Parent Name" required />
              <input type="email" placeholder="Email Address" required />
              <input type="tel" placeholder="Phone Number" required />
              <select>
                <option>Select Class</option>
                <option>Pre-Primary</option>
                <option>Primary</option>
                <option>Middle School</option>
                <option>Secondary</option>
              </select>
              <button type="submit" className="btn-primary-sm">
                Submit Enquiry
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admissions;
