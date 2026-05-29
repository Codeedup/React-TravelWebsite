import React, { useState } from "react";

const chipIcons = {
  Cost: "£",
  Vibe: ":)",
  Language: "L",
  Weather: "W",
  Activity: "A"
};

const chipColors = {
  cost: { backgroundColor: "#e0f2fe", color: "#0369a1" },
  weather: { backgroundColor: "#ffedd5", color: "#c2410c" },
  vibe: { backgroundColor: "#faf5ff", color: "#7e22ce" },
  language: { backgroundColor: "#f0fdf4", color: "#166534" },
  activity: { backgroundColor: "#fee2e2", color: "#991b1b" }
};

export default function CityCard({ city }) {
  let nameText = city.name;
  let countryText = city.country;
  let displayChips = [];
  let seasonalRow = null;

  const [imageFailed, setImageFailed] = useState(false);

  if (city.destination !== undefined) {
    nameText = city.destination;
    countryText = city.country;

    if (city.cost) {
      displayChips.push({ label: "Cost", value: city.cost });
    }
    if (city.best_month && city.best_month !== "Unknown") {
      displayChips.push({ label: "Weather", value: `Best: ${city.best_month} (${city.best_month_temp}°C)` });
    }
    if (city.activities && city.activities.length > 0) {
      displayChips.push({ label: "Activity", value: city.activities[0] });
    }
    if (city.vibes && city.vibes.length > 0) {
      displayChips.push({ label: "Vibe", value: city.vibes[0] });
    }

    if (city.seasons) {
      seasonalRow = (
        <div style={styles.seasonsGrid}>
          <span>W:{city.seasons.Winter}°C</span>
          <span>S:{city.seasons.Spring}°C</span>
          <span>S:{city.seasons.Summer}°C</span>
          <span>A:{city.seasons.Autumn}°C</span>
        </div>
      );
    }
  } else {
    if (city.stats !== undefined) {
      displayChips = city.stats;
    }
  }

  let imageContainer = null;

  if (imageFailed === true) {
    imageContainer = (
      <div style={styles.fallbackImageContainer}>
        <span style={styles.fallbackText}>No pic atm</span>
      </div>
    );
  } else {
    // --- STABLE SEED REFACTOR ---
    // Cleans the text and injects it into Picsum's stable /seed/ path
    const cleanSeedName = encodeURIComponent(nameText.toLowerCase().trim());
    const imageUrl = "https://picsum.photos/seed/" + cleanSeedName + "/400/250";

    imageContainer = (
      <div style={styles.imageWrapper}>
        <img 
          src={imageUrl} 
          alt={nameText + " landscape preview"} 
          style={styles.apiImage}
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <article className="city-card">
      {imageContainer}

      <div className="city-content">
        <h2>{nameText}</h2>
        <p>{countryText}</p>

        <div className="stat-chip-grid" aria-label={nameText + " details"}>
          {displayChips.map((stat) => {
            let labelKey = stat.label;
            let lowerKey = labelKey.toLowerCase();
            
            let iconText = chipIcons[labelKey];
            if (iconText === undefined) {
              iconText = "•";
            }

            let dynamicChipStyle = {};
            if (chipColors[lowerKey] !== undefined) {
              dynamicChipStyle = chipColors[lowerKey];
            } else {
              dynamicChipStyle = { backgroundColor: "#eaeaea", color: "#333" };
            }

            return (
              <span 
                className={"stat-chip " + lowerKey} 
                key={labelKey}
                style={dynamicChipStyle}
              >
                <span className="chip-icon" aria-hidden="true">
                  {iconText}
                </span>
                {labelKey}: {stat.value}
              </span>
            );
          })}
        </div>

        {seasonalRow}
      </div>
    </article>
  );
}

const styles = {
  imageWrapper: {
    width: "100%",
    height: "180px",
    overflow: "hidden",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px"
  },
  apiImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  fallbackImageContainer: {
    width: "100%",
    height: "180px",
    backgroundColor: "#e2e8f0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px"
  },
  fallbackText: {
    color: "#64748b",
    fontSize: "0.9rem",
    fontWeight: "600",
    fontStyle: "italic"
  },
  seasonsGrid: {
    display: "flex",
    justifyContent: "space-between",
    gap: "5px",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px dashed #eaeaea",
    fontSize: "0.78rem",
    color: "#666"
  }
};