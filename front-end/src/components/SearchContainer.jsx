import { useState } from "react";
import HeroFilters from "./HeroFilters.jsx";
import CityCard from "./CityCard.jsx";

export default function SearchContainer() {
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  function handleResultsUpdate(resultsList) {
    setSearchResults(resultsList);
    setHasSearched(true);
  }

  let resultSection = null;

  if (hasSearched === true) {
    if (searchResults.length > 0) {
      resultSection = (
        <section className="city-grid" aria-label="Live ranked city matches">
          {searchResults.map((city, index) => {
            // Unique identifier key
            let distinctKey = city.destination + "-" + city.country;
            
            // --- NEW REFACTOR: Determine ranking label explicitly using if-else ---
            let rankLabelText = "";
            let badgeStyle = { ...styles.rankBadge };

            if (index === 0) {
              rankLabelText = "This is your Best Match:";
              badgeStyle.backgroundColor = "#fffbeb"; // Soft gold background
              badgeStyle.color = "#b45309";
              badgeStyle.borderColor = "#fef3c7";
            } else if (index === 1) {
              rankLabelText = "This is your Second Best Match:";
              badgeStyle.backgroundColor = "#f3f4f6"; // Soft silver/gray background
              badgeStyle.color = "#4b5563";
              badgeStyle.borderColor = "#e5e7eb";
            } else if (index === 2) {
              rankLabelText = "This is your Third Best Match:";
              badgeStyle.backgroundColor = "#fff7ed"; // Soft bronze/orange background
              badgeStyle.color = "#c2410c";
              badgeStyle.borderColor = "#ffedd5";
            } else {
              rankLabelText = "Match #" + (index + 1) + ":";
            }

            return (
              <div key={distinctKey} style={styles.cardWrapper}>
                {/* Visual Rank Heading Badge right on top of the card */}
                <div style={badgeStyle}>
                  {rankLabelText}
                </div>
                
                {/* The layout component card itself */}
                <CityCard city={city} />
              </div>
            );
          })}
        </section>
      );
    } else {
      resultSection = (
        <p style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
          No exact database records matched your combined search filters. Try selecting alternative categories!
        </p>
      );
    }
  }

  return (
    <>
      <HeroFilters onSearchComplete={handleResultsUpdate} />
      {resultSection}
    </>
  );
}

// Custom CSS design attributes explicitly added at the bottom
// Custom CSS design attributes explicitly added at the bottom
const styles = {
  cardWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "8px", // Clean spacing separation between text and card container box
  },
  rankBadge: {
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "700",
    letterSpacing: "0.2px",
    border: "1px solid",
    // --- UPDATED FOR CENTERING ---
    textAlign: "center",     // Centers the text inside the badge box
    alignSelf: "center",     // Centers the whole badge box horizontally over the card
  }
};