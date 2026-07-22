import { useState } from "react";
import {
  Search as SearchIcon,
  CheckCircle2
} from "lucide-react";
import Avatar from "../shared/Avatar";
import Empty from "../shared/Empty";
import SectionHead from "../shared/SectionHead";
import { SEED_SKILL_STUDENTS } from "../../seedData";

export default function ExplorePeople() {
  const [q, setQ] = useState("");
  const people = SEED_SKILL_STUDENTS.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <SectionHead eyebrow="Student directory" title="Explore people" sub="Find students, faculty and clubs across campus." />
      <div style={{ position: "relative", maxWidth: 340, marginBottom: 16 }}>
        <SearchIcon size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--slate)" }} />
        <input className="cc-input" style={{ paddingLeft: 34 }} placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="cc-grid-2">
        {people.map((s) => (
          <div key={s.roll} className="cc-card" style={{ padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar name={s.name} size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", gap: 5 }}>{s.name} {s.verified && <CheckCircle2 size={14} color="var(--teal)" />}</div>
              <div className="font-mono" style={{ fontSize: 11, color: "var(--slate)" }}>#{s.roll} · {s.projects} projects</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>{s.skills.map((sk) => <span key={sk} className="cc-chip">{sk}</span>)}</div>
            </div>
          </div>
        ))}
        {people.length === 0 && <Empty>No one matches "{q}".</Empty>}
      </div>
    </div>
  );
}
