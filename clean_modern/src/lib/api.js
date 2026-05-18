export const API_BASE_URL = (
  import.meta.env.PUBLIC_API_BASE_URL || "http://127.0.0.1:5001"
).replace(/\/$/, "");

const searchFilterKeys = ["cost", "weather", "activity", "vibe"];

async function requestJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

function buildSearchQuery(filters = {}) {
  const params = new URLSearchParams();

  searchFilterKeys.forEach((key) => {
    const value = filters[key];

    if (value) {
      params.set(key, value);
    }
  });

  return params.toString();
}

export async function getDestinations(filters = {}) {
  const query = buildSearchQuery(filters);
  const path = query ? `/api/search?${query}` : "/api/search";

  return requestJson(path);
}

export async function getFilterOptions() {
  const options = await requestJson("/api/filter-options");

  return {
    cost: options.cost ?? [],
    weather: options.weather ?? [],
    activity: options.activity ?? [],
    vibe: options.vibe ?? [],
  };
}

export async function getActivities() {
  const options = await getFilterOptions();
  return options.activity;
}

export async function getCostProfiles() {
  const options = await getFilterOptions();
  return options.cost;
}

export async function getWeatherOptions() {
  const options = await getFilterOptions();
  return options.weather;
}

export async function getVibes() {
  const options = await getFilterOptions();
  return options.vibe;
}
