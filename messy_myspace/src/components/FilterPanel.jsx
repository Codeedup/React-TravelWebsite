import { useEffect, useMemo, useState } from "react";
import {
  buildSearchParams,
  createEmptyFilters,
  fetchFilterOptions,
  filterConfig,
  normalizeFilterOptions,
} from "./api";
import { fallbackFilterOptions } from "./mockDestinations";
import { formatOptionLabel } from "./destinationUtils";

const emptyFilters = createEmptyFilters();

export default function FilterPanel({ initialFilters = {}, compact = false }) {
  const [options, setOptions] = useState(normalizeFilterOptions(fallbackFilterOptions));
  const [selectedFilters, setSelectedFilters] = useState({
    ...emptyFilters,
    ...initialFilters,
  });
  const [status, setStatus] = useState("dialing /api/filter-options...");

  useEffect(() => {
    setSelectedFilters({
      ...emptyFilters,
      ...initialFilters,
    });
  }, [initialFilters.activity, initialFilters.cost, initialFilters.vibe, initialFilters.weather]);

  useEffect(() => {
    let isMounted = true;

    async function loadOptions() {
      try {
        const nextOptions = await fetchFilterOptions();

        if (isMounted) {
          setOptions(nextOptions);
          setStatus("live Flask filters online");
        }
      } catch (error) {
        if (isMounted) {
          setOptions(normalizeFilterOptions(fallbackFilterOptions));
          setStatus("Flask offline - showing local filter ghosts");
        }
      }
    }

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeFilterCount = useMemo(
    () => Object.values(selectedFilters).filter(Boolean).length,
    [selectedFilters],
  );

  function updateFilter(key, value) {
    setSelectedFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  }

  function findDestination() {
    const params = buildSearchParams(selectedFilters);
    const queryString = params.toString();

    window.location.href = queryString ? `/results?${queryString}` : "/results";
  }

  return (
    <section
      className={compact ? "filter-panel panel compact" : "filter-panel panel"}
      id="filters"
      aria-labelledby="filter-title"
    >
      <div className="panel-title-row">
        <h2 id="filter-title">
          <span aria-hidden="true">\</span>
          TELL US WHAT YOU'RE INTO
        </h2>
        <span>{activeFilterCount} charms selected</span>
      </div>

      <div className="select-grid">
        {filterConfig.map((filter) => (
          <label className="filter-control" key={filter.key}>
            <span>{filter.label}</span>
            <select
              aria-label={filter.label}
              value={selectedFilters[filter.key] ?? ""}
              onChange={(event) => updateFilter(filter.key, event.target.value)}
            >
              <option value="">Any</option>
              {(options[filter.key] ?? []).map((option) => (
                <option value={option} key={option}>
                  {formatOptionLabel(option)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="filter-actions">
        <p>{status}</p>
        <button className="find-button" type="button" onClick={findDestination}>
          <span aria-hidden="true">+</span>
          FIND MY DESTINATION
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </section>
  );
}
