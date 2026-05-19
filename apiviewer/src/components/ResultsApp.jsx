import { useEffect, useMemo, useState } from "react";
import DestinationGrid from "./DestinationGrid";
import FilterPanel from "./FilterPanel";
import FooterTicker from "./FooterTicker";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import {
  fetchRecommendedDestinations,
  getFallbackDestinations,
  getFiltersFromSearch,
} from "./api";
import { formatOptionLabel } from "./destinationUtils";

export default function ResultsApp() {
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState(getFallbackDestinations());
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    const nextFilters = getFiltersFromSearch(window.location.search);

    setFilters(nextFilters);

    async function loadResults() {
      try {
        const nextResults = await fetchRecommendedDestinations(nextFilters);

        if (isMounted) {
          setResults(nextResults);
          setApiMessage("ranked by live Flask API");
        }
      } catch (error) {
        if (isMounted) {
          setResults(getFallbackDestinations());
          setApiMessage("Flask offline - fallback ranking loaded");
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
    const entries = Object.entries(filters).filter(([, value]) => value);

    if (entries.length === 0) {
      return "all real-life destinations";
    }

    return entries
      .map(([key, value]) => `${formatOptionLabel(key)}: ${formatOptionLabel(value)}`)
      .join(" :: ");
  }, [filters]);

  return (
    <>
      <div className="page-noise" aria-hidden="true"></div>
      <Header />
      <main className="myspace-shell results-shell">
        <LeftSidebar />

        <section className="main-column" aria-label="Ranked Dreamroute results">
          <section className="results-hero panel" aria-labelledby="results-title">
            <p>\ RANKED DESTINATION OUTPUT</p>
            <h1 id="results-title">THE BEST CITIES FOR YOU ARE:</h1>
            <span>{activeFilterSummary}</span>
          </section>

          <FilterPanel compact initialFilters={filters} />

          <section className="results-panel panel" aria-labelledby="results-grid-title">
            <div className="section-title-row">
              <div>
                <p>\ LIVE DREAMROUTE RESULTS</p>
                <h2 id="results-grid-title">{loading ? "receiving signal..." : apiMessage}</h2>
              </div>
              <a href="/">back home &gt;&gt;</a>
            </div>
            <DestinationGrid destinations={results} limit={3} />
          </section>
        </section>

        <RightSidebar />
      </main>
      <FooterTicker />
    </>
  );
}
