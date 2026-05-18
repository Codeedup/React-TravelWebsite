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
        <PanelTitle id="profile-title">TRAVELER PROFILE - Work in Progress</PanelTitle>
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
