import React from "react";
import "./StatBar.css";

const stats = [
  { label: "Total Students", value: "2500+", icon: "fas fa-users" },
  {
    label: "Experienced Teachers",
    value: "150+",
    icon: "fas fa-chalkboard-teacher",
  },
  { label: "Years of Excellence", value: "35+", icon: "fas fa-award" },
  { label: "Smart Classes", value: "100%", icon: "fas fa-laptop" },
];

const StatBar = () => {
  return (
    <div className="stat-bar-section">
      <div className="stat-bar-container">
        {stats.map((stat, index) => (
          <div className="stat-item" key={index}>
            <div className="stat-icon">
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
            {index < stats.length - 1 && <div className="stat-divider"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatBar;
