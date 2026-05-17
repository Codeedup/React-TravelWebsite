import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, filterConfig, formatOptionLabel } from "./data";

const emptySelections = filterConfig.reduce((values, filter) => {
  values[filter.key] = "";
  return values;
}, {});

const emptyOptions = filterConfig.reduce((values, filter) => {
  values[filter.key] = [];
  return values;
}, {});

export default function FilterBar({ compact = false, syncFromUrl = false }) {
  const [options, setOptions] = useState(emptyOptions);
  const [selectedValues, setSelectedValues] = useState(emptySelections);
  const [status, setStatus] = useState("Loading filter matrix...");

  const filterCount = useMemo(
    () => Object.values(selectedValues).filter(Boolean).length,
    [selectedValues],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadOptions() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/filter-options`);

        if (!response.ok) {
          throw new Error("Filter options request failed");
        }

        const nextOptions = await response.json();

        if (isMounted) {
          setOptions({
            cost: nextOptions.cost ?? [],
            weather: nextOptions.weather ?? [],
            activity: nextOptions.activity ?? [],
            vibe: nextOptions.vibe ?? [],
          });
          setStatus("");
        }
      } catch (error) {
        if (isMounted) {
          setStatus("Start the Flask API to load live filters.");
        }
      }
    }

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!syncFromUrl) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const nextValues = { ...emptySelections };

    filterConfig.forEach((filter) => {
      nextValues[filter.key] = params.get(filter.key) ?? "";
    });

    setSelectedValues(nextValues);
  }, [syncFromUrl]);

  function updateSelection(key, value) {
    setSelectedValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  }

  function updateResults() {
    const params = new URLSearchParams();

    filterConfig.forEach((filter) => {
      const selectedValue = selectedValues[filter.key];

      if (selectedValue) {
        params.set(filter.key, selectedValue);
      }
    });

    const queryString = params.toString();
    window.location.href = queryString ? `/results?${queryString}` : "/results";
  }

  return (
    <section
      className={compact ? "filter-bar compact hud-panel" : "filter-bar hud-panel"}
      id="filters"
      aria-label="Travel recommendation filters"
    >
      <div className="filter-grid">
        {filterConfig.map((filter) => (
          <label className="filter-control" key={filter.key}>
            <span className="filter-icon" aria-hidden="true">
              {filter.icon}
            </span>
            <span className="filter-copy">
              <span className="filter-label">{filter.label}</span>
              <select
                value={selectedValues[filter.key]}
                onChange={(event) => updateSelection(filter.key, event.target.value)}
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

      <div className="filter-submit">
        {status ? (
          <p className="filter-status">{status}</p>
        ) : (
          <p className="filter-status">{filterCount} active filters synced</p>
        )}
        <button className="update-button" type="button" onClick={updateResults}>
          Update Results <span aria-hidden="true">-&gt;</span>
        </button>
      </div>
    </section>
  );
}
