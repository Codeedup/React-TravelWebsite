import { useEffect, useMemo, useState } from "react";
import DestinationGrid from "./DestinationGrid";
import FilterPanel from "./FilterPanel";
import FooterTicker from "./FooterTicker";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import {
  fetchRecommendedDestinations,
  filterConfig,
  getFiltersFromSearch,
} from "./api";
import { formatOptionLabel } from "./destinationUtils";

export default function ResultsApp() {
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState("");
  const [apiUnavailable, setApiUnavailable] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const nextFilters = getFiltersFromSearch(window.location.search); //converts URL query string into an object

    setFilters(nextFilters);

    async function loadResults() {
      try {
        const nextResults = await fetchRecommendedDestinations(nextFilters);//fetch ranked recommendations from Flask

        if (isMounted) {
          setResults(nextResults);
          setApiMessage("ranked by live Flask API");
          setApiUnavailable(false);
        }
      } catch (error) {
        if (isMounted) {
          setResults([]);
          setApiMessage("Flask API offline");
          setApiUnavailable(true);
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

  const activeFilterEntries = useMemo(() => {
    return filterConfig
      .map((filter) => [filter.label, filters[filter.key]])
      .filter(([, value]) => value);
  }, [filters]);

  const emptyResultsMessage = apiUnavailable // explains api failure or no matches (doesn't happen at our scale)
    ? "Connect API to get results"
    : "No matching destinations came through the wire.";

  return (
    <>
      <div className="page-noise" aria-hidden="true"></div>
      <Header currentPath="/results" />
      <main className="myspace-shell results-shell">
        <LeftSidebar />

        <section className="main-column" aria-label="Ranked Dreamroute results">
          <section className="results-hero panel" aria-labelledby="results-title">
            <div className="results-kicker-row">
              <p>\ PERSONALIZED ROUTE GENERATED</p>
              <span>TOP 3 MATCHES</span>
            </div>
            <h1 id="results-title">YOUR DREAMROUTE RECOMMENDATIONS</h1>
            <div className="filter-chip-row" aria-label="Selected recommendation filters">
              {activeFilterEntries.length > 0 ? (
                activeFilterEntries.map(([label, value]) => (
                  <span className="filter-chip" key={`${label}-${value}`}>
                    <strong>{formatOptionLabel(label)}</strong>
                    {formatOptionLabel(value)}
                  </span>
                ))
              ) : (
                <span className="filter-chip">
                  <strong>Mode</strong>
                  All destination signals
                </span>
              )}
            </div>
          </section>

          <section className="results-panel panel" aria-labelledby="results-grid-title">
            <div className="section-title-row results-title-row">
              <div>
                <p>\ RECOMMENDATIONS READY</p>
                <h2 id="results-grid-title">{loading ? "ranking your matches..." : apiMessage}</h2>
              </div>
              <a href="/">start over &gt;&gt;</a>
            </div>
            {loading ? (
              <p className="empty-results">ranking your matches...</p>
            ) : (
              <DestinationGrid destinations={results} emptyMessage={emptyResultsMessage} limit={3} />
            )}
          </section>

          <FilterPanel
            compact
            buttonLabel="UPDATE RECOMMENDATIONS"
            initialFilters={filters}
            title="REFINE YOUR SEARCH"
          />
        </section>

        <RightSidebar />
      </main>
      <FooterTicker />
    </>
  );
}
