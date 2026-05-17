export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-image" role="img" aria-label="Limestone islands and blue water">
        <div className="hero-noise" aria-hidden="true"></div>
        <div className="hero-reticle" aria-hidden="true">
          <span></span>
        </div>
        <div className="hero-coordinates hud-mini">
          <span>Location Intel</span>
          <strong>13.7563 N</strong>
          <strong>100.5018 E</strong>
          <em>Elev. 12m</em>
        </div>
        <div className="hero-weather hud-mini">
          <span>Environment</span>
          <dl>
            <div>
              <dt>Temp</dt>
              <dd>29C</dd>
            </div>
            <div>
              <dt>Humidity</dt>
              <dd>78%</dd>
            </div>
            <div>
              <dt>UV Index</dt>
              <dd className="danger">High</dd>
            </div>
            <div>
              <dt>Visibility</dt>
              <dd>16km</dd>
            </div>
          </dl>
          <svg viewBox="0 0 160 40" aria-hidden="true">
            <polyline points="0,28 16,24 32,25 48,16 64,21 80,18 96,24 112,20 128,10 144,16 160,14" />
          </svg>
        </div>
        <div className="scenic-score hud-mini">
          <span>Scenic Score</span>
          <strong>9.2<small>/10</small></strong>
          <i aria-hidden="true"></i>
        </div>

        <div className="hero-copy">
          <p className="kicker">// Intelligent travel discovery</p>
          <h1 id="hero-title">
            DISCOVER PLACES
            <br />
            THAT FIT YOU.
          </h1>
          <p>
            Personalized recommendations powered by real-time data and traveler
            insights.
          </p>
          <a className="hero-cta" href="#filters">
            Find My Next Destination <span aria-hidden="true">R2</span>
          </a>
        </div>
      </div>
    </section>
  );
}
