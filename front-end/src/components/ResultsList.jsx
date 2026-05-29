import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:5001";

const filterLabels = {
  cost: "Cost",
  weather: "Weather",
  activity: "Activities",
  vibe: "Vibe",
};

function getActiveFilters(searchParams) {
  return Object.keys(filterLabels).reduce((filters, key) => {
    const value = searchParams.get(key);

    if (value) {
      filters[key] = value;
    }

    return filters;
  }, {});
}

// --- UPDATE: Restructured to show the smart "Best Month" recommendation ---
function getWeatherSummary(result) {
  if (result.best_month && result.best_month !== "Unknown") {
    return `Best time: ${result.best_month} (${result.best_month_temp}°C)`;
  }
  return "Weather data unavailable";
}

export default function ResultsList() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  const activeFilterSummary = useMemo(() => {
    const entries = Object.entries(activeFilters);

    if (entries.length === 0) {
      return "all destinations in the database";
    }

    return entries
      .map(([key, value]) => `${filterLabels[key]}: ${value}`)
      .join(", ");
  }, [activeFilters]);

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams(window.location.search);
    const filters = getActiveFilters(params);
    const apiParams = new URLSearchParams(filters);

    setActiveFilters(filters);

    async function loadResults() {
      try {
        const queryString = apiParams.toString();
        const url = queryString
          ? `${API_BASE_URL}/api/search?${queryString}`
          : `${API_BASE_URL}/api/search`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const nextResults = await response.json();

        if (isMounted) {
          setResults(nextResults);
          setError("");
        }
      } catch (requestError) {
        if (isMounted) {
          setError("Start the Flask API to see live ranked results.");
          setResults([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadResults();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="results-hero" aria-labelledby="results-title">
        <p className="results-kicker">Database results</p>
        <h1 id="results-title">The best cities for you are:</h1>
        <p>Ranked by {activeFilterSummary}.</p>
      </section>

      {loading && <p className="results-message">Loading city matches...</p>}
      {error && <p className="results-message error">{error}</p>}

      {!loading && !error && (
        <section className="results-list" aria-label="Ranked city matches">
          {results.map((result, index) => (
            <article
              className="result-card"
              key={`${result.destination}-${result.country}`}
            >
              <div className="result-rank" aria-label={`Rank ${index + 1}`}>
                {index + 1}
              </div>
              <div className="result-copy">
                <p className="result-label">
                  {result.selected_filter_count > 0
                    ? `${result.match_count} of ${result.selected_filter_count} filters matched`
                    : "Browsing all destinations"}
                </p>
                <h2>{result.destination}</h2>
                <p className="result-country">{result.country}</p>

                <div className="result-chip-row" aria-label="Destination details">
                  {/* Safely check if cost exists before rendering */}
                  {result.cost && <span className="result-chip cost">{result.cost}</span>}
                  
                  <span className="result-chip weather">
                    {getWeatherSummary(result)}
                  </span>
                  
                  {/* Safely render activities and vibes arrays */}
                  {result.activities && result.activities.map((activity) => (
                    <span className="result-chip activity" key={activity}>{activity}</span>
                  ))}
                  {result.vibes && result.vibes.map((vibe) => (
                    <span className="result-chip vibe" key={vibe}>
                      {vibe}
                    </span>
                  ))}
                </div>

                {/* --- UPDATE: Added a Seasonal Weather Breakdown --- */}
                {result.seasons && (
                  <div className="result-seasons" style={{ display: "flex", gap: "15px", marginTop: "15px", fontSize: "0.85rem", color: "#666" }}>
                    <span>Avg Winter: {result.seasons.Winter}°C</span>
                    <span>Avg Spring: {result.seasons.Spring}°C</span>
                    <span>Avg Summer: {result.seasons.Summer}°C</span>
                    <span>Avg Autumn: {result.seasons.Autumn}°C</span>
                  </div>
                )}

              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}