import {
  Briefcase,
  Award,
  Users,
  TrendingUp
} from "lucide-react";
import SectionHead from "../shared/SectionHead";
import StatCard from "../shared/StatCard";
import { SEED_SKILL_STUDENTS } from "../../seedData";

export default function PlacementDashboard({ data, setView }) {
  return (
    <div>
      <SectionHead eyebrow="T&P control room" title="Placement Cell dashboard" sub="Post opportunities, search talent and track drive performance." action={<button className="btn-cc-accent" onClick={() => setView("placement")}>Manage drives</button>} />
      <div className="cc-grid-4" style={{ marginBottom: 16 }}>
        <StatCard label="Open drives" value={data.jobs.length} color="var(--coral)" icon={Briefcase} />
        <StatCard label="Total applicants" value={data.jobs.reduce((s, j) => s + j.applicants, 0)} color="var(--marigold-d)" icon={Users} />
        <StatCard label="Placed this year" value="112" color="var(--teal)" icon={Award} />
        <StatCard label="Avg. CTC" value="₹5.4 LPA" color="var(--ink)" icon={TrendingUp} />
      </div>
      <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Top skill matches</h3>
      <div className="cc-grid-2">
        {SEED_SKILL_STUDENTS.slice(0, 4).map((s) => (
          <div key={s.roll} className="cc-card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>{s.skills.map((sk) => <span key={sk} className="cc-chip">{sk}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
