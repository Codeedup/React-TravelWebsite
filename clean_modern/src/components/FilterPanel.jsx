import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, getDestinations, getFilterOptions } from "../lib/api";
import CategoryChips, { CATEGORY_CHIPS } from "./CategoryChips";
import DestinationGrid from "./DestinationGrid";

const filterConfig = [
  {
    key: "cost",
    label: "Budget / cost",
    emptyLabel: "Any budget",
    marker: "$",
  },
  {
    key: "weather",
    label: "Weather",
    emptyLabel: "Any weather",
    marker: "WX",
  },
  {
    key: "activity",
    label: "Activities",
    emptyLabel: "Any activity",
    marker: "ACT",
  },
  {
    key: "vibe",
    label: "Vibe",
    emptyLabel: "Any vibe",
    marker: "VB",
  },
];

const emptyFilters = {
  cost: "",
  weather: "",
  activity: "",
  vibe: "",
};

const emptyOptions = {
  cost: [],
  weather: [],
  activity: [],
  vibe: [],
};

function formatOptionLabel(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function getChipLabelForActivity(activity) {
  const matchingChip = CATEGORY_CHIPS.find((chip) => chip.value === activity);
  return matchingChip?.label ?? "";
}

export default function FilterPanel() {
  const [filters, setFilters] = useState(emptyFilters);
  const [options, setOptions] = useState(emptyOptions);
  const [destinations, setDestinations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [nextOptions, nextDestinations] = await Promise.all([
          getFilterOptions(),
          getDestinations(),
        ]);

        if (isMounted) {
          setOptions(nextOptions);
          setDestinations(nextDestinations);
          setError("");
        }
      } catch (requestError) {
        if (isMounted) {
          setError(`Start the Flask API at ${API_BASE_URL} to load live trips.`);
          setDestinations([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setOptionsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function findTrips(nextFilters = filters) {
    setLoading(true);
    setError("");

    try {
      const nextDestinations = await getDestinations(nextFilters);
      setDestinations(nextDestinations);
    } catch (requestError) {
      setError(`Could not reach the travel API at ${API_BASE_URL}.`);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));

    if (key === "activity") {
      setSelectedCategory(value ? getChipLabelForActivity(value) : "All");
    }
  }

  function resetFilters() {
    setFilters(emptyFilters);
    setSelectedCategory("All");
    findTrips(emptyFilters);
  }

  function chooseCategory(chip) {
    const nextFilters = {
      ...filters,
      activity: chip.value,
    };

    setFilters(nextFilters);
    setSelectedCategory(chip.label);
    findTrips(nextFilters);
  }

  return (
    <section className="recommendation-panel" aria-label="Travel recommendation controls">
      <div className="filter-card">
        <div className="filter-card-header">
          <div>
            <p className="eyebrow">Plan your next escape</p>
            <h2>Find a destination that fits your style</h2>
          </div>
          <button className="clear-button" type="button" onClick={resetFilters}>
            Clear
          </button>
        </div>

        <div className="filter-grid">
          {filterConfig.map((filter) => (
            <label className="filter-control" key={filter.key}>
              <span className={`filter-marker ${filter.key}`} aria-hidden="true">
                {filter.marker}
              </span>
              <span className="filter-copy">
                <span>{filter.label}</span>
                <select
                  value={filters[filter.key]}
                  onChange={(event) => updateFilter(filter.key, event.target.value)}
                  disabled={optionsLoading}
                >
                  <option value="">{filter.emptyLabel}</option>
                  {options[filter.key].map((option) => (
                    <option value={option} key={option}>
                      {formatOptionLabel(option)}
                    </option>
                  ))}
                </select>
              </span>
            </label>
          ))}
        </div>

        <div className="filter-actions">
          <button className="primary-button" type="button" onClick={() => findTrips()}>
            Find my trip
          </button>
          <p>
            {optionsLoading
              ? "Loading live filters..."
              : `${activeFilterCount} active filters from your travel database`}
          </p>
        </div>
      </div>

      <CategoryChips selectedLabel={selectedCategory} onSelect={chooseCategory} />

      <DestinationGrid
        destinations={destinations}
        error={error}
        loading={loading}
        onRetry={() => findTrips()}
      />
    </section>
  );
}
