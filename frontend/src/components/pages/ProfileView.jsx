import { useState } from "react";
import {
  CheckCircle2
} from "lucide-react";
import Empty from "../shared/Empty";
import RoleBadge from "../shared/RoleBadge";
import SectionHead from "../shared/SectionHead";
import { avatarColor, initials } from "../../utils";

export default function ProfileView({ me, updateMe, data, toast, onNavigate }) {
  const [bio, setBio] = useState(me.bio || "");
  const [skillsText, setSkillsText] = useState((me.skills || []).join(", "));
  const [editing, setEditing] = useState(false);
  const mySaved = data.posts.filter((p) => p.savedBy.includes(me.email));

  function save() { updateMe({ bio, skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean) }); setEditing(false); toast("Profile updated"); }

  return (
    <div>
      <SectionHead eyebrow="Student dossier" title="My profile" />
      <div className="cc-two-col">
        <div>
          <div className="cc-card" style={{ overflow: "hidden", marginBottom: 20 }}>
            <div style={{ height: 60, background: "linear-gradient(120deg,#0F172A,#1E293B)" }} />
            <div style={{ padding: 16, marginTop: -30 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
                <div style={{ width: 64, height: 64, borderRadius: 14, border: "3px solid var(--surface)", background: avatarColor(me.name), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20 }} className="font-display">{initials(me.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><span className="font-display" style={{ fontWeight: 700, fontSize: 18 }}>{me.name}</span><RoleBadge role={me.role} /></div>
                  <div className="font-mono" style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>#{me.roll} · {me.dept} · {me.email}</div>
                </div>
                {!editing && <button className="btn-cc-ghost" onClick={() => setEditing(true)}>Edit profile</button>}
              </div>
              {!editing ? (
                <>
                  <p style={{ fontSize: 13.5, marginTop: 14 }}>{me.bio || "No bio yet — tell people what you're building."}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{(me.skills || []).map((s) => <span key={s} className="cc-chip" style={{ borderColor: "var(--teal)", color: "var(--teal)", background: "var(--surface)" }}><CheckCircle2 size={11} /> {s}</span>)}</div>
                </>
              ) : (
                <div style={{ marginTop: 14 }}>
                  <label className="cc-label">Bio</label>
                  <textarea className="cc-input" style={{ marginTop: 5, marginBottom: 10 }} value={bio} onChange={(e) => setBio(e.target.value)} />
                  <label className="cc-label">Skills (comma separated)</label>
                  <input className="cc-input" style={{ marginTop: 5, marginBottom: 10 }} value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
                  <button className="btn-cc-accent" onClick={save}>Save changes</button>
                  <button className="btn-cc-ghost" style={{ marginLeft: 8 }} onClick={() => setEditing(false)}>Cancel</button>
                </div>
              )}
            </div>
          </div>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Saved posts</h3>
          {mySaved.length === 0 && <Empty>Posts you save will show up here — tap the bookmark icon on any post.</Empty>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mySaved.map((p) => <div key={p.id} className="cc-card" style={{ padding: 14, fontSize: 13 }}><b>{p.authorName}:</b> {p.text}</div>)}
          </div>
        </div>

        <div className="cc-rail">
          <div className="cc-card cc-rail-card">
            <div className="cc-rail-title">Account snapshot</div>
            <div className="cc-rail-row"><span>Roll no.</span><span className="font-mono">#{me.roll}</span></div>
            <div className="cc-rail-row"><span>Department</span><span>{me.dept}</span></div>
            <div className="cc-rail-row"><span>Skills listed</span><span className="font-mono" style={{ fontWeight: 700 }}>{(me.skills || []).length}</span></div>
            <div className="cc-rail-row"><span>Saved posts</span><span className="font-mono" style={{ fontWeight: 700 }}>{mySaved.length}</span></div>
          </div>
          <div className="cc-card cc-rail-card">
            <div className="cc-rail-title">Quick links</div>
            <button className="btn-cc-ghost" style={{ width: "100%", marginBottom: 8 }} onClick={() => onNavigate && onNavigate("settings")}>Account settings</button>
            <button className="btn-cc-ghost" style={{ width: "100%" }} onClick={() => onNavigate && onNavigate("skill")}>Skill discovery</button>
          </div>
        </div>
      </div>
    </div>
  );
}
