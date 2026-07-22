export default function SectionHead({ title, sub, action, eyebrow }) {
  return (
    <div className="d-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, gap: 12, flexWrap: "wrap" }}>
      <div>
        {eyebrow && <div className="cc-eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>}
        <h2 className="font-display" style={{ fontWeight: 800, fontSize: 27, margin: 0, lineHeight: 1.1, color: "var(--ink)" }}>{title}</h2>
        {sub && <p style={{ color: "var(--slate)", fontSize: 13, margin: "6px 0 0", maxWidth: 520 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
