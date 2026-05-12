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

function getWeatherSummary(result) {
  const parts = [];

  if (result.weather_band) {
    parts.push(result.weather_band);
  }

  if (typeof result.avg_temp_c === "number") {
    parts.push(`${result.avg_temp_c.toFixed(1)}C`);
  }

  if (typeof result.rainfall_mm === "number") {
    parts.push(`${result.rainfall_mm.toFixed(0)}mm rain`);
  }

  return parts.join(" | ");
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
                  <span className="result-chip cost">{result.cost}</span>
                  <span className="result-chip weather">
                    {getWeatherSummary(result)}
                  </span>
                  <span className="result-chip activity">{result.activity_type}</span>
                  {result.vibes.map((vibe) => (
                    <span className="result-chip vibe" key={vibe}>
                      {vibe}
                    </span>
                  ))}
                </div>

                <p className="result-reason">{result.activity_name}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}
