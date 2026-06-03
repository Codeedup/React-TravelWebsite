const feedItems = [
  {
    handle: "@lost_in_kyoto",
    text: "found a temple that felt like a memory",
    time: "2h ago",
    image: "/assets/destinations/amsterdam.jpg",
    fallback: "ky",
  },
  {
    handle: "@desert.wav",
    text: "saw colors i didn't know existed",
    time: "5h ago",
    image: "/assets/destinations/istanbul.jpg",
    fallback: "dw",
  },
  {
    handle: "@oceanhost",
    text: "slept in a cave woke up in another world",
    time: "1d ago",
    image: "/assets/destinations/dubrovnik.jpg",
    fallback: "oh",
  },
];

const passportStamps = [
  {
    src: "/assets/ui_images/reykjavik_iceland_stamp.png",
    alt: "Reykjavik Iceland passport stamp",
  },
  {
    src: "/assets/ui_images/tokyo_japan_stamp.png",
    alt: "Tokyo Japan passport stamp",
  },
  {
    src: "/assets/ui_images/machu_picchu_peru_stamp.png",
    alt: "Machu Picchu Peru passport stamp",
  },
  {
    src: "/assets/ui_images/marrakech_morocco_stamp.png",
    alt: "Marrakech Morocco passport stamp",
  },
];

const travelOmens = [
  {
    quote: '"The journey is the destination. But wifi helps."',
    cite: "- unknown.exe",
  },
  {
    quote: '"Pack light; the universe charges baggage fees."',
    cite: "- terminal atlas",
  },
  {
    quote: '"Turn left where the map starts glitching."',
    cite: "- road oracle",
  },
  {
    quote: '"A missed train is just a portal with better lighting."',
    cite: "- platform 404",
  },
  {
    quote: '"Follow the weather, then ignore it beautifully."',
    cite: "- cloud protocol",
  },
];

const travelOmenScript = `
(() => {
  const travelOmens = ${JSON.stringify(travelOmens)};

  document.querySelectorAll("[data-travel-omen-refresh]").forEach((refreshLink) => {
    if (refreshLink.dataset.travelOmenReady === "true") {
      return;
    }

    refreshLink.dataset.travelOmenReady = "true";
    refreshLink.addEventListener("click", (event) => {
      event.preventDefault();

      const oracle = refreshLink.closest(".oracle");
      const quote = oracle?.querySelector("[data-travel-omen-quote]");
      const cite = oracle?.querySelector("[data-travel-omen-cite]");

      if (!quote || !cite) {
        return;
      }

      const currentQuote = quote.textContent;
      const options = travelOmens.filter((omen) => omen.quote !== currentQuote);
      const nextOmen = options[Math.floor(Math.random() * options.length)] ?? travelOmens[0];

      quote.textContent = nextOmen.quote;
      cite.textContent = nextOmen.cite;
    });
  });
})();
`;

export default function RightSidebar() {
  return (
    <aside className="right-rail" aria-label="Travel widgets">
      <section className="panel oracle" aria-labelledby="oracle-title">
        <h2 className="panel-title" id="oracle-title">
          <span aria-hidden="true">\</span>
          TRAVEL ORACLE
        </h2>
        <blockquote>
          <span data-travel-omen-quote>{travelOmens[0].quote}</span>
          <cite data-travel-omen-cite>{travelOmens[0].cite}</cite>
        </blockquote>
        <a href="/" data-travel-omen-refresh="">
          refresh omen
        </a>
      </section>

      <section className="panel stamps" aria-labelledby="stamps-title">
        <h2 className="panel-title" id="stamps-title">
          <span aria-hidden="true">\</span>
          PASSPORT STAMPS
        </h2>
        <div className="stamp-grid">
          {passportStamps.map((stamp) => (
            <img key={stamp.src} src={stamp.src} alt={stamp.alt} loading="lazy" />
          ))}
        </div>
      </section>

      
      <script dangerouslySetInnerHTML={{ __html: travelOmenScript }} />
    </aside>
  );
}
