import {
  Sun,
  Moon
} from "lucide-react";
import SectionHead from "../shared/SectionHead";
import { ROLE_META } from "../../constants";

export default function SettingsView({ me, data, persistData, role, setRole, logout, setView, theme, toggleTheme }) {
  function toggle(key) { persistData((d) => ({ ...d, settings: { ...d.settings, [key]: !d.settings[key] } })); }
  const notifRows = [["notifEvents", "Event reminders"], ["notifPlacement", "Placement alerts"], ["notifFaculty", "Faculty announcements"], ["notifDM", "Direct messages"], ["notifMarket", "Marketplace activity"]];
  const privRows = [["privPortfolio", "Show my portfolio to Placement Cell"], ["privEmail", "Show my email on profile"], ["privClubDM", "Allow direct messages from Clubs"]];

  return (
    <div>
      <SectionHead eyebrow="Office admin" title="Settings" sub="Manage your account, privacy and preview role dashboards." />
      <div className="cc-grid-2">
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Appearance</h3>
          <p style={{ fontSize: 11.5, color: "var(--slate)", marginBottom: 10 }}>Choose how CampusConnect looks on this device.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className={theme === "light" ? "btn-cc-primary" : "btn-cc-ghost"} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => theme !== "light" && toggleTheme()}>
              <Sun size={14} /> Light
            </button>
            <button className={theme === "dark" ? "btn-cc-primary" : "btn-cc-ghost"} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => theme !== "dark" && toggleTheme()}>
              <Moon size={14} /> Dark
            </button>
          </div>
        </div>
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Notifications</h3>
          {notifRows.map(([k, label]) => (
            <label key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
              <span>{label}</span><input type="checkbox" checked={data.settings[k]} onChange={() => toggle(k)} />
            </label>
          ))}
        </div>
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Privacy</h3>
          {privRows.map(([k, label]) => (
            <label key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
              <span>{label}</span><input type="checkbox" checked={data.settings[k]} onChange={() => toggle(k)} />
            </label>
          ))}
        </div>
        <div className="cc-card" style={{ padding: 16, gridColumn: "1 / -1" }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Preview as role</h3>
          <p style={{ fontSize: 11.5, color: "var(--slate)", marginBottom: 10 }}>View-only preview for your demo — doesn't change your account.</p>
          <div className="cc-grid-4">
            {Object.entries(ROLE_META).filter(([k]) => k !== "admin" || me.role === "admin").map(([k, v]) => (
              <button key={k} className={role === k ? "btn-cc-primary" : "btn-cc-ghost"} onClick={() => { setRole(k); setView("home"); }}>{v.label}</button>
            ))}
          </div>
          {me.role !== "admin" && (
            <p style={{ fontSize: 10.5, color: "var(--slate)", marginTop: 8 }}>The Admin dashboard is restricted to accounts provisioned as Admin.</p>
          )}
          <button className="btn-cc-danger" style={{ width: "100%", marginTop: 14 }} onClick={logout}>Log out</button>
        </div>
      </div>
    </div>
  );
}
