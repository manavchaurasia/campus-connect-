import {
  Bell,
  Users,
  TrendingUp
} from "lucide-react";
import SectionHead from "../shared/SectionHead";
import StatCard from "../shared/StatCard";

export default function FacultyDashboard({ data, setView }) {
  const announcements = data.posts.filter((p) => p.role === "faculty");
  const batches = [["TY IT — A", 88], ["TY IT — B", 76], ["SY IT — A", 91], ["SY IT — B", 64]];
  return (
    <div>
      <SectionHead eyebrow="Staff desk" title="Faculty dashboard" sub="Publish announcements, manage classes and track participation." action={<button className="btn-cc-accent" onClick={() => setView("home")}>+ New announcement</button>} />
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <StatCard label="Students managed" value="186" color="var(--teal)" icon={Users} />
        <StatCard label="Announcements" value={announcements.length} color="var(--marigold-d)" icon={Bell} />
        <StatCard label="Avg. participation" value="82%" color="var(--coral)" icon={TrendingUp} />
      </div>
      <div className="cc-grid-2">
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Recent announcements</h3>
          {announcements.map((p) => <div key={p.id} style={{ borderBottom: "1px solid var(--line)", padding: "8px 0", fontSize: 12.5 }}>{p.text}</div>)}
        </div>
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Batch participation</h3>
          {batches.map(([b, pct]) => (
            <div key={b} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}><span>{b}</span><span className="font-mono">{pct}%</span></div>
              <div className="cc-progress"><span style={{ width: pct + "%", background: "var(--teal)" }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
