import SectionHead from "../shared/SectionHead";

export default function NotificationsView({ data, persistData }) {
  function markRead(id) { persistData((d) => ({ ...d, notifications: d.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)) })); }
  function markAllRead() { persistData((d) => ({ ...d, notifications: d.notifications.map((n) => ({ ...n, unread: false })) })); }
  return (
    <div className="cc-feed">
      <SectionHead eyebrow="Pigeonhole" title="Notifications" action={<button className="btn-cc-ghost" onClick={markAllRead}>Mark all read</button>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.notifications.map((n) => (
          <div key={n.id} onClick={() => markRead(n.id)} className="cc-card" style={{ padding: 14, cursor: "pointer", borderLeft: n.unread ? "3px solid var(--marigold)" : "1px solid var(--line)" }}>
            <div style={{ fontSize: 13 }}>{n.text}</div>
            <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 4 }}>{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
