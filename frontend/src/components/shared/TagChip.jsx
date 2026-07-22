const TAG_COLORS = { Announcement: "var(--teal)", Event: "var(--violet)", Placement: "var(--coral)", "Project Update": "var(--marigold)", Update: "var(--slate)" };
export default function TagChip({ label, color }) {
  const c = color || TAG_COLORS[label] || "var(--slate)";
  return <span className="cc-chip" style={{ color: c, borderColor: c, background: `color-mix(in srgb, ${c} 12%, var(--surface))`, fontWeight: 700 }}>{label}</span>;
}

/* ================================ APP ==================================== */
