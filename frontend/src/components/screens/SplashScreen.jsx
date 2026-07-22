import { COLLEGE } from "../../constants";

export default function SplashScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#0F172A 0%,#1E293B 60%,#0F172A 100%)" }}>
      <div className="cc-rise" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ width: 68, height: 68, borderRadius: 14, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M4 7l8-4 8 4-8 4-8-4z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><path d="M7 10.5V16c0 1 2.2 2.5 5 2.5s5-1.5 5-2.5v-5.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 8v6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="font-display" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.01em", color: "#fff" }}>CampusConnect</div>
          <div className="font-mono" style={{ fontSize: 10.5, color: "#93A5C4", marginTop: 8, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 600 }}>{COLLEGE}</div>
        </div>
        <div style={{ width: 130, height: 4, borderRadius: 99, background: "rgba(255,255,255,.14)", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#2563EB", animation: "ccLoad 1.2s ease forwards" }} />
        </div>
      </div>
    </div>
  );
}

/* ============================== AUTH SCREENS ============================= */
