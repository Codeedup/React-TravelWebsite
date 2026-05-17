export const API_BASE_URL = "http://127.0.0.1:5001";

export const navLinks = [
  { label: "Discover", href: "/" },
  { label: "Inspiration", href: "/" },
  { label: "Map", href: "/" },
  { label: "Collections", href: "/" },
  { label: "About", href: "/about" },
];

export const filterConfig = [
  {
    label: "Cost",
    key: "cost",
    emptyLabel: "Any Budget",
    icon: "$",
  },
  {
    label: "Weather",
    key: "weather",
    emptyLabel: "Any Weather",
    icon: "WX",
  },
  {
    label: "Activities",
    key: "activity",
    emptyLabel: "Any Activity",
    icon: "ACT",
  },
  {
    label: "Vibe",
    key: "vibe",
    emptyLabel: "Any Vibe",
    icon: "VIBE",
  },
];

export const liveFeed = [
  { city: "Lisbon, PT", temp: "28C", condition: "clear", signal: "good" },
  { city: "Bali, ID", temp: "30C", condition: "humid", signal: "good" },
  { city: "Reykjavik, IS", temp: "12C", condition: "wind", signal: "fair" },
  { city: "Kyoto, JP", temp: "24C", condition: "sun", signal: "good" },
  { city: "Mexico City, MX", temp: "26C", condition: "dry", signal: "good" },
  { city: "Vancouver, CA", temp: "16C", condition: "rain", signal: "good" },
];

export const travelInsights = [
  { label: "Beach", value: 32 },
  { label: "Hiking", value: 24 },
  { label: "Culture", value: 18 },
  { label: "Wildlife", value: 14 },
  { label: "Food", value: 12 },
];

export const dnaValues = [
  { label: "Adventure", value: 72 },
  { label: "Relaxation", value: 68 },
  { label: "Culture", value: 81 },
  { label: "Nature", value: 76 },
  { label: "Nightlife", value: 35 },
];

export const priceTrend = [
  { month: "Jun", budget: 36, mid: 52 },
  { month: "Jul", budget: 28, mid: 42 },
  { month: "Aug", budget: 48, mid: 60 },
  { month: "Sep", budget: 55, mid: 68 },
  { month: "Oct", budget: 73, mid: 82 },
  { month: "Nov", budget: 67, mid: 76 },
];

export const tickerAlerts = [
  "Thailand: rainy season starting soon",
  "Iceland: road conditions good",
  "Japan: cherry blossom season peak",
];

export const fallbackDestinations = [
  {
    destination: "Lisbon",
    country: "Portugal",
    cost: "medium",
    avg_temp_c: 22,
    rainfall_mm: 42,
    weather_band: "Mild",
    activity_type: "history",
    activity_name: "Tile-lined streets, lookout points, and Atlantic light.",
    vibes: ["Urban Explorer", "Gastronomic Journey"],
    match_count: 0,
    selected_filter_count: 0,
  },
  {
    destination: "Barcelona",
    country: "Spain",
    cost: "medium",
    avg_temp_c: 24,
    rainfall_mm: 35,
    weather_band: "Mild",
    activity_type: "beach",
    activity_name: "Coastline, architecture, late dinners, and beach days.",
    vibes: ["Sun & Sand", "Gastronomic Journey"],
    match_count: 0,
    selected_filter_count: 0,
  },
  {
    destination: "Rome",
    country: "Italy",
    cost: "medium",
    avg_temp_c: 25,
    rainfall_mm: 31,
    weather_band: "Hot",
    activity_type: "history",
    activity_name: "Ancient streets, layered culture, and long lunches.",
    vibes: ["Gastronomic Journey", "Cultural Roots"],
    match_count: 0,
    selected_filter_count: 0,
  },
  {
    destination: "Paris",
    country: "France",
    cost: "expensive",
    avg_temp_c: 20,
    rainfall_mm: 44,
    weather_band: "Mild",
    activity_type: "art",
    activity_name: "Museums, neighborhoods, markets, and cafe routes.",
    vibes: ["Gastronomic Journey", "Cultural Roots"],
    match_count: 0,
    selected_filter_count: 0,
  },
  {
    destination: "Athens",
    country: "Greece",
    cost: "cheap",
    avg_temp_c: 27,
    rainfall_mm: 21,
    weather_band: "Hot",
    activity_type: "history",
    activity_name: "Mythic ruins, sunny plazas, and ferry gateways.",
    vibes: ["Frugal Adventure", "Cultural Roots"],
    match_count: 0,
    selected_filter_count: 0,
  },
];

export const destinationImageMap = {
  amsterdam: "/assets/destinations/amsterdam.jpg",
  athens: "/assets/destinations/athens.jpg",
  barcelona: "/assets/destinations/barcelona.jpg",
  berlin: "/assets/destinations/berlin.jpg",
  dubrovnik: "/assets/destinations/dubrovnik.jpg",
  edinburgh: "/assets/destinations/edinburgh.jpg",
  istanbul: "/assets/destinations/istanbul.jpg",
  lisbon: "/assets/destinations/lisbon.jpg",
  paris: "/assets/destinations/paris.jpg",
  rome: "/assets/destinations/rome.jpg",
};

export function slugifyDestination(name = "") {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function formatOptionLabel(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export function getDestinationScore(destination, index = 0) {
  if (destination.selected_filter_count > 0) {
    const ratio = destination.match_count / destination.selected_filter_count;
    return (8.1 + ratio * 1.6).toFixed(1);
  }

  const stableOffset = (destination.destination || "")
    .split("")
    .reduce((total, letter) => total + letter.charCodeAt(0), 0);

  return (9.4 - index * 0.2 - (stableOffset % 4) * 0.05).toFixed(1);
}

export function getWeatherSummary(destination) {
  const parts = [];

  if (destination.weather_band) {
    parts.push(destination.weather_band);
  }

  if (typeof destination.avg_temp_c === "number") {
    parts.push(`${destination.avg_temp_c.toFixed(1)}C`);
  }

  if (typeof destination.rainfall_mm === "number") {
    parts.push(`${destination.rainfall_mm.toFixed(0)}mm rain`);
  }

  return parts.join(" | ");
}
