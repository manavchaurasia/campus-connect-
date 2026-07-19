import { useState } from "react";
import SectionHead from "../shared/SectionHead";
import { uid } from "../../utils";

export default function ProjectsView({ me, data, persistData, toast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", need: "", desc: "", seats: 3 });

  function join(p) {
    if (p.joinedBy.includes(me.email)) return;
    persistData((d) => ({ ...d, projects: d.projects.map((x) => (x.id === p.id ? { ...x, joinedBy: [...x.joinedBy, me.email], members: x.members + 1 } : x)) }));
    toast(`Joined ${p.title}`);
  }
  function createProject(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    persistData((d) => ({ ...d, projects: [{ id: uid(), title: form.title, owner: me.name, need: form.need.split(",").map((s) => s.trim()).filter(Boolean), members: 1, seats: Number(form.seats) || 3, desc: form.desc, joinedBy: [] }, ...d.projects] }));
    setForm({ title: "", need: "", desc: "", seats: 3 }); setShowForm(false); toast("Project posted");
  }

  return (
    <div>
      <SectionHead eyebrow="Team-up desk" title="Project collaboration" sub="Find teammates or start your own build." action={<button className="btn-cc-accent" onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ New project"}</button>} />
      {showForm && (
        <form onSubmit={createProject} className="cc-card cc-rise" style={{ padding: 14, marginBottom: 16 }}>
          <input required className="cc-input" style={{ marginBottom: 8 }} placeholder="Project title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <input className="cc-input" style={{ marginBottom: 8 }} placeholder="Skills needed, comma separated" value={form.need} onChange={(e) => setForm((f) => ({ ...f, need: e.target.value }))} />
          <textarea className="cc-input" style={{ marginBottom: 8 }} placeholder="Short description" value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} />
          <input type="number" min={1} className="cc-input" style={{ marginBottom: 10, maxWidth: 120 }} placeholder="Seats" value={form.seats} onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))} />
          <button className="btn-cc-primary">Post project</button>
        </form>
      )}
      <div className="cc-grid-2">
        {data.projects.map((p) => (
          <div key={p.id} className="cc-card pin" style={{ padding: 14, "--stripe": "var(--violet)" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }} className="font-display">{p.title}</div>
            <div style={{ fontSize: 11.5, color: "var(--slate)", marginTop: 2 }}>by {p.owner} · {p.members}/{p.seats} members</div>
            <p style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.5 }}>{p.desc}</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{p.need.map((n) => <span key={n} className="cc-chip">{n}</span>)}</div>
            <button disabled={p.joinedBy.includes(me.email) || p.members >= p.seats} className={p.joinedBy.includes(me.email) ? "cc-chip" : "btn-cc-accent"} style={p.joinedBy.includes(me.email) ? { color: "var(--teal)", borderColor: "var(--teal)", marginTop: 10, background: "var(--surface)" } : { marginTop: 10, width: "100%" }} onClick={() => join(p)}>
              {p.joinedBy.includes(me.email) ? "Joined ✓" : p.members >= p.seats ? "Team full" : "Request to join"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
