import { useEffect, useMemo, useState } from "react";
import DestinationCard from "./DestinationCard";
import FilterBar from "./FilterBar";
import {
  API_BASE_URL,
  fallbackDestinations,
  filterConfig,
  formatOptionLabel,
} from "./data";

function getActiveFilters(searchParams) {
  return filterConfig.reduce((filters, filter) => {
    const value = searchParams.get(filter.key);

    if (value) {
      filters[filter.key] = value;
    }

    return filters;
  }, {});
}

export default function ResultsDashboard() {
  const [results, setResults] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams(window.location.search);
    const filters = getActiveFilters(params);
    const apiParams = new URLSearchParams(filters);

    setActiveFilters(filters);

    async function loadResults() {
      try {
        const queryString = apiParams.toString();
        const response = await fetch(
          queryString ? `${API_BASE_URL}/api/search?${queryString}` : `${API_BASE_URL}/api/search`,
        );

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
          setResults(fallbackDestinations);
          setError("Start the Flask API to see live ranked results.");
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

  const activeFilterSummary = useMemo(() => {
    const entries = Object.entries(activeFilters);

    if (entries.length === 0) {
      return "all destinations in the database";
    }

    return entries
      .map(([key, value]) => {
        const filter = filterConfig.find((item) => item.key === key);
        return `${filter?.label ?? key}: ${formatOptionLabel(value)}`;
      })
      .join(" // ");
  }, [activeFilters]);

  return (
    <main className="results-shell">
      <section className="results-hero hud-panel" aria-labelledby="results-title">
        <p className="kicker">// Ranked destination output</p>
        <h1 id="results-title">The best cities for you are:</h1>
        <p>Ranked by {activeFilterSummary}.</p>
      </section>

      <FilterBar compact syncFromUrl />

      {error && <p className="api-warning results-warning">{error}</p>}

      <section className="results-grid" aria-label="Ranked city matches">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <article className="result-loading hud-panel" key={index}>
                Loading destination signal...
              </article>
            ))
          : results.map((result, index) => (
              <DestinationCard
                destination={result}
                index={index}
                key={`${result.destination}-${result.country}`}
              />
            ))}
      </section>

      <a className="back-link" href="/">
        Back to discovery matrix
      </a>
    </main>
  );
}
