import { useState } from "react";
import {
  CheckCircle2,
  Users,
  Activity,
  ShieldAlert
} from "lucide-react";
import Avatar from "../shared/Avatar";
import SectionHead from "../shared/SectionHead";
import StatCard from "../shared/StatCard";
import { SEED_SKILL_STUDENTS } from "../../seedData";

export default function AdminDashboard({ toast }) {
  const [flagged, setFlagged] = useState([]);
  return (
    <div>
      <SectionHead eyebrow="System registrar" title="Admin dashboard" sub="Platform-wide analytics, user management and moderation." />
      <div className="cc-grid-4" style={{ marginBottom: 16 }}>
        <StatCard label="Total users" value="1,842" color="var(--ink)" icon={Users} />
        <StatCard label="Daily active" value="612" color="var(--teal)" icon={Activity} />
        <StatCard label="Pending reports" value="3" color="var(--coral)" icon={ShieldAlert} />
        <StatCard label="Uptime" value="99.9%" color="var(--marigold-d)" icon={CheckCircle2} />
      </div>
      <div className="cc-grid-2">
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>User management</h3>
          {SEED_SKILL_STUDENTS.map((s) => (
            <div key={s.roll} style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--line)", padding: "7px 0" }}>
              <Avatar name={s.name} size={28} />
              <div style={{ flex: 1, fontSize: 12.5 }}>{s.name} <span className="font-mono" style={{ fontSize: 10.5, color: "var(--slate)" }}>#{s.roll}</span></div>
              <button disabled={flagged.includes(s.roll)} className="cc-chip" style={{ color: "var(--coral)", borderColor: "var(--coral)", cursor: "pointer", background: "var(--surface)" }} onClick={() => { setFlagged((f) => [...f, s.roll]); toast("User flagged for review"); }}>
                {flagged.includes(s.roll) ? "Flagged" : "Flag"}
              </button>
            </div>
          ))}
        </div>
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Moderation queue</h3>
          {["Marketplace listing reported as spam", "Lost & Found duplicate entry", "Post flagged: inappropriate language"].map((m) => (
            <div key={m} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", padding: "7px 0", fontSize: 12.5, gap: 8 }}>
              <span>{m}</span><button className="btn-cc-ghost" style={{ padding: "4px 10px", fontSize: 11.5 }} onClick={() => toast("Reviewed")}>Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
