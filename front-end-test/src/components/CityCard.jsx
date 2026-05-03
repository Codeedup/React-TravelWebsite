const rowIcons = {
  Cost: "$",
  Vibe: ":)",
  Language: "A",
  Weather: "o",
};

export default function CityCard({ city }) {
  return (
    <article className="city-card">
      {/* CSS gradients create lightweight image placeholders for the prototype. */}
      <div
        className={`city-image ${city.imageClass}`}
        role="img"
        aria-label={`${city.name}, ${city.country} city illustration`}
      >
        <span className="skyline" aria-hidden="true"></span>
      </div>

      <div className="city-details">
        <h2>{city.name}</h2>
        <p className="country">{city.country}</p>

        <dl className="city-stats">
          {city.stats.map(({ label, value }) => (
            <div className="stat-row" key={label}>
              <dt>
                <span className={`stat-icon ${label.toLowerCase()}`} aria-hidden="true">
                  {rowIcons[label]}
                </span>
                {label}
              </dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
