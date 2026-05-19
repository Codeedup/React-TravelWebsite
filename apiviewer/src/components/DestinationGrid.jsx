import DestinationCard from "./DestinationCard";

export default function DestinationGrid({
  destinations,
  emptyMessage = "No matching destinations came through the wire.",
  limit,
}) {
  const visibleDestinations = typeof limit === "number" ? destinations.slice(0, limit) : destinations;

  return (
    <div className="destination-grid">
      {visibleDestinations.length > 0 ? (
        visibleDestinations.map((destination, index) => (
          <DestinationCard
            destination={destination}
            index={index}
            key={`${destination.destination}-${destination.country}-${index}`}
          />
        ))
      ) : (
        <p className="empty-results">{emptyMessage}</p>
      )}
    </div>
  );
}
