const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
  { label: "DATABASE", href: "/database" },
];

function normalizePath(path = "/") {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export default function Header({ currentPath = "/" }) {
  const activePath = normalizePath(currentPath);

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
          <a
            className={normalizePath(item.href) === activePath ? "active" : ""}
            href={item.href}
            key={item.href}
          >
            {item.label}
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
