import { useState } from "react";
import SectionHead from "../shared/SectionHead";
import { uid } from "../../utils";

export default function LostFoundView({ me, data, persistData, toast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "Lost", item: "", where: "" });

  function report(e) {
    e.preventDefault();
    if (!form.item.trim()) return;
    persistData((d) => ({ ...d, lostFound: [{ id: uid(), type: form.type, item: form.item, where: form.where, when: "Today", by: me.name, status: "Open" }, ...d.lostFound] }));
    setForm({ type: "Lost", item: "", where: "" }); setShowForm(false); toast("Report submitted");
  }
  function resolve(id) { persistData((d) => ({ ...d, lostFound: d.lostFound.map((l) => (l.id === id ? { ...l, status: "Resolved" } : l)) })); }

  return (
    <div className="cc-panel">
      <SectionHead eyebrow="Front desk log" title="Lost & found" sub="Report or search for lost items on campus." action={<button className="btn-cc-accent" onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ Report item"}</button>} />
      {showForm && (
        <form onSubmit={report} className="cc-card cc-rise" style={{ padding: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <select className="cc-input" style={{ maxWidth: 110 }} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}><option>Lost</option><option>Found</option></select>
            <input required className="cc-input" placeholder="Item description" value={form.item} onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))} />
          </div>
          <input className="cc-input" style={{ marginTop: 8 }} placeholder="Location" value={form.where} onChange={(e) => setForm((f) => ({ ...f, where: e.target.value }))} />
          <button className="btn-cc-primary" style={{ marginTop: 10 }}>Submit report</button>
        </form>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.lostFound.map((l) => (
          <div key={l.id} className="cc-card" style={{ padding: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
            <div>
              <span className="cc-chip" style={{ borderColor: l.type === "Lost" ? "var(--coral)" : "var(--teal)", color: l.type === "Lost" ? "var(--coral)" : "var(--teal)", background: "var(--surface)" }}>{l.type}</span>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 6 }}>{l.item}</div>
              <div style={{ fontSize: 11.5, color: "var(--slate)" }}>{l.where} · {l.when} · reported by {l.by}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span className="cc-chip">{l.status}</span>
              {l.status === "Open" && <button className="btn-cc-ghost" style={{ padding: "6px 12px" }} onClick={() => resolve(l.id)}>Mark resolved</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
