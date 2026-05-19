import { useEffect, useMemo, useState } from "react";
import DestinationGrid from "./DestinationGrid";
import FilterPanel from "./FilterPanel";
import FooterTicker from "./FooterTicker";
import Header from "./Header";
import Hero from "./Hero";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import { fetchRecommendedDestinations, getFallbackDestinations } from "./api";

export default function MessyMyspaceApp() {
  const [destinations, setDestinations] = useState(getFallbackDestinations());
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDestinations() {
      try {
        const nextDestinations = await fetchRecommendedDestinations();

        if (isMounted) {
          setDestinations(nextDestinations);
          setApiMessage("live destination data from Flask");
        }
      } catch (error) {
        if (isMounted) {
          setDestinations(getFallbackDestinations());
          setApiMessage("Flask offline - showing real-life fallback destinations");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDestinations();

    return () => {
      isMounted = false;
    };
  }, []);

  const topDestinations = useMemo(() => destinations.slice(0, 3), [destinations]);

  return (
    <>
      <div className="page-noise" aria-hidden="true"></div>
      <Header />
      <main className="myspace-shell">
        <LeftSidebar />

        <section className="main-column" aria-label="Dreamroute recommender">
          <Hero />
          <FilterPanel />

          <section className="results-panel panel" aria-labelledby="home-results-title">
            <div className="section-title-row">
              <div>
                <p>\ DESTINATIONS FOR YOU</p>
                <h2 id="home-results-title">{loading ? "tuning antennas..." : apiMessage}</h2>
              </div>
              <a href="/results">view all results &gt;&gt;</a>
            </div>
            <DestinationGrid destinations={topDestinations} limit={3} />
          </section>
        </section>

        <RightSidebar />
      </main>
      <FooterTicker />
    </>
  );
}
