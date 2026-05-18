const features = [
  {
    title: "Personalized",
    description: "Trips tailored to your preferences",
    marker: "P",
  },
  {
    title: "Trusted",
    description: "Data-backed destination matching",
    marker: "T",
  },
  {
    title: "Best Value",
    description: "Compare cost and experience",
    marker: "$",
  },
];

export default function FeatureStrip() {
  return (
    <section className="feature-strip" aria-label="Travel recommendation benefits">
      {features.map((feature) => (
        <article className="feature-item" key={feature.title}>
          <span className="feature-marker" aria-hidden="true">
            {feature.marker}
          </span>
          <div>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
