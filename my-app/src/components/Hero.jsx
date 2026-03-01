import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

// 8-9 High-quality school images
const sliderImages = [
  "/schoolImage.png", // Main user image
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
  "https://images.unsplash.com/photo-1544717297-fa95b35c76d7?w=800&q=80",
  "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80",
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % sliderImages.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe)
      setActiveIndex(
        (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
      );
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="badge-admissions">
            <span className="dot"></span> Admissions Open 2026-27
          </div>
          <h1 className="hero-title">
            Shaping Future with{" "}
            <span className="highlight">Quality Education</span>
          </h1>
          <p className="hero-description">
            Providing quality education with discipline, innovation, and
            excellence. We empower young minds to lead and thrive in a global
            environment.
          </p>
          <div className="hero-ctas">
            <Link to="/admissions" className="btn-primary">
              Apply for Admission
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact School
            </Link>
          </div>

          <div className="floating-notices">
            <div className="notice-item">
              <i className="fas fa-bullhorn"></i>
              <span>Results declared for Annual Sports Meet!</span>
            </div>
            <div className="notice-item">
              <i className="fas fa-calendar-alt"></i>
              <span>Upcoming Summer Workshop starts July 1st.</span>
            </div>
          </div>
        </div>

        <div
          className="hero-image-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="image-stack-container">
            {sliderImages.map((img, index) => {
              // Calculate relative position for the stack effect
              let position = index - activeIndex;
              if (position < 0) position += sliderImages.length;

              // Only show top 5-6 in the actual visual stack for performance/cleanliness
              const isVisible = position < 6;
              const isActive = position === 0;

              return (
                <div
                  key={index}
                  className={`stack-card ${isActive ? "active" : ""} ${isVisible ? "visible" : ""}`}
                  style={{
                    "--offset": position,
                    zIndex: sliderImages.length - position,
                  }}
                >
                  <img
                    src={img}
                    alt={`LBS School ${index + 1}`}
                    loading="lazy"
                  />
                  <div className="card-overlay"></div>
                </div>
              );
            })}
          </div>

          {/* Slider Pagination Dots */}
          <div className="slider-indicators">
            {sliderImages.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(i)}
              ></span>
            ))}
          </div>

          {/* Improved Stats Preview Card */}

          {/* <div className="stats-card-floating">
            <div className="progress-widget">
              <svg className="progress-circle" width="70" height="70">
                <circle className="circle-bg" cx="35" cy="35" r="30"></circle>
                <circle
                  className="circle-progress"
                  cx="35"
                  cy="35"
                  r="30"
                ></circle>
              </svg>
              <div className="progress-text">
                <span className="number">98%</span>
              </div>
            </div>
            <div className="stats-info">
              <h4>Academic Results</h4>
              <p>Success Rate 2024</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* <div className="scroll-hint">
        <span>Scroll to Explore</span>
        <div className="mouse"></div>
      </div> */}
    </section>
  );
};

export default Hero;
