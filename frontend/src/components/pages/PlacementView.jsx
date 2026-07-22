import {
  Briefcase,
  CheckCircle2
} from "lucide-react";
import SectionHead from "../shared/SectionHead";
import StatCard from "../shared/StatCard";

export default function PlacementView({ data, persistData, toast }) {
  function apply(job) {
    if (data.myApplications.includes(job.id)) return;
    persistData((d) => ({ ...d, myApplications: [...d.myApplications, job.id], jobs: d.jobs.map((j) => (j.id === job.id ? { ...j, applicants: j.applicants + 1 } : j)) }));
    toast(`Applied to ${job.company} — ${job.role}`);
  }
  return (
    <div>
      <SectionHead eyebrow="T&P office" title="Placement hub" sub="Track drives, applications and internship listings in one place." />
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <StatCard label="Open drives" value={data.jobs.length} color="var(--coral)" icon={Briefcase} />
        <StatCard label="My applications" value={data.myApplications.length} color="var(--marigold-d)" icon={CheckCircle2} />
      </div>
      <div className="cc-card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 540 }}>
          <thead><tr style={{ textAlign: "left", color: "var(--slate)", fontSize: 11.5, borderBottom: "1px solid var(--line)" }}>
            <th style={{ padding: 12 }}>Company</th><th>Role</th><th>CTC</th><th>Deadline</th><th>Applicants</th><th></th>
          </tr></thead>
          <tbody>
            {data.jobs.map((j) => {
              const applied = data.myApplications.includes(j.id);
              return (
                <tr key={j.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: 12, fontWeight: 700 }}>{j.company}</td>
                  <td>{j.role}</td>
                  <td className="font-mono" style={{ fontSize: 12 }}>{j.ctc}</td>
                  <td style={{ fontSize: 12, color: "var(--slate)" }}>{j.deadline}</td>
                  <td>{j.applicants}</td>
                  <td style={{ padding: 12 }}>
                    <button disabled={applied} className={applied ? "cc-chip" : "btn-cc-accent"} style={applied ? { color: "var(--teal)", borderColor: "var(--teal)" } : { padding: "6px 12px" }} onClick={() => apply(j)}>
                      {applied ? "Applied ✓" : "Apply"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
