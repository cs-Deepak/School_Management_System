import React from "react";
import "./NoticeBoard.css";

const notices = [
  {
    id: 1,
    date: "Oct 25, 2026",
    title: "Annual Science Exhibition Registration Open",
    category: "Event",
  },
  {
    id: 2,
    date: "Oct 20, 2026",
    title: "Quarterly Examination Schedule Released",
    category: "Exam",
  },
  {
    id: 3,
    date: "Oct 15, 2026",
    title: "Circular Regarding New School Timings",
    category: "Circular",
  },
  {
    id: 4,
    date: "Oct 10, 2026",
    title: "Admissions for Batch 2026-27 are now live",
    category: "Admission",
  },
];

const NoticeBoard = () => {
  return (
    <section className="notice-board-section">
      <div className="section-header center">
        <span className="badge">UPDATES</span>
        <h2 className="title">
          School <span className="highlight">Notice Board</span>
        </h2>
      </div>

      <div className="notice-container">
        <div className="notice-list">
          {notices.map((notice) => (
            <div className="notice-card" key={notice.id}>
              <div className="notice-date">
                <span className="day">
                  {notice.date.split(" ")[1].replace(",", "")}
                </span>
                <span className="month">{notice.date.split(" ")[0]}</span>
              </div>
              <div className="notice-content">
                <span
                  className={`notice-category ${notice.category.toLowerCase()}`}
                >
                  {notice.category}
                </span>
                <h4 className="notice-title">{notice.title}</h4>
                <a href="#" className="read-more">
                  Download PDF <i className="fas fa-download"></i>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="notice-cta-card">
          <h3>Stay Updated?</h3>
          <p>
            Get the latest school circulars and exam dates directly in your
            inbox.
          </p>
          <button className="btn-primary-sm">View All Notices</button>
        </div>
      </div>
    </section>
  );
};

export default NoticeBoard;
