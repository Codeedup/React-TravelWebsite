import { useEffect, useRef, useState } from "react";

const filterRows = [
  {
    label: "Cost",
    icon: "$",
    accent: "cost",
    options: ["Any", "Low", "Moderate", "High"],
    defaultValue: "Any",
  },
  {
    label: "Vibe",
    icon: ":)",
    accent: "vibe",
    options: ["Any", "Historic", "Modern", "Relaxed", "Energetic"],
    defaultValue: "Modern",
  },
  {
    label: "Weather",
    icon: "o",
    accent: "weather",
    options: ["Any", "Warm", "Mild", "Sunny", "Four Seasons"],
    defaultValue: "Mild",
  },
  {
    label: "Region",
    icon: "#",
    accent: "region",
    options: ["Any", "Europe", "Asia", "Americas", "Africa"],
    defaultValue: "Europe",
  },
  {
    label: "Currency",
    icon: "$",
    accent: "currency",
    options: ["Any", "EUR", "JPY", "CZK", "GBP"],
    defaultValue: "Any",
  },
];

const languageOptions = ["Any", "English", "Spanish", "French", "Portuguese", "Japanese"];
const moreLanguageOptions = ["Czech", "German", "Italian"];

export default function HeroFilters() {
  const moreMenuRef = useRef(null);
  const [selectedValues, setSelectedValues] = useState(() => {
    const initialValues = {};

    filterRows.forEach((row) => {
      initialValues[row.label] = row.defaultValue;
    });

    initialValues.Language = "English";
    return initialValues;
  });
  const [languageSearch, setLanguageSearch] = useState("");
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    function closeMoreMenu(event) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeMoreMenu);

    return () => {
      document.removeEventListener("pointerdown", closeMoreMenu);
    };
  }, []);

  function chooseValue(label, value) {
    setSelectedValues((currentValues) => ({
      ...currentValues,
      [label]: value,
    }));
    setIsMoreOpen(false);
  }

  const matchingLanguages = moreLanguageOptions.filter((language) =>
    language.toLowerCase().includes(languageSearch.trim().toLowerCase())
  );

  return (
    <section className="filter-panel" aria-label="City search filters">
      {filterRows.map((row) => (
        <div className="filter-row" key={row.label}>
          <div className="filter-heading">
            <span className={`row-icon ${row.accent}`} aria-hidden="true">
              {row.icon}
            </span>
            <span>{row.label}</span>
          </div>

          <div className="segmented-options">
            {row.options.map((option) => (
              <button
                className={
                  selectedValues[row.label] === option
                    ? "segment-button selected"
                    : "segment-button"
                }
                key={option}
                type="button"
                onClick={() => chooseValue(row.label, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="filter-row language-row">
        <div className="filter-heading">
          <span className="row-icon language" aria-hidden="true">
            A
          </span>
          <span>Language</span>
        </div>

        <div className="language-controls">
          <label className="language-search-wrap">
            <span className="sr-only">Search language</span>
            <input
              className="language-search"
              type="text"
              value={languageSearch}
              placeholder="Search language or choose Any..."
              onChange={(event) => setLanguageSearch(event.target.value)}
            />
            <span className="search-mini-icon" aria-hidden="true"></span>
          </label>

          <span className="popular-label">Popular</span>

          <div className="language-chip-row">
            {languageOptions.map((option) => (
              <button
                className={
                  selectedValues.Language === option
                    ? "language-chip selected"
                    : "language-chip"
                }
                key={option}
                type="button"
                onClick={() => chooseValue("Language", option)}
              >
                {option}
              </button>
            ))}

            <div className="more-menu-wrap" ref={moreMenuRef}>
              <button
                className="language-chip more-chip"
                type="button"
                aria-expanded={isMoreOpen}
                onClick={() => setIsMoreOpen((currentValue) => !currentValue)}
              >
                More
                <span className="more-arrow" aria-hidden="true"></span>
              </button>

              {isMoreOpen && (
                <div className="more-menu">
                  {(languageSearch ? matchingLanguages : moreLanguageOptions).map(
                    (language) => (
                      <button
                        className="more-option"
                        key={language}
                        type="button"
                        onClick={() => chooseValue("Language", language)}
                      >
                        {language}
                      </button>
                    )
                  )}
                  {languageSearch && matchingLanguages.length === 0 && (
                    <p className="empty-menu-text">No language matches</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button className="match-button" type="button">
        <span className="button-search-icon" aria-hidden="true"></span>
        Find Matching Cities
      </button>
    </section>
  );
}
