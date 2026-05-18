const navLinks = ["Destinations", "Inspiration", "Trips", "Deals"];

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="Wanderly home">
          <span className="brand-mark" aria-hidden="true"></span>
          <span>Wanderly</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a href="#destinations" key={link}>
              {link}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="saved-link" href="#destinations">
            Saved
          </a>
          <label className="language-select">
            <span className="sr-only">Language</span>
            <select defaultValue="EN">
              <option>EN</option>
              <option>ES</option>
              <option>FR</option>
            </select>
          </label>
          <span className="avatar" aria-label="User profile placeholder"></span>
        </div>
      </div>
    </header>
  );
}
