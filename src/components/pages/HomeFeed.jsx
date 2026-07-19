import { useState } from "react";
import {
  Home,
  Heart,
  MessageCircle,
  Bookmark,
  Send
} from "lucide-react";
import Avatar from "../shared/Avatar";
import RoleBadge from "../shared/RoleBadge";
import SectionHead from "../shared/SectionHead";
import TagChip from "../shared/TagChip";
import { COLLEGE, ROLE_META } from "../../constants";
import { avatarColor, initials, uid } from "../../utils";

export default function HomeFeed({ me, data, persistData, toast, onNavigate }) {
  const [draft, setDraft] = useState("");
  const [commentDraft, setCommentDraft] = useState({});
  const [openComments, setOpenComments] = useState({});

  function addPost() {
    if (!draft.trim()) return;
    persistData((d) => ({ ...d, posts: [{ id: uid(), authorEmail: me.email, authorName: me.name, role: me.role, dept: me.dept, time: "just now", text: draft.trim(), tag: "Update", likedBy: [], comments: [], savedBy: [] }, ...d.posts] }));
    setDraft(""); toast("Post published");
  }
  function toggleLike(id) {
    persistData((d) => ({ ...d, posts: d.posts.map((p) => p.id !== id ? p : { ...p, likedBy: p.likedBy.includes(me.email) ? p.likedBy.filter((e) => e !== me.email) : [...p.likedBy, me.email] }) }));
  }
  function toggleSave(id) {
    persistData((d) => ({ ...d, posts: d.posts.map((p) => p.id !== id ? p : { ...p, savedBy: p.savedBy.includes(me.email) ? p.savedBy.filter((e) => e !== me.email) : [...p.savedBy, me.email] }) }));
  }
  function addComment(id) {
    const text = (commentDraft[id] || "").trim();
    if (!text) return;
    persistData((d) => ({ ...d, posts: d.posts.map((p) => (p.id === id ? { ...p, comments: [...p.comments, { a: me.name, t: text }] } : p)) }));
    setCommentDraft((c) => ({ ...c, [id]: "" }));
  }

  const savedCount = data.posts.filter((p) => p.savedBy.includes(me.email)).length;
  const upcomingEvents = data.events.slice(0, 3);

  return (
    <div>
      <SectionHead eyebrow="Bulletin board" title="Home feed" />
      <div className="cc-card" style={{ padding: "24px 26px", marginBottom: 16, background: "linear-gradient(135deg,#0F172A 0%,#1E3A8A 100%)", border: "none", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -36, top: -36, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
        <div style={{ position: "absolute", right: 48, bottom: -46, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.05)" }} />
        <div style={{ position: "relative" }}>
          <div className="font-mono" style={{ fontSize: 10.5, color: "#93B4EF", textTransform: "uppercase", letterSpacing: ".14em", fontWeight: 600 }}>Welcome back</div>
          <div className="font-display" style={{ color: "#fff", fontSize: 25, fontWeight: 800, marginTop: 6 }}>Good to see you, {me.name.split(" ")[0]}</div>
          <p style={{ color: "rgba(255,255,255,.72)", fontSize: 13, marginTop: 6, maxWidth: 440 }}>Here's what's happening across {COLLEGE} today.</p>
        </div>
      </div>
      <div className="cc-two-col">
        <div>
          <div className="cc-card" style={{ padding: 14, marginBottom: 16 }}>
            <textarea className="cc-input" rows={2} placeholder="Share an update, achievement, or announcement…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button className="btn-cc-accent" onClick={addPost}>Publish</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {data.posts.map((p) => {
              const liked = p.likedBy.includes(me.email);
              const saved = p.savedBy.includes(me.email);
              const open = !!openComments[p.id];
              const stripe = (ROLE_META[p.role] || ROLE_META.student).color;
              return (
                <div key={p.id} className="cc-card pin cc-rise" style={{ padding: 16, "--stripe": stripe }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <Avatar name={p.authorName} size={42} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5 }}>{p.authorName}</span>
                        <RoleBadge role={p.role} />
                        <span style={{ fontSize: 11.5, color: "var(--slate)" }}>· {p.dept} · {p.time}</span>
                      </div>
                      <div style={{ marginTop: 6 }}><TagChip label={p.tag} /></div>
                      <p style={{ fontSize: 13.5, marginTop: 8, lineHeight: 1.55 }}>{p.text}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                        <button onClick={() => toggleLike(p.id)} style={{ background: "none", border: 0, display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: liked ? "var(--marigold-d)" : "var(--slate)" }}>
                          <Heart size={15} fill={liked ? "currentColor" : "none"} /> {p.likedBy.length}
                        </button>
                        <button onClick={() => setOpenComments((o) => ({ ...o, [p.id]: !o[p.id] }))} style={{ background: "none", border: 0, display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: "var(--slate)" }}>
                          <MessageCircle size={15} /> {p.comments.length}
                        </button>
                        <button onClick={() => toggleSave(p.id)} style={{ marginLeft: "auto", background: "none", border: 0, display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: saved ? "var(--marigold-d)" : "var(--slate)" }}>
                          <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
                        </button>
                      </div>
                      {open && (
                        <div style={{ marginTop: 10 }} className="cc-rise">
                          {p.comments.map((c, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                              <div style={{ width: 22, height: 22, borderRadius: 6, background: avatarColor(c.a), color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{initials(c.a)}</div>
                              <div style={{ fontSize: 12.5, background: "var(--chalk-2)", borderRadius: 8, padding: "6px 10px", flex: 1 }}><b>{c.a}</b> {c.t}</div>
                            </div>
                          ))}
                          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                            <input className="cc-input" style={{ padding: "6px 10px" }} placeholder="Write a comment…" value={commentDraft[p.id] || ""} onChange={(e) => setCommentDraft((c) => ({ ...c, [p.id]: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addComment(p.id)} />
                            <button className="btn-cc-ghost" style={{ padding: "6px 12px" }} onClick={() => addComment(p.id)}><Send size={13} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cc-rail">
          <div className="cc-card cc-rail-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={me.name} size={40} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{me.name}</div>
                <div className="font-mono" style={{ fontSize: 10.5, color: "var(--slate)" }}>#{me.roll} · {me.dept}</div>
              </div>
            </div>
            <button className="btn-cc-ghost" style={{ width: "100%", marginTop: 12 }} onClick={() => onNavigate && onNavigate("profile")}>View profile</button>
          </div>

          <div className="cc-card cc-rail-card">
            <div className="cc-rail-title">Your activity</div>
            <div className="cc-rail-row"><span>Saved posts</span><span className="font-mono" style={{ fontWeight: 700 }}>{savedCount}</span></div>
            <div className="cc-rail-row"><span>Event registrations</span><span className="font-mono" style={{ fontWeight: 700 }}>{data.myEventIds.length}</span></div>
            <div className="cc-rail-row"><span>Job applications</span><span className="font-mono" style={{ fontWeight: 700 }}>{data.myApplications.length}</span></div>
          </div>

          <div className="cc-card cc-rail-card">
            <div className="cc-rail-title">Upcoming events</div>
            {upcomingEvents.map((ev) => (
              <div key={ev.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ fontWeight: 600, fontSize: 12.5 }}>{ev.title}</div>
                <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{ev.date} · {ev.venue}</div>
              </div>
            ))}
            <button className="btn-cc-ghost" style={{ width: "100%", marginTop: 10 }} onClick={() => onNavigate && onNavigate("events")}>View all events</button>
          </div>
        </div>
      </div>
    </div>
  );
}
