import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We are here to answer your questions and guide you</p>
        </div>
      </section>

      <div className="container">
        <section className="contact-grid">
          <div className="contact-info-cards">
            <div className="info-card">
              <i className="fas fa-map-marked-alt"></i>
              <h4>Location</h4>
              <p>Main Street, LBS Campus, New Delhi, India 110001</p>
            </div>
            <div className="info-card">
              <i className="fas fa-phone-alt"></i>
              <h4>Phone</h4>
              <p>
                +91 12345 67890
                <br />
                +91 98765 43210
              </p>
            </div>
            <div className="info-card">
              <i className="fas fa-envelope-open-text"></i>
              <h4>Email</h4>
              <p>
                info@lbspschool.edu.in
                <br />
                admissions@lbspschool.edu.in
              </p>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h2>
              Send us a <span className="highlight">Message</span>
            </h2>
            <form className="contact-form">
              <div className="form-row">
                <input type="text" placeholder="Full Name" required />
                <input type="email" placeholder="Email Address" required />
              </div>
              <input type="text" placeholder="Subject" />
              <textarea placeholder="Your Message" rows="6" required></textarea>
              <button type="submit" className="btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </section>

        <section className="map-section">
          <div className="map-placeholder">
            <p>Interactive Google Map will be embedded here</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
