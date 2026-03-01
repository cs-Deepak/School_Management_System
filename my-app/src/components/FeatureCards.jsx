import "./FeatureCards.css";

export default function FeatureCards() {
  const cards = [
    {
      id: 1,
      icon: "fas fa-shield-alt",
      title: "Academic Excellence",
      description:
        "Rigorous curriculum focused on holistic student development.",
    },
    {
      id: 2,
      icon: "fas fa-laptop-code",
      title: "Modern Facilities",
      description: "State-of-the-art labs and interactive smart classrooms.",
    },
    {
      id: 3,
      icon: "fas fa-globe",
      title: "Global Perspective",
      description: "Preparing students to thrive in an interconnected world.",
    },
  ];

  return (
    <section className="feature-cards-section">
      <div className="feature-cards-container">
        {cards.map((card) => (
          <div key={card.id} className="feature-card glass-feature-card">
            <div className="card-icon-wrapper">
              <i className={card.icon}></i>
            </div>
            <h3 className="card-title-standard">{card.title}</h3>
            <p className="card-desc-standard">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
