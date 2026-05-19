export default function Hero() {
  return (
    <section className="hero-window" aria-labelledby="hero-title">
      <div className="wire one" aria-hidden="true"></div>
      <div className="wire two" aria-hidden="true"></div>
      <div className="hero-collage" aria-hidden="true">
        <span className="planet"></span>
        <span className="portal"></span>
        <span className="mountain mountain-a"></span>
        <span className="mountain mountain-b"></span>
        <span className="city-glow"></span>
        <span className="traveler-dot"></span>
      </div>
      <div className="hero-copy">
        <p className="terminal-tag">TELL US WHAT YOU FEEL.</p>
        <h1 id="hero-title">WHERE WILL YOU WAKE UP TOMORROW?</h1>
        <p>Tell us what you feel. We'll find the place that feels like you.</p>
      </div>
      <div className="sticker no-signal">NO SIGNAL</div>
      <div className="sticker unseen">EXPLORE<br />THE UNSEEN</div>
      <div className="quiz-note">
        <span>NOT SURE WHAT YOU WANT?</span>
        <strong>TAKE OUR VIBE QUIZ</strong>
        <a href="#filters">&gt; GO</a>
      </div>
      <div className="browser-bit">
        <span></span>
        <span></span>
        <span></span>
        dreamroute://elsewhere
      </div>
    </section>
  );
}
