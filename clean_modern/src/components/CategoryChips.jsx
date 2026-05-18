export const CATEGORY_CHIPS = [
  { label: "All", value: "" },
  { label: "Beach", value: "beach" },
  { label: "Hiking", value: "outdoor" },
  { label: "Culture", value: "history" },
  { label: "Food", value: "food" },
  { label: "Adventure", value: "nature" },
  { label: "Ski", value: "outdoor" },
  { label: "City Breaks", value: "architecture" },
  { label: "Wellness", value: "family" },
];

export default function CategoryChips({ selectedLabel, onSelect }) {
  return (
    <section className="category-strip" aria-label="Activity categories">
      {CATEGORY_CHIPS.map((chip) => (
        <button
          className={selectedLabel === chip.label ? "category-chip active" : "category-chip"}
          type="button"
          key={chip.label}
          onClick={() => onSelect(chip)}
        >
          {chip.label}
        </button>
      ))}
    </section>
  );
}
