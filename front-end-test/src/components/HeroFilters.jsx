import { useEffect, useRef, useState } from "react";

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

function getSimilarityScore(option, searchTerm) {
  const optionText = option.toLowerCase();
  const query = searchTerm.trim().toLowerCase();

  if (!query) {
    return 1;
  }

  if (optionText === query) {
    return 100;
  }

  if (optionText.startsWith(query)) {
    return 80;
  }

  if (optionText.includes(query)) {
    return 60;
  }

  // Simple fuzzy fallback: count query letters that appear in order.
  let optionIndex = 0;
  let matches = 0;

  for (const letter of query) {
    const nextMatch = optionText.indexOf(letter, optionIndex);

    if (nextMatch !== -1) {
      matches += 1;
      optionIndex = nextMatch + 1;
    }
  }

  return matches / query.length;
}

function getFilteredOptions(options, searchTerm) {
  return options
    .map((option) => ({
      option,
      score: getSimilarityScore(option, searchTerm),
    }))
    .filter(({ score }) => score > 0.35)
    .sort((first, second) => second.score - first.score)
    .map(({ option }) => option);
}

export default function HeroFilters() {
  const filterPanelRef = useRef(null);

  // Store the visible choice for each filter card.
  const [selectedValues, setSelectedValues] = useState(
    filters.reduce((values, filter) => {
      values[filter.label] = "Any";
      return values;
    }, {})
  );

  // Track the one dropdown menu that is currently open.
  const [openFilter, setOpenFilter] = useState(null);
  const [searchTerms, setSearchTerms] = useState({});

  useEffect(() => {
    function closeDropdownOnOutsideClick(event) {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(event.target)
      ) {
        setOpenFilter(null);
      }
    }

    document.addEventListener("pointerdown", closeDropdownOnOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", closeDropdownOnOutsideClick);
    };
  }, []);

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

  function updateSearchTerm(label, value) {
    setSearchTerms((currentTerms) => ({
      ...currentTerms,
      [label]: value,
    }));
  }

  return (
    <div className="hero-filter-panel" ref={filterPanelRef}>
      <div className="filter-grid" aria-label="City search filters">
        {filters.map((filter) => {
          const isOpen = openFilter === filter.label;
          const searchTerm = searchTerms[filter.label] || "";
          const visibleOptions = getFilteredOptions(filter.options, searchTerm);

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
                <div className="filter-menu">
                  <label className="filter-search-label">
                    <span className="sr-only">Search {filter.label} options</span>
                    <input
                      className="filter-search"
                      type="text"
                      value={searchTerm}
                      placeholder={`Type ${filter.label.toLowerCase()}...`}
                      onChange={(event) =>
                        updateSearchTerm(filter.label, event.target.value)
                      }
                      autoFocus
                    />
                  </label>

                  <div className="filter-option-list" role="listbox">
                    {visibleOptions.length > 0 ? (
                      visibleOptions.map((option) => (
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
                      ))
                    ) : (
                      <p className="empty-options">No close matches</p>
                    )}
                  </div>
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
