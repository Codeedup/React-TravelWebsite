const navLinks = ["Home", "Compare", "About", "Data Sources"];

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="City Vibe Explorer home">
          <span className="brand-mark" aria-hidden="true"></span>
          <span className="brand-name">City Vibe Explorer</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              className={link === "Home" ? "nav-link active" : "nav-link"}
              href="/"
              key={link}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
