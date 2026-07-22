import { useState } from "react";
import {
  Award,
  CheckCircle2
} from "lucide-react";
import Empty from "../shared/Empty";
import SectionHead from "../shared/SectionHead";
import { SEED_SKILL_STUDENTS } from "../../seedData";

export default function SkillDiscovery() {
  const [filter, setFilter] = useState("");
  const filtered = SEED_SKILL_STUDENTS.filter((s) => !filter || s.skills.some((sk) => sk.toLowerCase().includes(filter.toLowerCase())));
  return (
    <div>
      <SectionHead eyebrow="Talent registry" title="Skill discovery" sub="Faculty and placement officers can search verified student skills and projects." />
      <div style={{ position: "relative", maxWidth: 340, marginBottom: 16 }}>
        <Award size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--slate)" }} />
        <input className="cc-input" style={{ paddingLeft: 34 }} placeholder="e.g. React, Java, Docker…" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      <div className="cc-grid-2">
        {filtered.map((s) => (
          <div key={s.roll} className="cc-card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}>{s.name} {s.verified && <span className="cc-chip" style={{ borderColor: "var(--teal)", color: "var(--teal)", background: "var(--surface)" }}><CheckCircle2 size={11} /> Verified</span>}</div>
            <div className="font-mono" style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>#{s.roll} · {s.projects} projects</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>{s.skills.map((sk) => <span key={sk} className="cc-chip">{sk}</span>)}</div>
          </div>
        ))}
        {filtered.length === 0 && <Empty>No students match this skill yet.</Empty>}
      </div>
    </div>
  );
}
