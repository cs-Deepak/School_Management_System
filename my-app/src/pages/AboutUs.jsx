import React from "react";
import "./AboutUs.css";

// Assets (Using Placeholders for demonstration)
const images = {
  hero: "/schoolImage.png",
  overview:
    "/schoolImage.png",
  chairman:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  principal:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  admin1: "https://i.pravatar.cc/150?u=1",
  admin2: "https://i.pravatar.cc/150?u=2",
  admin3: "https://i.pravatar.cc/150?u=3",
  gallery1:
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80",
  gallery2:
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80",
  gallery3:
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=80",
};

const AboutUs = () => {
  return (
    <div className="about-us-premium">
      {/* 1. Hero Banner */}
      <section
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${images.hero})`,
        }}
      >
        <div className="container">
          <span className="badge-light">ESTD. 1985</span>
          <h1 className="hero-title">About LBS Public School</h1>
          <p className="hero-tagline">
            Building Strong Foundations for a Brighter Future
          </p>
        </div>
      </section>

      {/* 2. School Overview */}
      <section className="about-overview section-padding">
        <div className="container overflow-grid">
          <div className="overview-text">
            <span className="section-badge">OUR STORY</span>
            <h2 className="section-title">
              A Legacy of <span className="highlight">Excellence</span>
            </h2>
            <p>
              Founded in 1985, LBS Public School has been at the forefront of
              quality education for over three decades. Affiliated with CBSE, we
              pride ourselves on a teaching philosophy that blends traditional
              values with modern innovation.
            </p>
            <div className="feat-list">
              <div className="feat-item">
                <i className="fas fa-certificate"></i> CBSE Affiliated
              </div>
              <div className="feat-item">
                <i className="fas fa-users"></i> 1000+ Students
              </div>
              <div className="feat-item">
                <i className="fas fa-chalkboard-teacher"></i> Expert Faculty
              </div>
            </div>
          </div>
          <div className="overview-image">
            <img
              src={images.overview}
              alt="School Overview"
              className="img-float"
            />
          </div>
        </div>
      </section>

      {/* 3. Vision, Mission & Values */}
      <section className="about-ideology section-padding bg-alt">
        <div className="container grid-3">
          <div className="ideology-card">
            <div className="card-icon">
              <i className="fas fa-eye"></i>
            </div>
            <h3>Our Vision</h3>
            <p>
              To empower students to become global leaders through holistic
              development and innovation.
            </p>
          </div>
          <div className="ideology-card highlight-card">
            <div className="card-icon">
              <i className="fas fa-bullseye"></i>
            </div>
            <h3>Our Mission</h3>
            <p>
              Providing a safe, inclusive, and challenging environment that
              fosters intellectual and social growth.
            </p>
          </div>
          <div className="ideology-card">
            <div className="card-icon">
              <i className="fas fa-gem"></i>
            </div>
            <h3>Core Values</h3>
            <ul className="values-list">
              <li>Discipline & Integrity</li>
              <li>Excellence & Respect</li>
              <li>Continuous Innovation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Chairman & Principal Message */}
      <section className="leadership section-padding">
        <div className="container">
          <div className="leadership-row">
            <div className="leader-card">
              <div className="leader-img">
                <img src={images.chairman} alt="Chairman" />
              </div>
              <div className="leader-content">
                <span className="leader-role">Founder & Chairman</span>
                <h3>Shri R.K. Sharma</h3>
                <p>
                  "Education is the most powerful weapon which you can use to
                  change the world. At LBS, we arm our students with character."
                </p>
              </div>
            </div>
            <div className="leader-card">
              <div className="leader-img">
                <img src={images.principal} alt="Principal" />
              </div>
              <div className="leader-content">
                <span className="leader-role">Principal</span>
                <h3>Dr. Anjali Verma</h3>
                <p>
                  "We don't just teach subjects; we inspire young minds to
                  think, question, and excel in every aspect of life."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Management Team */}
      <section className="admin-team section-padding bg-alt">
        <div className="container center">
          <span className="section-badge">LEADERSHIP</span>
          <h2 className="section-title">The Management Team</h2>
          <div className="team-grid mt-50">
            {[
              { name: "Mr. Sunil Gupta", role: "Director", img: images.admin1 },
              {
                name: "Ms. Neha Sinha",
                role: "Vice Principal",
                img: images.admin2,
              },
              {
                name: "Mr. Rajeev Mehra",
                role: "Admin Head",
                img: images.admin3,
              },
            ].map((m, i) => (
              <div className="team-card" key={i}>
                <img src={m.img} alt={m.name} />
                <h4>{m.name}</h4>
                <span>{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Infrastructure Overview */}
      <section className="infra-overview section-padding">
        <div className="container center">
          <span className="section-badge">FACILITIES</span>
          <h2 className="section-title">World-class Infrastructure</h2>
          <div className="infra-grid mt-50">
            {[
              { icon: "fa-chalkboard", title: "Smart Class" },
              { icon: "fa-flask", title: "Science Labs" },
              { icon: "fa-laptop-code", title: "Computer Lab" },
              { icon: "fa-book", title: "Library" },
              { icon: "fa-volleyball-ball", title: "Sports Ground" },
              { icon: "fa-bus", title: "Transport" },
            ].map((f, i) => (
              <div className="infra-item" key={i}>
                <i className={`fas ${f.icon}`}></i>
                <p>{f.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Journey Timeline */}
      <section className="journey-timeline section-padding bg-alt">
        <div className="container">
          <h2 className="section-title center">
            Our <span className="highlight">Journey</span>
          </h2>
          <div className="timeline-container mt-50">
            {[
              { year: "1985", text: "School Founded with 50 students" },
              { year: "2010", text: "New modern wing inaugurated" },
              { year: "2018", text: "Smart classes started school-wide" },
              { year: "2025", text: "100% Digital ERP Implemented" },
            ].map((t, i) => (
              <div className="timeline-item" key={i}>
                <div className="time-year">{t.year}</div>
                <div className="time-content">{t.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Why Choose Us (USP) */}
      <section className="about-usp section-padding">
        <div className="container grid-2-center">
          <div className="usp-text">
            <span className="section-badge">WHY CHOOSE US</span>
            <h2 className="section-title">Focused on Student Growth</h2>
            <div className="usp-list mt-30">
              <div className="usp-point">
                <i className="fas fa-check"></i> Experienced Faculty
              </div>
              <div className="usp-point">
                <i className="fas fa-check"></i> 100% Safety & Security
              </div>
              <div className="usp-point">
                <i className="fas fa-check"></i> Result Oriented Teaching
              </div>
              <div className="usp-point">
                <i className="fas fa-check"></i> Premium Infrastructure
              </div>
            </div>
          </div>
          <div className="usp-visual">
            <div className="stat-circle">
              100%<span>Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Accreditations */}
      <section className="accreditations section-padding bg-alt">
        <div className="container center">
          <h2 className="section-title">
            Accreditations & <span className="highlight">Affiliations</span>
          </h2>
          <div className="logos-grid mt-50">
            <div className="logo-box">CBSE</div>
            <div className="logo-box">ISO Certified</div>
            <div className="logo-box">Govt. Recognized</div>
          </div>
        </div>
      </section>

      {/* 10. Photo Gallery Preview */}
      <section className="gallery-preview section-padding">
        <div className="container center">
          <span className="section-badge">GALLERY</span>
          <h2 className="section-title">Visual Glimpse of Campus</h2>
          <div className="gallery-grid mt-50">
            <img src={images.gallery1} alt="Gallery 1" />
            <img src={images.gallery2} alt="Gallery 2" />
            <img src={images.gallery3} alt="Gallery 3" />
          </div>
        </div>
      </section>

      {/* 11. Admission CTA */}
      <section className="about-cta section-padding">
        <div className="container cta-box center">
          <h2>Start Your Child's Bright Future Today</h2>
          <div className="cta-btns mt-30">
            <button className="btn-accent">Apply for Admission</button>
            <button className="btn-white-outline">Contact Us</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
