import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import lbsLogo from "../assets/lbs_logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ABOUT US", path: "/about" },
    { name: "ACADEMICS", path: "/academics" },
    { name: "ADMISSIONS", path: "/admissions" },
    { name: "CONTACT US", path: "/contact" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <img src={lbsLogo} alt="LBS Logo" className="logo-img" />
          <div className="logo-text">
            <span className="logo-lbs">LBS</span>
            <span className="logo-school"> PUBLIC SCHOOL</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Quick Actions */}
        <div className="navbar-actions">
          <Link to="/admissions" className="btn-admission">
            Admission Open 2026-27
          </Link>
          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={location.pathname === link.path ? "active" : ""}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/admissions"
              className="mobile-cta"
              onClick={() => setMenuOpen(false)}
            >
              Apply for Admission
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
