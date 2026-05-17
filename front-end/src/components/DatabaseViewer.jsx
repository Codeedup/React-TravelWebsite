import { useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:5001";

export default function DatabaseViewer() {
  const [dbData, setDbData] = useState(null);
  const [activeTab, setActiveTab] = useState("Destinations");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDatabase() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/database`);
        
        // Explicit if statement instead of a one-liner
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

  // Explicit if statements with full brackets instead of one-liners
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

  // Helper function to handle the button colors using a standard if/else
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

  // Build the table headers using explicit if/else logic instead of &&
  let tableHeaders = null;
  if (currentTableData.length > 0) {
    let firstRow = currentTableData[0];
    let columnNames = Object.keys(firstRow);
    
    tableHeaders = columnNames.map((key) => {
      return (
        <th key={key} style={styles.tableHeader}>
          {key}
        </th>
      );
    });
  }

  // Build the table rows using explicit if/else logic instead of a ternary operator
  let tableRows = null;
  if (currentTableData.length > 0) {
    tableRows = currentTableData.map((row, rowIndex) => {
      let rowValues = Object.values(row);
      
      return (
        <tr key={rowIndex} style={styles.tableRow}>
          {rowValues.map((val, colIndex) => {
            return (
              <td key={colIndex} style={styles.tableCell}>
                {val}
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

  // The return statement is now incredibly clean and just renders the variables we built above!
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
    maxWidth: "1000px",
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
    color: "#333"
  }
};