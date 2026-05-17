const navItems = [
  "HOME",
  "DESTINATIONS",
  "DREAMLIST",
  "JOURNEYS",
  "COMMUNITY",
  "ABOUT",
  "CONTACT",
];

export default function Header() {
  return (
    <header className="top-chrome">
      <div className="welcome-strip">
        <span aria-hidden="true">::</span>
        <strong>WELCOME, TRAVELER</strong>
        <a href="/">login</a>
        <a href="/">sign up</a>
      </div>

      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a className={item === "HOME" ? "active" : ""} href={item === "HOME" ? "/" : "/"} key={item}>
            {item}
          </a>
        ))}
      </nav>

      <div className="connection-box" aria-label="Connection status">
        <span>CONNECTED TO:</span>
        <strong>DREAMNET_</strong>
        <small>(238.7.115.92)</small>
      </div>
    </header>
  );
}
