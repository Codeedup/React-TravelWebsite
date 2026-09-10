import DestinationCard from "./DestinationCard";

export default function DestinationGrid({
  destinations,
  emptyMessage = "No matching destinations came through the wire.",
  limit,
}) {
  const visibleDestinations = typeof limit === "number" ? destinations.slice(0, limit) : destinations; //limit to only show top 3 matches

  return (
    <div className="destination-grid">
      {visibleDestinations.length > 0 ? (
        //render one card per destination
        visibleDestinations.map((destination, index) => (
          <DestinationCard
            destination={destination}
            key={`${destination.destination}-${destination.country}-${index}`}
          />
        ))
      ) : (
        <p className="empty-results">{emptyMessage}</p>
      )}
    </div>
  );
}
