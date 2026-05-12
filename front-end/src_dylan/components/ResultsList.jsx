import { useEffect, useState } from "react";

const resultSets = {
  Hiking: [
    {
      city: "Vancouver",
      country: "Canada",
      reason: "Mountain trails, forest parks, and coastal walks are easy to reach.",
    },
    {
      city: "Cape Town",
      country: "South Africa",
      reason: "Table Mountain and nearby reserves make outdoor days feel effortless.",
    },
    {
      city: "Innsbruck",
      country: "Austria",
      reason: "Alpine routes sit close to the city, with plenty of scenic variety.",
    },
  ],
  Surfing: [
    {
      city: "Lisbon",
      country: "Portugal",
      reason: "Reliable Atlantic breaks are close by without losing city energy.",
    },
    {
      city: "San Diego",
      country: "United States",
      reason: "Warm beaches and steady surf culture make it an easy sport match.",
    },
    {
      city: "Byron Bay",
      country: "Australia",
      reason: "A relaxed coastal base with famous waves and board-friendly days.",
    },
  ],
  "Museum Hopping": [
    {
      city: "London",
      country: "United Kingdom",
      reason: "Major museums are packed into walkable districts with huge variety.",
    },
    {
      city: "Paris",
      country: "France",
      reason: "Art, history, and design collections make it a classic culture pick.",
    },
    {
      city: "Washington",
      country: "United States",
      reason: "The Smithsonian network gives museum-heavy trips a simple route.",
    },
  ],
  "Wine Tasting": [
    {
      city: "Florence",
      country: "Italy",
      reason: "Tuscan wine country is close enough for easy tasting days.",
    },
    {
      city: "Porto",
      country: "Portugal",
      reason: "Cellars, river views, and nearby vineyards make it a strong match.",
    },
    {
      city: "Bordeaux",
      country: "France",
      reason: "A polished city base with world-known wine routes around it.",
    },
  ],
  "Scuba Diving": [
    {
      city: "Cairns",
      country: "Australia",
      reason: "The Great Barrier Reef makes it the strongest ocean-adventure pick.",
    },
    {
      city: "Cancun",
      country: "Mexico",
      reason: "Reefs and cenotes give diving trips plenty of range.",
    },
    {
      city: "Sharm El-Sheikh",
      country: "Egypt",
      reason: "Clear Red Sea sites make it a dependable dive-focused destination.",
    },
  ],
  "Skiing/Snowboarding": [
    {
      city: "Innsbruck",
      country: "Austria",
      reason: "Multiple ski areas are close, making mountain days simple.",
    },
    {
      city: "Vancouver",
      country: "Canada",
      reason: "City life and nearby slopes sit comfortably together.",
    },
    {
      city: "Sapporo",
      country: "Japan",
      reason: "Winter conditions and nearby resorts make it a strong snow pick.",
    },
  ],
  "Street Food Tours": [
    {
      city: "Bangkok",
      country: "Thailand",
      reason: "Street stalls, night markets, and bold local food are everywhere.",
    },
    {
      city: "Mexico City",
      country: "Mexico",
      reason: "Markets and taco routes make food exploration feel endless.",
    },
    {
      city: "Singapore",
      country: "Singapore",
      reason: "Hawker centers keep a huge range of dishes close together.",
    },
  ],
  Stargazing: [
    {
      city: "San Pedro de Atacama",
      country: "Chile",
      reason: "Dry desert skies make it one of the clearest stargazing bases.",
    },
    {
      city: "Flagstaff",
      country: "United States",
      reason: "Dark-sky access and observatories make it a calm astronomy match.",
    },
    {
      city: "Queenstown",
      country: "New Zealand",
      reason: "Southern skies and mountain scenery make quiet nights memorable.",
    },
  ],
  "Historical Walking Tours": [
    {
      city: "Rome",
      country: "Italy",
      reason: "Ancient sites and layered neighborhoods reward slow walks.",
    },
    {
      city: "Prague",
      country: "Czech Republic",
      reason: "Compact streets and preserved architecture make tours easy.",
    },
    {
      city: "Athens",
      country: "Greece",
      reason: "Historic landmarks sit close to daily city life.",
    },
  ],
  "Nightlife & Clubbing": [
    {
      city: "Berlin",
      country: "Germany",
      reason: "Late-night venues and electronic music make it the strongest fit.",
    },
    {
      city: "Ibiza Town",
      country: "Spain",
      reason: "Club culture is central, energetic, and easy to plan around.",
    },
    {
      city: "Amsterdam",
      country: "Netherlands",
      reason: "Compact nightlife districts keep social evenings flexible.",
    },
  ],
};

const defaultResults = [
  {
    city: "Lisbon",
    country: "Portugal",
    reason: "A balanced first pick with food, coast, culture, and relaxed city energy.",
  },
  {
    city: "Tokyo",
    country: "Japan",
    reason: "A high-energy option with deep culture, food, and urban discovery.",
  },
  {
    city: "Prague",
    country: "Czech Republic",
    reason: "A scenic city with strong history and easy walking days.",
  },
];

export default function ResultsList() {
  const [activity, setActivity] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActivity(params.get("activity") ?? "");
  }, []);

  const results = resultSets[activity] ?? defaultResults;
  const activityLabel = resultSets[activity] ? activity : "your selected activities";

  return (
    <>
      <section className="results-hero" aria-labelledby="results-title">
        <p className="results-kicker">Mock results</p>
        <h1 id="results-title">The best cities for you are:</h1>
        <p>
          Based on {activityLabel}, here are three placeholder matches from
          best to worst.
        </p>
      </section>

      <section className="results-list" aria-label="Ranked city matches">
        {results.map((result, index) => (
          <article className="result-card" key={`${result.city}-${result.country}`}>
            <div className="result-rank" aria-label={`Rank ${index + 1}`}>
              {index + 1}
            </div>
            <div className="result-copy">
              <p className="result-label">
                {index === 0 ? "Best match" : "Next best"}
              </p>
              <h2>{result.city}</h2>
              <p className="result-country">{result.country}</p>
              <p className="result-reason">{result.reason}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
