import { useEffect, useState } from "react";
import {
  formatOptionLabel,
  getDestinationImageCredit,
  getDestinationImageSrc,
  getMatchPercent,
  getWeatherLine,
  slugifyDestination,
} from "./destinationUtils";

//populates one destination card from the API info with a slugified name, a stored image, and the tags. 
export default function DestinationCard({ destination, index = 0 }) {
  const [imageFailed, setImageFailed] = useState(false);
  const slug = slugifyDestination(destination.destination);
  const imageSrc = getDestinationImageSrc(destination.destination);
  const imageCredit = getDestinationImageCredit(destination.destination);
  const imageAlt = imageCredit?.alt || `${destination.destination}, ${destination.country}`;
  const tags = [
    destination.cost,
    destination.weather_band,
    destination.activity_type,
    ...(destination.vibes || []).slice(0, 2),
  ].filter(Boolean);

  useEffect(() => {
    setImageFailed(false);
  }, [imageSrc]);

  return (
    <article className={`destination-card destination-${slug || "unknown"}`}>
      <div className="destination-media">
        {imageSrc && !imageFailed && (
          <img
            alt={imageAlt}
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
          {imageCredit && (
            <small className="image-credit">
              Photo:{" "}
              {imageCredit.photographer_url && imageCredit.photographer ? (
                <a href={imageCredit.photographer_url} rel="noreferrer" target="_blank">
                  {imageCredit.photographer}
                </a>
              ) : (
                imageCredit.photographer || imageCredit.provider
              )}
              {imageCredit.photo_url && (
                <>
                  {" "}
                  /{" "}
                  <a href={imageCredit.photo_url} rel="noreferrer" target="_blank">
                    {imageCredit.provider}
                  </a>
                </>
              )}
            </small>
          )}
        </div>
      </div>
    </article>
  );
}
