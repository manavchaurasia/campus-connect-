import {
  Calendar,
  FolderKanban,
  Users
} from "lucide-react";
import SectionHead from "../shared/SectionHead";
import StatCard from "../shared/StatCard";
import { SEED_CLUBS } from "../../seedData";

export default function ClubDashboard() {
  return (
    <div>
      <SectionHead eyebrow="Society ledger" title="Club dashboard" sub="Manage communities, events and member communication." />
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <StatCard label="Total members" value="512" color="var(--violet)" icon={Users} />
        <StatCard label="Active clubs" value={SEED_CLUBS.length} color="var(--marigold-d)" icon={FolderKanban} />
        <StatCard label="Events this year" value="61" color="var(--teal)" icon={Calendar} />
      </div>
      <div className="cc-card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
          <thead><tr style={{ textAlign: "left", color: "var(--slate)", fontSize: 11.5, borderBottom: "1px solid var(--line)" }}><th style={{ padding: 12 }}>Club</th><th>Coordinator</th><th>Members</th><th>Events/yr</th></tr></thead>
          <tbody>{SEED_CLUBS.map((c) => <tr key={c.name} style={{ borderBottom: "1px solid var(--line)" }}><td style={{ padding: 12, fontWeight: 700 }}>{c.name}</td><td>{c.coordinator}</td><td>{c.members}</td><td>{c.events}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
