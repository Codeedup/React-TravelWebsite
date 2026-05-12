import { useState } from "react";

const activities = [
  { name: "Hiking", category: "Nature/Adventure" },
  { name: "Surfing", category: "Coastal/Sport" },
  { name: "Museum Hopping", category: "Culture/History" },
  { name: "Wine Tasting", category: "Culinary/Relaxing" },
  { name: "Scuba Diving", category: "Adventure/Ocean" },
  { name: "Skiing/Snowboarding", category: "Winter/Sport" },
  { name: "Street Food Tours", category: "Culinary/Local" },
  { name: "Stargazing", category: "Nature/Quiet" },
  { name: "Historical Walking Tours", category: "Educational/Urban" },
  { name: "Nightlife & Clubbing", category: "Social/High-Energy" },
];

export default function HeroFilters() {
  const [activitySearch, setActivitySearch] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");

  const normalizedSearch = activitySearch.trim().toLowerCase();
  const matchingActivities = activities.filter((activity) => {
    const searchableText = `${activity.name} ${activity.category}`.toLowerCase();
    return searchableText.includes(normalizedSearch);
  });

  function chooseActivity(activityName) {
    setSelectedActivity(activityName);
  }

  function findMatchingCities() {
    const resultsPath = selectedActivity
      ? `/results?activity=${encodeURIComponent(selectedActivity)}`
      : "/results";

    window.location.href = resultsPath;
  }

  return (
    <section className="filter-panel" aria-label="Activity search filter">
      <div className="filter-row activity-row">
        <div className="filter-heading">
          <span className="row-icon activity" aria-hidden="true">
            A
          </span>
          <span>Activities</span>
        </div>

        <div className="activity-controls">
          <label className="activity-search-wrap">
            <span className="sr-only">Search activities</span>
            <input
              className="activity-search"
              type="text"
              value={activitySearch}
              placeholder="Search activities..."
              onChange={(event) => setActivitySearch(event.target.value)}
            />
            <span className="search-mini-icon" aria-hidden="true"></span>
          </label>

          <div className="activity-chip-row" aria-label="Activity options">
            {matchingActivities.map((activity) => (
              <button
                className={
                  selectedActivity === activity.name
                    ? "activity-chip selected"
                    : "activity-chip"
                }
                key={activity.name}
                type="button"
                onClick={() => chooseActivity(activity.name)}
              >
                <span>{activity.name}</span>
                <span className="activity-category">{activity.category}</span>
              </button>
            ))}

            {matchingActivities.length === 0 && (
              <p className="empty-filter-text">No activity matches</p>
            )}
          </div>
        </div>
      </div>

      <button className="match-button" type="button" onClick={findMatchingCities}>
        <span className="button-search-icon" aria-hidden="true"></span>
        Find Matching Cities
      </button>
    </section>
  );
}
