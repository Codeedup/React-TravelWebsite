const navLinks = [
  { label: "Home", href: "/" },
  { label: "Compare", href: "/" },
  { label: "About", href: "/about" },
  { label: "Data Sources", href: "/" },
];

export default function Header({ currentPage = "Home" }) {
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
              className={link.label === currentPage ? "nav-link active" : "nav-link"}
              href={link.href}
              key={link.label}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
