import { useState } from "react";
import {
  destinationImageMap,
  formatOptionLabel,
  getMatchPercent,
  getWeatherLine,
  slugifyDestination,
} from "./destinationUtils";

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
            alt={`${destination.destination}, ${destination.country}`}
            src={imageSrc}
            onError={() => setImageFailed(true)}
          />
        )}
        <span className="match-badge">
          {getMatchPercent(destination, index)}%
          <small>match</small>
        </span>
        <span className="card-stamp" aria-hidden="true">
          DREAMROUTE<br />RECOMMENDED
        </span>
      </div>

      <div className="destination-copy">
        <h3>
          {destination.destination}, {destination.country}
        </h3>
        <p>
          {destination.activity_name ||
            `${formatOptionLabel(destination.activity_type)} travel with a ${formatOptionLabel(
              destination.cost,
            )} profile.`}
        </p>

        <div className="tag-strip" aria-label={`${destination.destination} tags`}>
          {tags.map((tag) => (
            <span key={tag}>{formatOptionLabel(tag)}</span>
          ))}
        </div>

        <div className="card-footer">
          <small>{getWeatherLine(destination) || "weather signal pending"}</small>
        </div>
      </div>
    </article>
  );
}
