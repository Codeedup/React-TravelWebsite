const features = [
  {
    icon: "DB",
    title: "Open data",
    text: "Powered by trusted, open sources.",
  },
  {
    icon: "|||",
    title: "Easy comparison",
    text: "See key city info side by side.",
  },
  {
    icon: "==",
    title: "Simple filters",
    text: "Find cities that match your preferences.",
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
