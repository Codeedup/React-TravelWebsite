import { useState } from "react";

function slugifyDestination(name = "") {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatLabel(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function getWeatherSummary(destination) {
  const parts = [];

  if (destination.weather_band) {
    parts.push(destination.weather_band);
  }

  if (typeof destination.avg_temp_c === "number") {
    parts.push(`${destination.avg_temp_c.toFixed(1)}C`);
  }

  if (typeof destination.rainfall_mm === "number") {
    parts.push(`${destination.rainfall_mm.toFixed(0)}mm rain`);
  }

  return parts.join(" | ");
}

function getMatchLabel(destination, index) {
  if (destination.selected_filter_count > 0) {
    const percent = Math.round(
      (destination.match_count / destination.selected_filter_count) * 100,
    );
    return `${percent}% match`;
  }

  return `${Math.max(92 - index * 2, 82)}% match`;
}

export default function DestinationCard({ destination, index }) {
  const [imageFailed, setImageFailed] = useState(false);
  const slug = slugifyDestination(destination.destination);
  const imageSrc = `/assets/destinations/${slug}.jpg`;
  const tags = [
    destination.cost,
    destination.weather_band,
    destination.activity_type,
    ...(destination.vibes ?? []),
  ].filter(Boolean);
  const weatherSummary = getWeatherSummary(destination);

  return (
    <article className="destination-card">
      <div className={`destination-media ${imageFailed ? "image-fallback" : ""}`}>
        {!imageFailed && (
          <img
            src={imageSrc}
            alt={`${destination.destination}, ${destination.country}`}
            onError={() => setImageFailed(true)}
          />
        )}
        <span className="match-badge">{getMatchLabel(destination, index)}</span>
        <button
          className="save-button"
          type="button"
          aria-label={`Save ${destination.destination}`}
        >
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div className="destination-body">
        <div className="destination-title-row">
          <div>
            <h3>{destination.destination}</h3>
            <p>{destination.country}</p>
          </div>
          <span className="cost-pill">{formatLabel(destination.cost)}</span>
        </div>

        <p className="destination-description">
          {destination.activity_name ||
            `${formatLabel(destination.activity_type)} experiences with a ${formatLabel(
              destination.cost,
            )} travel profile.`}
        </p>

        <div className="detail-list">
          <span>{weatherSummary || "Weather data pending"}</span>
          <span>{formatLabel(destination.activity_type) || "Activity match"}</span>
          <span>{(destination.vibes ?? []).slice(0, 2).join(", ") || "Flexible vibe"}</span>
        </div>

        <div className="tag-row" aria-label={`${destination.destination} tags`}>
          {tags.slice(0, 5).map((tag) => (
            <span key={tag}>{formatLabel(tag)}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
