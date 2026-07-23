import { useState } from "react";
import { Users, Activity, ShieldAlert, CheckCircle2, Flag, Trash2 } from "lucide-react";
import Avatar from "../shared/Avatar";
import RoleBadge from "../shared/RoleBadge";
import SectionHead from "../shared/SectionHead";
import StatCard from "../shared/StatCard";
import Empty from "../shared/Empty";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "users", label: "Users" },
  { key: "content", label: "Content" },
  { key: "moderation", label: "Moderation" },
];

export default function AdminDashboard({ me, data, persistData, toast, users, deleteUser }) {
  const [tab, setTab] = useState("overview");
  const posts = data.posts || [];
  const market = data.market || [];
  const moderationQueue = data.moderationQueue || [];
  const flaggedUsers = data.flaggedUsers || [];

  function toggleFlagUser(email) {
    const isFlagged = flaggedUsers.includes(email);
    persistData((d) => ({
      ...d,
      flaggedUsers: isFlagged ? d.flaggedUsers.filter((e) => e !== email) : [...(d.flaggedUsers || []), email],
    }));
    toast(isFlagged ? "Account unflagged" : "Account flagged for review");
  }

  function removePost(id) {
    persistData((d) => ({ ...d, posts: d.posts.filter((p) => p.id !== id) }));
    toast("Post removed");
  }

  function removeListing(id) {
    persistData((d) => ({ ...d, market: d.market.filter((m) => m.id !== id) }));
    toast("Listing removed");
  }

  function reviewQueueItem(id) {
    persistData((d) => ({ ...d, moderationQueue: d.moderationQueue.filter((q) => q.id !== id) }));
    toast("Marked as reviewed");
  }

  return (
    <div>
      <SectionHead eyebrow="System registrar · Admin-only access" title="Admin dashboard" sub="Platform-wide analytics, user management and moderation." />

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button key={t.key} className={`cc-tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}{t.key === "moderation" && moderationQueue.length > 0 ? ` (${moderationQueue.length})` : ""}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="cc-grid-4">
          <StatCard label="Registered users" value={users.length} color="var(--ink)" icon={Users} />
          <StatCard label="Total posts" value={posts.length} color="var(--teal)" icon={Activity} />
          <StatCard label="Marketplace listings" value={market.length} color="var(--marigold-d)" icon={CheckCircle2} />
          <StatCard label="Pending reports" value={moderationQueue.length} color="var(--coral)" icon={ShieldAlert} />
        </div>
      )}

      {tab === "users" && (
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Registered accounts</h3>
          <p style={{ fontSize: 11.5, color: "var(--slate)", marginBottom: 12 }}>Every account currently registered on this device — flag suspicious accounts or remove them entirely.</p>
          {users.map((u) => {
            const flagged = flaggedUsers.includes(u.email);
            const isSelf = u.email === me.email;
            return (
              <div key={u.email} style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--line)", padding: "10px 0" }}>
                <Avatar name={u.name} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 12.5 }}>{u.name}</span>
                    <RoleBadge role={u.role} />
                    {isSelf && <span className="cc-chip">You</span>}
                  </div>
                  <div className="font-mono" style={{ fontSize: 10.5, color: "var(--slate)", marginTop: 2 }}>{u.email} · #{u.roll}</div>
                </div>
                <button className="cc-chip" style={{ cursor: "pointer", color: flagged ? "var(--coral)" : "var(--slate)", borderColor: flagged ? "var(--coral)" : "var(--line)" }} onClick={() => toggleFlagUser(u.email)}>
                  <Flag size={11} /> {flagged ? "Flagged" : "Flag"}
                </button>
                <button className="btn-cc-danger" style={{ padding: "6px 10px", fontSize: 11.5, opacity: isSelf ? 0.4 : 1, cursor: isSelf ? "not-allowed" : "pointer" }} disabled={isSelf} onClick={() => deleteUser(u.email)}>
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
          {users.length === 0 && <Empty>No registered accounts yet.</Empty>}
        </div>
      )}

      {tab === "content" && (
        <div className="cc-grid-2">
          <div className="cc-card" style={{ padding: 16 }}>
            <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Posts ({posts.length})</h3>
            {posts.map((p) => (
              <div key={p.id} style={{ borderBottom: "1px solid var(--line)", padding: "8px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.authorName}</div>
                    <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.text}</div>
                  </div>
                  <button className="btn-cc-danger" style={{ padding: "4px 8px", fontSize: 11, flex: "none" }} onClick={() => removePost(p.id)}>Remove</button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <Empty>No posts on the platform.</Empty>}
          </div>
          <div className="cc-card" style={{ padding: 16 }}>
            <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Marketplace listings ({market.length})</h3>
            {market.map((m) => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, borderBottom: "1px solid var(--line)", padding: "8px 0" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{m.price} · sold by {m.seller}</div>
                </div>
                <button className="btn-cc-danger" style={{ padding: "4px 8px", fontSize: 11, flex: "none" }} onClick={() => removeListing(m.id)}>Remove</button>
              </div>
            ))}
            {market.length === 0 && <Empty>No marketplace listings.</Empty>}
          </div>
        </div>
      )}

      {tab === "moderation" && (
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Moderation queue</h3>
          {moderationQueue.map((q) => (
            <div key={q.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", padding: "10px 0", gap: 8 }}>
              <span style={{ fontSize: 13 }}>{q.text}</span>
              <button className="btn-cc-ghost" style={{ padding: "5px 12px", fontSize: 11.5, flex: "none" }} onClick={() => reviewQueueItem(q.id)}>Mark reviewed</button>
            </div>
          ))}
          {moderationQueue.length === 0 && <Empty>Queue is clear — nothing needs review.</Empty>}
        </div>
      )}
    </div>
  );
}
