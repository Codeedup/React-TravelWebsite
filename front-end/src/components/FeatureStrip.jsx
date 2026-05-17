const features = [
  {
    icon: "DB",
    title: "Open data",
    text: "Powered by trusted open sources.",
  },
  {
    icon: "==",
    title: "Easy comparison",
    text: "Side-by-side insights that matter.",
  },
  {
    icon: "SL",
    title: "Simple filters",
    text: "Pick what matters to you.",
  },
];

export default function FeatureStrip() {
  return (
    <section className="feature-strip" aria-label="City Vibe Explorer features">
      {features.map((feature) => (
        <article className="feature-item" key={feature.title}>
          <span className="feature-icon" aria-hidden="true">
            {feature.icon}
          </span>
          <div>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
