import { useEffect, useMemo, useState } from "react";
import BottomTicker from "./BottomTicker";
import DestinationCard from "./DestinationCard";
import FilterBar from "./FilterBar";
import Header from "./Header";
import Hero from "./Hero";
import RightInsights from "./RightInsights";
import SidebarPanel from "./SidebarPanel";
import {
  API_BASE_URL,
  fallbackDestinations,
  liveFeed,
  travelInsights,
} from "./data";

function HeartbeatChart() {
  return (
    <svg className="heartbeat-chart" viewBox="0 0 210 54" aria-hidden="true">
      <defs>
        <linearGradient id="heartbeat-glow" x1="0" x2="1">
          <stop offset="0" stopColor="#89ffbd" stopOpacity="0.2" />
          <stop offset="0.55" stopColor="#89ffbd" />
          <stop offset="1" stopColor="#ff6f8f" />
        </linearGradient>
      </defs>
      <polyline points="0,37 12,34 20,35 28,31 36,34 44,10 52,40 60,32 68,33 76,26 84,34 96,32 104,33 112,20 120,38 128,31 136,32 144,28 152,33 160,30 168,14 176,39 184,31 192,34 202,30 210,33" />
    </svg>
  );
}

function GlobalMap() {
  return (
    <div className="global-map" aria-hidden="true">
      {Array.from({ length: 54 }).map((_, index) => (
        <span key={index}></span>
      ))}
    </div>
  );
}

function InsightScatter() {
  return (
    <div className="insight-scatter" aria-hidden="true">
      {Array.from({ length: 90 }).map((_, index) => (
        <span
          key={index}
          style={{
            "--x": `${(index * 37) % 100}%`,
            "--y": `${22 + ((index * 19) % 58)}%`,
            "--delay": `${(index % 9) * 90}ms`,
          }}
        ></span>
      ))}
    </div>
  );
}

function LeftDashboard() {
  return (
    <aside className="left-dashboard" aria-label="Travel data dashboard">
      <SidebarPanel title="System Status" meta="Online">
        <div className="status-grid">
          {["recSYS_v2.7", "climate_feed", "price_eng", "geo_scanner"].map(
            (module) => (
              <div key={module}>
                <span>{module}</span>
                <strong>OK</strong>
              </div>
            ),
          )}
        </div>
        <HeartbeatChart />
      </SidebarPanel>

      <SidebarPanel title="Global Overview" meta="scan">
        <GlobalMap />
      </SidebarPanel>

      <SidebarPanel
        title="Live Travel Feed"
        meta="now"
        action={<a href="/results">View All Destinations -&gt;</a>}
      >
        <div className="live-feed">
          {liveFeed.map((item) => (
            <div key={item.city}>
              <span>{item.city}</span>
              <strong>{item.temp}</strong>
              <em>{item.condition}</em>
              <small>{item.signal}</small>
            </div>
          ))}
        </div>
      </SidebarPanel>

      <SidebarPanel title="Travel Insights" meta="trend">
        <InsightScatter />
        <div className="insight-bars">
          {travelInsights.map((insight) => (
            <div key={insight.label}>
              <span>{insight.label}</span>
              <i aria-hidden="true">
                <b style={{ width: `${insight.value * 2}%` }}></b>
              </i>
              <strong>{insight.value}%</strong>
            </div>
          ))}
        </div>
        <p className="data-refresh">Data refresh: 2m ago</p>
      </SidebarPanel>
    </aside>
  );
}

export default function App() {
  const [destinations, setDestinations] = useState(fallbackDestinations);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDestinations() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/search`);

        if (!response.ok) {
          throw new Error("Destination request failed");
        }

        const nextDestinations = await response.json();

        if (isMounted) {
          setDestinations(nextDestinations);
          setError("");
        }
      } catch (requestError) {
        if (isMounted) {
          setDestinations(fallbackDestinations);
          setError("Showing fallback cards until Flask is running.");
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

  const visibleDestinations = useMemo(
    () => destinations.slice(0, 5),
    [destinations],
  );

  return (
    <>
      <Header currentPage="Discover" />
      <main className="dashboard-shell">
        <LeftDashboard />

        <section className="main-stage">
          <Hero />
          <FilterBar />

          <section className="recommendations hud-panel" aria-labelledby="recommendations-title">
            <div className="section-heading">
              <div>
                <p className="kicker">Recommended Destinations</p>
                <h2 id="recommendations-title">Based on your preferences</h2>
              </div>
              <div className="result-meta">
                <span>{loading ? "Syncing" : `${destinations.length} results`}</span>
                <span>Sort by recommended</span>
              </div>
            </div>

            {error && <p className="api-warning">{error}</p>}

            <div className="destination-grid">
              {visibleDestinations.map((destination, index) => (
                <DestinationCard
                  destination={destination}
                  index={index}
                  key={`${destination.destination}-${destination.country}`}
                />
              ))}
            </div>
          </section>
        </section>

        <RightInsights />
      </main>
      <BottomTicker />
    </>
  );
}
