export default function FooterTicker() {
  return (
    <footer className="radio-footer">
      <strong>DREAMROUTE </strong>
      <div className="ticker-copy" aria-label="Travel radio ticker">
        <span>tune in. zone out. travel beyond.</span>
        <span>dream signal unstable</span>
      </div>
      <div className="equalizer" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, index) => (
          <span key={index}></span>
        ))}
      </div>
      <nav aria-label="Footer links">
        <a href="/">home</a>
        <a href="/about">about</a>
        <a href="/contact">contact</a>
        <a href="/database">database</a>
      </nav>
      <small>© 2007-2025 DREAMROUTE NETWORK</small>
    </footer>
  );
}
