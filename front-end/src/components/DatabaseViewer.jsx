import { useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:5001";

export default function DatabaseViewer() {
  const [dbData, setDbData] = useState(null);
  const [activeTab, setActiveTab] = useState("Destinations");
  // --- CHANGED: Added state to track the active filter ---
  const [selectedCity, setSelectedCity] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDatabase() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/database`);
        
        if (response.ok === false) {
          throw new Error("Failed to fetch database data.");
        }
        
        const data = await response.json();
        setDbData(data);
      } catch (err) {
        setError("Make sure your Flask API is running!");
      } finally {
        setLoading(false);
      }
    }
    
    fetchDatabase();
  }, []);

  // --- CHANGED: Reset the city filter back to "All" whenever you change tabs ---
  useEffect(() => {
    setSelectedCity("All");
  }, [activeTab]);

  if (loading === true) {
    return <p className="results-message">Loading database records...</p>;
  }

  if (error !== "") {
    return <p className="results-message error">{error}</p>;
  }

  if (dbData === null) {
    return null;
  }

  const tabs = Object.keys(dbData);
  const currentTableData = dbData[activeTab];
  
  // --- CHANGED: Setup our filtering logic ---
  let displayData = currentTableData;
  let filterUI = null;

  // If the current table has a "City" column, we build the dropdown UI
  if (currentTableData.length > 0 && currentTableData[0].City !== undefined) {
    // Extract a list of unique cities and sort them alphabetically
    const uniqueCities = [...new Set(currentTableData.map(item => item.City))].sort();

    filterUI = (
      <div style={styles.filterContainer}>
        <label style={styles.filterLabel}>Filter by City: </label>
        <select 
          value={selectedCity} 
          onChange={(e) => setSelectedCity(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="All">All Cities</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
    );

    // Apply the filter to the data if a specific city is chosen
    if (selectedCity !== "All") {
      displayData = currentTableData.filter(item => item.City === selectedCity);
    }
  }

  function getTabStyle(tabName) {
    let buttonStyle = { ...styles.tabButton };
    
    if (activeTab === tabName) {
      buttonStyle.backgroundColor = "#0070f3";
      buttonStyle.color = "#fff";
    } else {
      buttonStyle.backgroundColor = "#eaeaea";
      buttonStyle.color = "#333";
    }
    
    return buttonStyle;
  }

  // --- CHANGED: We now map over displayData instead of currentTableData ---
  let tableHeaders = null;
  if (displayData.length > 0) {
    let firstRow = displayData[0];
    let columnNames = Object.keys(firstRow);
    
    tableHeaders = columnNames.map((key) => {
      return (
        <th key={key} style={styles.tableHeader}>
          {key}
        </th>
      );
    });
  }

  // --- CHANGED: We now map over displayData instead of currentTableData ---
  let tableRows = null;
  if (displayData.length > 0) {
    tableRows = displayData.map((row, rowIndex) => {
      let rowValues = Object.values(row);
      
      return (
        <tr key={rowIndex} style={styles.tableRow}>
          {rowValues.map((val, colIndex) => {
            let displayValue = val;
            
            if (typeof val === "number" && !Number.isInteger(val)) {
              displayValue = val.toFixed(1); 
            }
            if (val === null) {
               displayValue = "N/A";
            }

            return (
              <td key={colIndex} style={styles.tableCell}>
                {displayValue}
              </td>
            );
          })}
        </tr>
      );
    });
  } else {
    tableRows = (
      <tr>
        <td style={styles.tableCell}>No data found in this table.</td>
      </tr>
    );
  }

  return (
    <div className="db-viewer" style={styles.container}>
      
      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        {tabs.map((tab) => {
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={getTabStyle(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Summary Header */}
      <div style={styles.tableSummary}>
        <div>
          <h3 style={{ margin: "0 0 5px 0" }}>Viewing: {activeTab}</h3>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            Showing <strong>{displayData.length}</strong> of <strong>{currentTableData.length}</strong> total records
          </p>
        </div>
        
        {/* --- CHANGED: Render the filter dropdown if it exists --- */}
        {filterUI}
      </div>

      {/* Table Display */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              {tableHeaders}
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2rem"
  },
  tabContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },
  tabButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  tableSummary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    padding: "0 10px",
    color: "#333",
    flexWrap: "wrap",
    gap: "15px"
  },
  // --- CHANGED: Added styles for the new filter UI ---
  filterContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #dce4ec"
  },
  filterLabel: {
    fontWeight: "bold",
    marginRight: "10px",
    fontSize: "14px",
    color: "#333"
  },
  filterSelect: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    cursor: "pointer",
    minWidth: "150px"
  },
  tableWrapper: {
    overflowX: "auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  },
  tableHeaderRow: {
    backgroundColor: "#f8f9fa",
    borderBottom: "2px solid #ddd"
  },
  tableHeader: {
    padding: "12px",
    fontWeight: "600",
    color: "#555"
  },
  tableRow: {
    borderBottom: "1px solid #eee"
  },
  tableCell: {
    padding: "12px",
    color: "#333",
    maxWidth: "300px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
};