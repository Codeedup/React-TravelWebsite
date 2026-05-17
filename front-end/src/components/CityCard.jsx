const chipIcons = {
  Cost: "$",
  Vibe: ":)",
  Language: "A",
  Weather: "o",
};

export default function CityCard({ city }) {
  return (
    <article className="city-card">
      {/* CSS illustration placeholders keep the prototype static and asset-free. */}
      <div
        className={`city-image ${city.imageClass}`}
        role="img"
        aria-label={`${city.name}, ${city.country} city preview`}
      >
        <span className="city-skyline" aria-hidden="true"></span>
      </div>

      <div className="city-content">
        <h2>{city.name}</h2>
        <p>{city.country}</p>

        <div className="stat-chip-grid" aria-label={`${city.name} city details`}>
          {city.stats.map((stat) => (
            <span className={`stat-chip ${stat.label.toLowerCase()}`} key={stat.label}>
              <span className="chip-icon" aria-hidden="true">
                {chipIcons[stat.label]}
              </span>
              {stat.label}: {stat.value}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
