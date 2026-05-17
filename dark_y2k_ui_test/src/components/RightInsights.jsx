import { dnaValues, priceTrend } from "./data";

function TrendChart() {
  const pointsBudget = priceTrend
    .map((point, index) => `${index * 32},${100 - point.budget}`)
    .join(" ");
  const pointsMid = priceTrend
    .map((point, index) => `${index * 32},${100 - point.mid}`)
    .join(" ");

  return (
    <svg className="trend-chart" viewBox="0 0 170 105" aria-hidden="true">
      <g className="chart-grid">
        <line x1="0" y1="25" x2="170" y2="25" />
        <line x1="0" y1="52" x2="170" y2="52" />
        <line x1="0" y1="79" x2="170" y2="79" />
      </g>
      <polyline className="trend-budget" points={pointsBudget} />
      <polyline className="trend-mid" points={pointsMid} />
      {priceTrend.map((point, index) => (
        <text x={index * 32} y="102" key={point.month}>
          {point.month}
        </text>
      ))}
    </svg>
  );
}

export default function RightInsights() {
  return (
    <aside className="right-insights" aria-label="Travel recommendation insights">
      <section className="hud-panel insight-panel why-panel">
        <div className="panel-title-row">
          <h2>Why these picks?</h2>
        </div>
        <p>
          We analyze millions of data points in real time to match destinations
          with your unique preferences.
        </p>
        <div className="terrain-visual" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <a href="/about">Learn Our Method <span aria-hidden="true">-&gt;</span></a>
      </section>

      <section className="hud-panel insight-panel">
        <div className="panel-title-row">
          <h2>Your Travel DNA</h2>
        </div>
        <div className="dna-layout">
          <div className="radar-visual" aria-hidden="true">
            <span></span>
          </div>
          <dl className="dna-list">
            {dnaValues.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="hud-panel insight-panel">
        <div className="panel-title-row">
          <h2>Monthly Price Trend</h2>
          <span>Next 6 months</span>
        </div>
        <TrendChart />
        <div className="chart-legend">
          <span>Budget</span>
          <span>Mid-range</span>
        </div>
      </section>

      <section className="hud-panel insight-panel passport-panel">
        <div className="panel-title-row">
          <h2>Passport Power</h2>
          <span>Your passport: US</span>
        </div>
        <strong>162</strong>
        <p>Destinations visa-free</p>
        <div className="passport-progress" aria-hidden="true">
          <span></span>
        </div>
        <div className="passport-scale" aria-hidden="true">
          <span>0</span>
          <span>100</span>
          <span>200</span>
        </div>
      </section>
    </aside>
  );
}
