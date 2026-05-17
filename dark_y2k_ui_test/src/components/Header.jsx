import { navLinks } from "./data";

export default function Header({ currentPage = "Discover" }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="WAYFINDER home">
        <span className="brand-globe" aria-hidden="true">
          <span></span>
        </span>
        <span>
          <strong>WAYFINDER //</strong>
          <small>Travel Recommender</small>
        </span>
      </a>

      <nav className="main-nav" aria-label="Main navigation">
        {navLinks.map((link) => (
          <a
            className={link.label === currentPage ? "nav-link active" : "nav-link"}
            href={link.href}
            key={link.label}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="header-actions" aria-label="Account tools">
        <button className="icon-button" type="button" aria-label="Signal monitor">
          <span className="pulse-icon" aria-hidden="true"></span>
        </button>
        <button className="icon-button" type="button" aria-label="Saved trips">
          <span className="bookmark-icon" aria-hidden="true"></span>
        </button>
        <a className="sign-in-button" href="/about">
          Sign In
        </a>
        <button className="icon-button matrix" type="button" aria-label="Grid menu">
          <span aria-hidden="true"></span>
        </button>
      </div>
    </header>
  );
}
