import { useState } from "react";
import {
  destinationImageMap,
  formatOptionLabel,
  getDestinationScore,
  getWeatherSummary,
  slugifyDestination,
} from "./data";

function getBestTime(destination) {
  const weather = (destination.weather_band || "").toLowerCase();

  if (weather === "hot") {
    return "Best time: Nov - Apr";
  }

  if (weather === "snowy") {
    return "Best time: Dec - Mar";
  }

  return "Best time: May - Sep";
}

export default function DestinationCard({ destination, index = 0 }) {
  const [imageFailed, setImageFailed] = useState(false);
  const slug = slugifyDestination(destination.destination);
  const imageSrc = destinationImageMap[slug];
  const tags = [
    destination.cost,
    destination.weather_band,
    destination.activity_type,
    ...(destination.vibes || []).slice(0, 2),
  ].filter(Boolean);

  return (
    <article className={`destination-card destination-${slug || "unknown"}`}>
      <div className="destination-media">
        {imageSrc && !imageFailed && (
          <img
            src={imageSrc}
            alt={`${destination.destination}, ${destination.country}`}
            onError={() => setImageFailed(true)}
          />
        )}
        <span className="score-badge">{getDestinationScore(destination, index)}</span>
        <button className="save-button" type="button" aria-label={`Save ${destination.destination}`}>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div className="destination-copy">
        <h3>{destination.destination}</h3>
        <p className="destination-country">{destination.country}</p>
        <p className="destination-description">
          {destination.activity_name ||
            `${formatOptionLabel(destination.activity_type)} travel with a ${formatOptionLabel(
              destination.cost,
            )} profile.`}
        </p>

        <div className="destination-tags" aria-label={`${destination.destination} tags`}>
          {tags.slice(0, 5).map((tag) => (
            <span key={tag}>{formatOptionLabel(tag)}</span>
          ))}
        </div>

        <div className="destination-footer">
          <span>{getBestTime(destination)}</span>
          <span>{getWeatherSummary(destination) || "Climate data pending"}</span>
        </div>
      </div>
    </article>
  );
}
