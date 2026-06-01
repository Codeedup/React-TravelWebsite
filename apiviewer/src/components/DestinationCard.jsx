import { useEffect, useState } from "react";
import {
  formatOptionLabel,
  getMatchPercent,
  getWeatherLine,
  slugifyDestination,
} from "./destinationUtils";

export default function DestinationCard({ destination, index = 0 }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCredit, setImageCredit] = useState(null);
  const slug = slugifyDestination(destination.destination);
  const imageSrc = imageUrl;
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

useEffect(() => {
  if (!destination.destination) return;

  async function fetchImage() {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          destination.destination
        )}&per_page=1`,
        {
          headers: {
            Authorization: "aiyy5RvXHlOUfDw8oZ2Dj8rPqZFm2JnP9Wj23PVptMpl7883fPmLVdeV",
          },
        }
      );
      
      console.log("fetching image for:", destination.destination);
      console.log("status:", response.status);

      const data = await response.json();

      if (data.photos?.length) {
        const photo = data.photos[0];

        setImageUrl(photo.src.large);

        setImageCredit({
          photographer: photo.photographer,
          photographer_url: photo.photographer_url,
          photo_url: photo.url,
          provider: "Pexels",
        });
      }
    } catch (error) {
      console.error("Pexels image fetch failed:", error);
    }
  }

  fetchImage();
}, [destination.destination]);

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
