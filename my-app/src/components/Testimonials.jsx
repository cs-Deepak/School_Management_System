import React from "react";
import "./Testimonials.css";

const feedbacks = [
  {
    name: "Dr. Anjali Sharma",
    role: "Parent",
    text: "The discipline and academic focus at LBS are unparalleled. My daughter has grown immensely in just two years.",
    avatar: "https://i.pravatar.cc/150?u=anjali",
  },
  {
    name: "Rajesh Khanna",
    role: "Parent",
    text: "Excellent infrastructure and safety. The smart classes and digital library are a game changer for modern education.",
    avatar: "https://i.pravatar.cc/150?u=rajesh",
  },
  {
    name: "Aman Verma",
    role: "Alumni",
    text: "LBS provided the foundation I needed for my engineering career. The teachers are mentors for life.",
    avatar: "https://i.pravatar.cc/150?u=aman",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="section-header center">
        <span className="badge">FEEDBACK</span>
        <h2 className="title">
          What Parents <span className="highlight">Say</span>
        </h2>
      </div>

      <div className="testimonials-grid">
        {feedbacks.map((f, i) => (
          <div className="testimonial-card" key={i}>
            <div className="quote-icon">
              <i className="fas fa-quote-left"></i>
            </div>
            <p className="feedback-text">"{f.text}"</p>
            <div className="user-info">
              <img src={f.avatar} alt={f.name} className="user-avatar" />
              <div className="user-meta">
                <h4 className="user-name">{f.name}</h4>
                <span className="user-role">{f.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
