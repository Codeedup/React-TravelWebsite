import { useState } from "react";

export default function CountrySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    // Reset our states before making a new search
    setError("");
    setResult(null);

    if (!searchTerm.trim()) return;

    try {
      //Fetch data from your Flask API
      const response = await fetch(
        `http://127.0.0.1:5001/api/travel?country=${searchTerm}`,
      );
      const data = await response.json();

      if (data.length === 0) {
        setError("Couldn't find that country in the database!");
        return;
      }

      // Case-Insensitive Matching
      // The API returns everything that matches the letters, so we find the exact match
      // by converting both to lowercase. If no exact match, we just take the first result.
      const matchedCountry =
        data.find((c) => c.name.toLowerCase() === searchTerm.toLowerCase()) ||
        data[0];

      // Randomise the cities
      // We save the city array, shuffle it then slice the first 4
      const shuffledCities = [...matchedCountry.cities].sort(
        () => 0.5 - Math.random(),
      );
      const randomFourCities = shuffledCities.slice(0, 4);

      //Save the processed data to state to trigger a UI update
      setResult({
        name: matchedCountry.name,
        capital: matchedCountry.capital,
        cities: randomFourCities,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch. Make sure your Flask server is running!");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Country Explorer</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Try 'fRaNcE' or 'italy'"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <button
          onClick={handleSearch}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {/* Results Box */}
      {result && (
        <div
          style={{
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ marginTop: 0 }}>{result.name}</h3>
          <p>
            <strong>Capital:</strong> {result.capital}
          </p>

          <p>
            <strong>4 Random Cities:</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {result.cities.length > 0 ? (
              result.cities.map((city, index) => <li key={index}>{city}</li>)
            ) : (
              <li>No cities saved for this country.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
