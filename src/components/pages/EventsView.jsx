import {
  MapPin
} from "lucide-react";
import SectionHead from "../shared/SectionHead";

export default function EventsView({ data, persistData, toast }) {
  function toggleRegister(ev) {
    const registered = data.myEventIds.includes(ev.id);
    persistData((d) => ({ ...d, myEventIds: registered ? d.myEventIds.filter((id) => id !== ev.id) : [...d.myEventIds, ev.id], events: d.events.map((e) => (e.id === ev.id ? { ...e, registered: e.registered + (registered ? -1 : 1) } : e)) }));
    toast(registered ? `Unregistered from ${ev.title}` : `Registered for ${ev.title}`);
  }
  return (
    <div>
      <SectionHead eyebrow="Campus calendar" title="Events" sub="Workshops, tournaments and talks happening on campus." />
      <div className="cc-grid-2">
        {data.events.map((ev) => {
          const registered = data.myEventIds.includes(ev.id);
          const full = ev.registered >= ev.cap;
          const pct = Math.round((ev.registered / ev.cap) * 100);
          const stripe = ev.tags.includes("Placement") ? "var(--coral)" : ev.tags.includes("Workshop") ? "var(--violet)" : ev.tags.includes("Online") || ev.tags.includes("Talk") ? "var(--teal)" : "var(--marigold)";
          return (
            <div key={ev.id} className="cc-card pin" style={{ padding: 14, position: "relative", "--stripe": stripe }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }} className="font-display">{ev.title}</div>
                  <div style={{ fontSize: 11.5, color: "var(--slate)", marginTop: 2 }}>{ev.host} · {ev.date} · {ev.time}</div>
                </div>
                <span className="font-mono" style={{ fontSize: 12 }}>{ev.fee}</span>
              </div>
              <p style={{ fontSize: 12.5, marginTop: 8, lineHeight: 1.5 }}>{ev.desc}</p>
              <div style={{ fontSize: 11.5, color: "var(--slate)", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}><MapPin size={12} /> {ev.venue}</div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--slate)", marginBottom: 4 }}><span>{ev.registered}/{ev.cap} registered</span><span>{pct}%</span></div>
                <div className="cc-progress"><span style={{ width: pct + "%" }} /></div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>{ev.tags.map((t) => <span key={t} className="cc-chip" style={{ borderColor: "var(--teal)", color: "var(--teal)", background: "var(--surface)" }}>{t}</span>)}</div>
              <button
                disabled={!registered && full}
                className={registered ? "btn-cc-danger" : "btn-cc-accent"}
                style={{ marginTop: 10, width: "100%" }}
                onClick={() => toggleRegister(ev)}
              >
                {registered ? "Cancel registration" : full ? "Full" : "Register now"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
