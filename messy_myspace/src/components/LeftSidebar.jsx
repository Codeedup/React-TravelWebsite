export default function LeftSidebar() {
  return (
    <aside className="left-rail" aria-label="Traveler profile and system widgets">
      <section className="brand-card panel">
        <div className="brand-star" aria-hidden="true"></div>
        <a className="dream-logo" href="/" aria-label="DREAMROUTE home">
          DREAMROUTE_
        </a>
        <p>travel recommender</p>
        <strong>WE DON'T SELL TRIPS. WE REVEAL POSSIBILITIES.</strong>
      </section>

      <section className="profile-card panel" aria-labelledby="profile-title">
        <PanelTitle id="profile-title">TRAVELER PROFILE</PanelTitle>
        <div className="profile-grid">
          <div className="avatar-static" aria-label="Pixel style traveler avatar">
            <span></span>
          </div>
          <dl>
            <div>
              <dt>status:</dt>
              <dd>seeking_elsewhere</dd>
            </div>
            <div>
              <dt>member since:</dt>
              <dd>05.23.07</dd>
            </div>
            <div>
              <dt>trips taken:</dt>
              <dd>23</dd>
            </div>
          </dl>
        </div>
        <div className="mini-links" aria-label="Profile links">
          <a href="/">view my profile</a>
          <a href="#filters">edit preferences</a>
          <a href="/results">my dreamlist (7)</a>
          <a href="/results">past journeys</a>
          <a href="/">signed guestbook</a>
        </div>
      </section>

      <section className="panel broadcast" aria-labelledby="broadcast-title">
        <PanelTitle id="broadcast-title">SYSTEM BROADCAST</PanelTitle>
        <p>&gt; the world is not a map.</p>
        <p>&gt; it's a feeling.</p>
        <p>&gt; let's find yours.</p>
      </section>

      <section className="panel now-playing" aria-labelledby="playing-title">
        <PanelTitle id="playing-title">NOW PLAYING</PanelTitle>
        <div className="album-noise" aria-hidden="true"></div>
        <div>
          <strong>Boards of Canada</strong>
          <span>&gt; Roygbiv</span>
          <small>00:42 / 05:27</small>
        </div>
        <a href="/">open player</a>
      </section>

      <section className="ticket-stub" aria-label="Dreamroute boarding pass">
        <span>DREAMROUTE AIRWAYS</span>
        <strong>DESTINATION UNKNOWN</strong>
        <small>GOOD FOR ONE WAY</small>
        <b>DRM#001</b>
      </section>
    </aside>
  );
}

function PanelTitle({ children, id }) {
  return (
    <h2 className="panel-title" id={id}>
      <span aria-hidden="true">\</span>
      {children}
      <button type="button" aria-label={`Close ${children} panel`}>
        x
      </button>
    </h2>
  );
}
