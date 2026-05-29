import { useEffect, useState } from "react";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
  { label: "DATABASE", href: "/database" },
];

const MIN_FONT_SIZE = 90;
const MAX_FONT_SIZE = 125;
const FONT_STEP = 10;
const STORAGE_KEY = "dreamroute-font-size";

function normalizePath(path = "/") {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

function clampFontSize(value) {
  return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, value));
}

function applyFontSize(size) {
  document.documentElement.style.fontSize = `${size}%`;
  window.localStorage.setItem(STORAGE_KEY, String(size));
}

export default function Header({ currentPath = "/" }) {
  const activePath = normalizePath(currentPath);
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    const savedFontSize = window.localStorage.getItem(STORAGE_KEY);

    if (savedFontSize !== null) {
      const parsedFontSize = Number(savedFontSize);

      if (!Number.isFinite(parsedFontSize)) {
        return;
      }

      const nextFontSize = clampFontSize(parsedFontSize);
      setFontSize(nextFontSize);
      applyFontSize(nextFontSize);
    }
  }, []);

  function adjustFontSize(amount) {
    setFontSize((currentSize) => {
      const nextFontSize = clampFontSize(currentSize + amount);
      applyFontSize(nextFontSize);
      return nextFontSize;
    });
  }

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

      <div className="font-controls" aria-label="Text size controls">
        <span aria-hidden="true">TEXT</span>
        <button
          aria-label="Decrease text size"
          disabled={fontSize <= MIN_FONT_SIZE}
          onClick={() => adjustFontSize(-FONT_STEP)}
          type="button"
        >
          A-
        </button>
        <button
          aria-label="Increase text size"
          disabled={fontSize >= MAX_FONT_SIZE}
          onClick={() => adjustFontSize(FONT_STEP)}
          type="button"
        >
          A+
        </button>
        <span className="visually-hidden" aria-live="polite">
          Text size {fontSize} percent
        </span>
      </div>

      <div className="connection-box" aria-label="Connection status">
        <span>CONNECTED TO:</span>
        <strong>DREAMNET_</strong>
        <small>(238.7.115.92)</small>
      </div>
    </header>
  );
}
