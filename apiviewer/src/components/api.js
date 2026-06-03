import { fallbackDestinations, fallbackFilterOptions } from "./mockDestinations"; // incase the api doesn't load


export const API_BASE_URL = "http://127.0.0.1:5001";

export const filterConfig = [
  { label: "Cost", key: "cost" },
  { label: "Month", key: "month" },
  { label: "Weather", key: "weather" },
  { label: "Activities", key: "activity" },
  { label: "Vibe", key: "vibe" },
];

// create empty filter form when nothing has been passed yet
export function createEmptyFilters() {
  return filterConfig.reduce((filters, filter) => {
    filters[filter.key] = "";
    return filters;
  }, {});
}


export function normalizeFilterOptions(options = {}) {
  return filterConfig.reduce((normalized, filter) => {
    normalized[filter.key] = options[filter.key] ?? fallbackFilterOptions[filter.key] ?? [];//if Flask is broken fallback
    return normalized;
  }, {});
}

export function getFiltersFromSearch(search = "") {
  const params = new URLSearchParams(search);

  return filterConfig.reduce((filters, filter) => {
    filters[filter.key] = params.get(filter.key) ?? "";
    return filters;
  }, {});
}

// finds query parameters from the selected filters
export function buildSearchParams(filters = {}) {
  const params = new URLSearchParams();

  filterConfig.forEach((filter) => {
    const value = (filters[filter.key] ?? "").trim(); // if nothing is passed give it empty string

    if (value) {
      params.set(filter.key, value); 
    }
  });

  return params;
}

export async function fetchFilterOptions() {
  const response = await fetch(`${API_BASE_URL}/api/filter-options`); // gets dropdowns 

  if (!response.ok) {
    throw new Error("Filter options request failed");
  }

  return normalizeFilterOptions(await response.json());
}

// API connection point: this calls the existing Flask recommender endpoint. Builds the main query string
export async function fetchRecommendedDestinations(filters = {}) {
  const params = buildSearchParams(filters);
  const queryString = params.toString();
  const url = queryString
    ? `${API_BASE_URL}/api/search?${queryString}`
    : `${API_BASE_URL}/api/search`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Destination search request failed");
  }

  return response.json();
}

export async function fetchDatabaseSnapshot() {
  const response = await fetch(`${API_BASE_URL}/api/database`);

  if (!response.ok) {
    throw new Error("Database snapshot request failed");
  }

  return response.json();
}

export function getFallbackDestinations() {
  return fallbackDestinations;
}
