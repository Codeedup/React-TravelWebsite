import { useState } from "react";

const filters = [
  {
    label: "Cost",
    icon: "$",
    accent: "green",
    options: ["Any", "Low", "Moderate", "High"],
  },
  {
    label: "Vibe",
    icon: ":)",
    accent: "pink",
    options: ["Any", "Relaxed", "Historic", "Energetic", "Cultural"],
  },
  {
    label: "Language",
    icon: "A",
    accent: "purple",
    options: ["Any", "English", "Portuguese", "Japanese", "Czech"],
  },
  {
    label: "Weather",
    icon: "o",
    accent: "orange",
    options: ["Any", "Mild", "Sunny", "Four Seasons", "Cloudy"],
  },
  {
    label: "Region",
    icon: "#",
    accent: "blue",
    options: ["Any", "Europe", "Asia", "Americas"],
  },
  {
    label: "Currency",
    icon: "$",
    accent: "coral",
    options: ["Any", "EUR", "JPY", "CZK", "GBP"],
  },
];

export default function HeroFilters() {
  // Store the visible choice for each filter card.
  const [selectedValues, setSelectedValues] = useState(
    filters.reduce((values, filter) => {
      values[filter.label] = "Any";
      return values;
    }, {})
  );

  // Track the one dropdown menu that is currently open.
  const [openFilter, setOpenFilter] = useState(null);

  function toggleFilter(label) {
    setOpenFilter((currentFilter) => (currentFilter === label ? null : label));
  }

  function chooseOption(label, option) {
    // Update the card text, then close the menu. No real filtering is needed yet.
    setSelectedValues((currentValues) => ({
      ...currentValues,
      [label]: option,
    }));
    setOpenFilter(null);
  }

  return (
    <div className="hero-filter-panel">
      <div className="filter-grid" aria-label="City search filters">
        {filters.map((filter) => {
          const isOpen = openFilter === filter.label;

          return (
            <div className="filter-wrap" key={filter.label}>
              <button
                className={`filter-card ${isOpen ? "open" : ""}`}
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                onClick={() => toggleFilter(filter.label)}
              >
                <span className={`filter-icon ${filter.accent}`} aria-hidden="true">
                  {filter.icon}
                </span>
                <span className="filter-copy">
                  <span className="filter-label">{filter.label}</span>
                  <span className="filter-value">{selectedValues[filter.label]}</span>
                </span>
                <span className="filter-arrow" aria-hidden="true"></span>
              </button>

              {isOpen && (
                <div className="filter-menu" role="listbox">
                  {filter.options.map((option) => (
                    <button
                      className={
                        selectedValues[filter.label] === option
                          ? "filter-option selected"
                          : "filter-option"
                      }
                      key={option}
                      role="option"
                      aria-selected={selectedValues[filter.label] === option}
                      type="button"
                      onClick={() => chooseOption(filter.label, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hero-actions">
        <button className="primary-action" type="button">
          <span className="search-icon" aria-hidden="true"></span>
          Compare Cities
        </button>
        <a className="secondary-action" href="/">
          Browse all cities
          <span className="secondary-arrow" aria-hidden="true"></span>
        </a>
      </div>
    </div>
  );
}
