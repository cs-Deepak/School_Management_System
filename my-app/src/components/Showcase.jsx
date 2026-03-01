import React from "react";
import "./Showcase.css";

const showcaseImages = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
];

export default function Showcase() {
  return (
    <section className="showcase-section" id="showcase">
      <div className="showcase-marquee-container">
        {/* Gradient overlays for the cinematic edge fade effect */}
        <div className="marquee-fade-left"></div>
        <div className="marquee-fade-right"></div>

        <div className="marquee-track">
          {/* First set of images */}
          {showcaseImages.map((src, idx) => (
            <div className="marquee-item glass-panel" key={`first-${idx}`}>
              <div className="marquee-img-wrapper">
                <img src={src} alt="School Life" className="marquee-img" />
                <div className="marquee-img-overlay"></div>
              </div>
            </div>
          ))}
          {/* Second set of images (duplicated for seamless infinite scroll) */}
          {showcaseImages.map((src, idx) => (
            <div className="marquee-item glass-panel" key={`second-${idx}`}>
              <div className="marquee-img-wrapper">
                <img src={src} alt="School Life" className="marquee-img" />
                <div className="marquee-img-overlay"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
