const badges = ["AI-Powered Picks", "Local Experiences", "Best Price Match"];

export default function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-background" role="img" aria-label="Bright coastal travel view">
        <div className="hero-content">
          <p className="eyebrow">Travel recommender</p>
          <h1 id="hero-title">Smart recommendations. Unforgettable journeys.</h1>
          <p className="hero-subtitle">
            Tell us what you love, we'll find the perfect trip for you.
          </p>

          <div className="benefit-badges" aria-label="Wanderly benefits">
            {badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
