import DestinationCard from "./DestinationCard";

export default function DestinationGrid({ destinations, error, loading, onRetry }) {
  return (
    <section className="destinations-section" id="destinations" aria-labelledby="destinations-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Recommended for you</p>
          <h2 id="destinations-title">Database-backed destination matches</h2>
        </div>
        <span className="result-count">
          {loading ? "Searching..." : `${destinations.length} results`}
        </span>
      </div>

      {error && (
        <div className="state-card error-state" role="alert">
          <p>{error}</p>
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      {loading && (
        <div className="destination-grid" aria-label="Loading destination cards">
          {Array.from({ length: 6 }).map((_, index) => (
            <article className="destination-card skeleton-card" key={index}>
              <div className="destination-media"></div>
              <div className="destination-body">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && destinations.length === 0 && (
        <div className="state-card">
          <h3>No destinations matched those filters</h3>
          <p>Try a broader budget, weather, activity, or vibe.</p>
        </div>
      )}

      {!loading && !error && destinations.length > 0 && (
        <div className="destination-grid">
          {destinations.map((destination, index) => (
            <DestinationCard
              destination={destination}
              index={index}
              key={`${destination.destination}-${destination.country}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
