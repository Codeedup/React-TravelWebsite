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

export default function RightSidebar() {
  return (
    <aside className="right-rail" aria-label="Travel widgets">
      <section className="panel oracle" aria-labelledby="oracle-title">
        <h2 className="panel-title" id="oracle-title">
          <span aria-hidden="true">\</span>
          TRAVEL ORACLE
        </h2>
        <blockquote>
          "The journey is the destination. But wifi helps."
          <cite>- unknown.exe</cite>
        </blockquote>
        <a href="/">refresh omen</a>
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

      
    </aside>
  );
}
