import {
  Sun,
  Moon
} from "lucide-react";
import ForgotForm from "./ForgotForm";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ToastWrap from "../shared/ToastWrap";
import { COLLEGE } from "../../constants";

export default function AuthShell({ authStep, setAuthStep, onLogin, onRegister, toast, toasts, theme, toggleTheme }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", position: "relative" }}>
      <ToastWrap toasts={toasts} />
      <button
        className="btn-cc-ghost"
        style={{ position: "absolute", top: 16, right: 16, zIndex: 20, padding: "7px 9px", display: "flex", alignItems: "center" }}
        onClick={toggleTheme}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <div className="d-none-mobile" style={{ width: "44%", background: "linear-gradient(160deg,#0F172A 0%,#1E293B 55%,#0F172A 100%)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 52 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontWeight: 700, fontSize: 16 }} className="font-display">
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 7l8-4 8 4-8 4-8-4z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" /></svg>
          </div>
          CampusConnect
        </div>
        <div>
          <div className="font-mono" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 10.5, fontWeight: 600, color: "#93A5C4", border: "1px solid rgba(255,255,255,.18)", padding: "4px 10px", borderRadius: 6, letterSpacing: 1.2, marginBottom: 18, textTransform: "uppercase" }}>
            Campus Portal · {COLLEGE}
          </div>
          <h1 className="font-display" style={{ color: "#fff", fontSize: 36, fontWeight: 800, letterSpacing: "-.01em", lineHeight: 1.15, maxWidth: 400 }}>One system of record for the entire campus.</h1>
          <p style={{ color: "rgba(255,255,255,.62)", fontSize: 13.5, marginTop: 18, maxWidth: 360 }}>Announcements, portfolios, events, placements and clubs — verified, role-aware, and unified in one place.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Students", "Faculty", "Clubs", "Placement Cell", "Admin"].map((r) => (
            <span key={r} className="cc-chip" style={{ background: "rgba(255,255,255,.06)", color: "#CBD5E1", borderColor: "rgba(255,255,255,.16)" }}>{r}</span>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--chalk)" }}>
        <div className="cc-rise" style={{ width: "100%", maxWidth: 380 }}>
          {authStep === "login" && <LoginForm onLogin={onLogin} setAuthStep={setAuthStep} />}
          {authStep === "register" && <RegisterForm onRegister={onRegister} setAuthStep={setAuthStep} />}
          {authStep === "forgot" && <ForgotForm setAuthStep={setAuthStep} toast={toast} />}
        </div>
      </div>
    </div>
  );
}
