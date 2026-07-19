export default function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div className="cc-card cc-stat" style={{ "--stat-color": color || "var(--ink)", padding: "14px 14px 12px", flex: 1, minWidth: 130 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div className="font-mono" style={{ fontSize: 10.5, color: "var(--slate)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</div>
        {Icon && <div className="cc-stat-icon" style={{ background: `color-mix(in srgb, ${color || "var(--ink)"} 15%, transparent)` }}><Icon size={14} color={color || "var(--ink)"} /></div>}
      </div>
      <div className="font-display" style={{ fontSize: 25, fontWeight: 800, color: "var(--ink)", marginTop: 3 }}>{value}</div>
    </div>
  );
}
