import { useEffect, useRef, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:5001";

const filterConfig = [
  { label: "Cost", key: "cost", icon: "$", accent: "green" },
  { label: "Weather", key: "weather", icon: "W", accent: "orange" },
  { label: "Activities", key: "activity", icon: "A", accent: "blue" },
  { label: "Vibe", key: "vibe", icon: "V", accent: "purple" },
];

const emptyOptions = filterConfig.reduce((options, filter) => {
  options[filter.key] = ["Any"];
  return options;
}, {});

const emptySelections = filterConfig.reduce((selections, filter) => {
  selections[filter.key] = "Any";
  return selections;
}, {});

function getSimilarityScore(option, searchTerm) {
  const optionText = option.toLowerCase();
  const query = searchTerm.trim().toLowerCase();
  if (!query) return 1;
  if (optionText === query) return 100;
  if (optionText.startsWith(query)) return 80;
  if (optionText.includes(query)) return 60;

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
    .map((option) => ({ option, score: getSimilarityScore(option, searchTerm) }))
    .filter(({ score }) => score > 0.35)
    .sort((first, second) => second.score - first.score)
    .map(({ option }) => option);
}

function normalizeOptions(nextOptions) {
  return filterConfig.reduce((normalized, filter) => {
    normalized[filter.key] = ["Any", ...(nextOptions[filter.key] ?? [])];
    return normalized;
  }, {});
}

// --- UPDATE: Accepts onSearchComplete prop to communicate directly with index.astro page context ---
export default function HeroFilters({ onSearchComplete }) {
  const filterPanelRef = useRef(null);
  const [options, setOptions] = useState(emptyOptions);
  const [selectedValues, setSelectedValues] = useState(emptySelections);
  const [openFilter, setOpenFilter] = useState(null);
  const [searchTerms, setSearchTerms] = useState({});
  const [status, setStatus] = useState("Loading filters...");

  useEffect(() => {
    let isMounted = true;
    async function loadOptions() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/filter-options`);
        if (!response.ok) throw new Error("Filter options request failed");
        const nextOptions = await response.json();
        if (isMounted) {
          setOptions(normalizeOptions(nextOptions));
          setStatus("");
        }
      } catch (error) {
        if (isMounted) setStatus("Start the Flask API to load live filter options.");
      }
    }
    loadOptions();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    function closeDropdownOnOutsideClick(event) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("pointerdown", closeDropdownOnOutsideClick);
    return () => { document.removeEventListener("pointerdown", closeDropdownOnOutsideClick); };
  }, []);

  function toggleFilter(key) {
    setOpenFilter((currentFilter) => (currentFilter === key ? null : key));
  }

  function chooseOption(key, option) {
    setSelectedValues((currentValues) => ({ ...currentValues, [key]: option }));
    setOpenFilter(null);
  }

  function updateSearchTerm(key, value) {
    setSearchTerms((currentTerms) => ({ ...currentTerms, [key]: value }));
  }

  // --- UPDATE: Modified to perform an in-place fetch instead of updating window.location ---
  async function findMatchingCities() {
    setStatus("Searching database profiles...");
    const params = new URLSearchParams();

    filterConfig.forEach((filter) => {
      const selectedValue = selectedValues[filter.key];
      if (selectedValue && selectedValue !== "Any") {
        params.set(filter.key, selectedValue);
      }
    });

    try {
      const queryString = params.toString();
      const searchUrl = queryString ? `${API_BASE_URL}/api/search?${queryString}` : `${API_BASE_URL}/api/search`;
      
      const response = await fetch(searchUrl);
      if (response.ok === false) {
        throw new Error("Search execution query failed.");
      }
      
      const allResults = await response.json();
      
      // Strict First Year CS rule implementation: take a slice of at most 3 entries manually
      let slicedResults = [];
      for (let i = 0; i < allResults.length; i++) {
        if (i < 3) {
          slicedResults.push(allResults[i]);
        }
      }
      
      setStatus("");
      
      // Fire callback with the 3 results
      if (onSearchComplete !== undefined) {
        onSearchComplete(slicedResults);
      }
    } catch (err) {
      setStatus("Error fetching search results. Please verify your Python Flask kernel state.");
    }
  }

  return (
    <section className="hero-filter-panel" ref={filterPanelRef}>
      <div className="filter-grid" aria-label="City search filters">
        {filterConfig.map((filter) => {
          const isOpen = openFilter === filter.key;
          const searchTerm = searchTerms[filter.key] || "";
          const visibleOptions = getFilteredOptions(options[filter.key], searchTerm);

          return (
            <div className="filter-wrap" key={filter.key}>
              <button
                className={`filter-card ${isOpen ? "open" : ""}`}
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                onClick={() => toggleFilter(filter.key)}
              >
                <span className={`filter-icon ${filter.accent}`} aria-hidden="true">
                  {filter.icon}
                </span>
                <span className="filter-copy">
                  <span className="filter-label">{filter.label}</span>
                  <span className="filter-value">{selectedValues[filter.key]}</span>
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
                      onChange={(event) => updateSearchTerm(filter.key, event.target.value)}
                      autoFocus
                    />
                  </label>

                  <div className="filter-option-list" role="listbox">
                    {visibleOptions.length > 0 ? (
                      visibleOptions.map((option) => (
                        <button
                          className={selectedValues[filter.key] === option ? "filter-option selected" : "filter-option"}
                          key={option}
                          role="option"
                          aria-selected={selectedValues[filter.key] === option}
                          type="button"
                          onClick={() => chooseOption(filter.key, option)}
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

      {status && <p className="filter-status">{status}</p>}

      <button className="match-button" type="button" onClick={findMatchingCities}>
        <span className="button-search-icon" aria-hidden="true"></span>
        Find Matching Cities
      </button>
    </section>
  );
}