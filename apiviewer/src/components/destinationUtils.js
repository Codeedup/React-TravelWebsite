import destinationImageCredits from "./destinationImageCredits.json";

export function slugifyDestination(name = "") {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getDestinationImageSrc(name = "") {
  const slug = slugifyDestination(name);
  return slug ? `/assets/destinations/${slug}.jpg` : "";
}

export function getDestinationImageCredit(name = "") {
  const slug = slugifyDestination(name);
  return destinationImageCredits[slug] || null;
}

export function formatOptionLabel(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export function getMatchPercent(destination) {
  const scoredFilterCount = Number(destination.scored_filter_count || 0);
  const matchCount = Number(destination.match_count || 0);

  if (!Number.isFinite(scoredFilterCount) || scoredFilterCount <= 0) {
    return null;
  }

  const boundedMatchCount = Number.isFinite(matchCount)
    ? Math.min(Math.max(matchCount, 0), scoredFilterCount)
    : 0;
  return Math.round((boundedMatchCount / scoredFilterCount) * 100);
}

export function getWeatherLine(destination) {
  const weather = destination.weather_band || "Weather unknown";
  const temp =
    typeof destination.avg_temp_c === "number" ? `${destination.avg_temp_c.toFixed(1)}C` : "";
  const rain =
    typeof destination.rainfall_mm === "number" ? `${destination.rainfall_mm.toFixed(0)}mm rain` : "";

  return [weather, temp, rain].filter(Boolean).join(" / ");
}
