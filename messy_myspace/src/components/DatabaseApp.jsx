import { useEffect, useMemo, useState } from "react";
import FooterTicker from "./FooterTicker";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import { API_BASE_URL, fetchDatabaseSnapshot } from "./api";

function titleize(value = "") {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCell(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
}

function getColumns(table) {
  if (table?.columns?.length) {
    return table.columns;
  }

  return Object.keys(table?.rows?.[0] ?? {});
}

export default function DatabaseApp() {
  const [snapshot, setSnapshot] = useState(null);
  const [activeTableName, setActiveTableName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDatabase() {
      try {
        const nextSnapshot = await fetchDatabaseSnapshot();
        const tables = nextSnapshot.tables ?? [];

        if (isMounted) {
          setSnapshot(nextSnapshot);
          setActiveTableName(tables[0]?.name ?? "");
          setError("");
        }
      } catch (requestError) {
        if (isMounted) {
          setError(`Flask API offline at ${API_BASE_URL} - database snapshot unavailable`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDatabase();

    return () => {
      isMounted = false;
    };
  }, []);

  const tables = snapshot?.tables ?? [];
  const activeTable = tables.find((table) => table.name === activeTableName) ?? tables[0];
  const columns = getColumns(activeTable);
  const totalRows = useMemo(
    () => tables.reduce((count, table) => count + (table.rows?.length ?? 0), 0),
    [tables],
  );

  return (
    <>
      <div className="page-noise" aria-hidden="true"></div>
      <Header currentPath="/database" />
      <main className="myspace-shell database-shell">
        <LeftSidebar />

        <section className="main-column" aria-label="Dreamroute database">
          <section className="database-hero panel" aria-labelledby="database-title">
            <p>\ DATABASE ACCESS</p>
            <h1 id="database-title">{snapshot?.database ?? "TRAVEL.DB"}</h1>
            <span>
              {loading
                ? "dialing sqlite signal..."
                : error || `${tables.length} tables / ${totalRows} rows from Flask`}
            </span>
          </section>

          <section className="database-console panel" aria-labelledby="database-console-title">
            <div className="section-title-row">
              <div>
                <p>\ LIVE API DATABASE</p>
                <h2 id="database-console-title">
                  {loading ? "loading tables..." : "tables currently backing the API"}
                </h2>
              </div>
              <a href="/results">compare recommendations &gt;&gt;</a>
            </div>

            {error && <p className="database-status error">{error}</p>}
            {loading && <p className="empty-results">receiving table list...</p>}

            {!loading && !error && (
              <>
                <div className="database-tabs" aria-label="Database tables">
                  {tables.map((table) => (
                    <button
                      aria-pressed={table.name === activeTable?.name}
                      className={table.name === activeTable?.name ? "active" : ""}
                      key={table.name}
                      onClick={() => setActiveTableName(table.name)}
                      type="button"
                    >
                      <span>{titleize(table.name)}</span>
                      <small>{table.rows?.length ?? 0} rows</small>
                    </button>
                  ))}
                </div>

                {activeTable ? (
                  <div className="database-table-wrap">
                    <table className="database-table">
                      <caption>{titleize(activeTable.name)}</caption>
                      <thead>
                        <tr>
                          {columns.map((column) => (
                            <th key={column} scope="col">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(activeTable.rows ?? []).map((row, rowIndex) => (
                          <tr key={`${activeTable.name}-${rowIndex}`}>
                            {columns.map((column) => (
                              <td key={`${activeTable.name}-${rowIndex}-${column}`}>
                                {formatCell(row[column])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="empty-results">no database tables received.</p>
                )}

                <div className="database-schema-grid" aria-label="Database table summary">
                  {tables.map((table) => (
                    <div className="database-schema-pill" key={`${table.name}-schema`}>
                      <strong>{table.name}</strong>
                      <span>{getColumns(table).join(" :: ")}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </section>

        <RightSidebar />
      </main>
      <FooterTicker />
    </>
  );
}
