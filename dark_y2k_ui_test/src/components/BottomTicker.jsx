import { tickerAlerts } from "./data";

export default function BottomTicker() {
  return (
    <footer className="bottom-ticker" aria-label="Travel alerts">
      <span className="ticker-label">Travel Alerts</span>
      <div className="ticker-items">
        {tickerAlerts.map((alert) => (
          <span key={alert}>{alert}</span>
        ))}
      </div>
      <time>UTC 14:32:18</time>
    </footer>
  );
}
