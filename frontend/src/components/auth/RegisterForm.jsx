import { useState } from "react";
import { COLLEGE, ROLE_META } from "../../constants";

export default function RegisterForm({ onRegister, setAuthStep }) {
  const [form, setForm] = useState({ name: "", email: "", roll: "", role: "student", password: "", dept: "" });
  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }
  function submit(e) {
    e.preventDefault();
    if (!form.email.endsWith("@tcsc.edu.in")) { alert("Only @tcsc.edu.in emails can register."); return; }
    onRegister({ ...form, dept: form.dept || "Not specified", bio: "", skills: [] });
  }
  return (
    <form onSubmit={submit}>
      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 23, color: "var(--ink)" }}>Create your account</h2>
      <p style={{ fontSize: 13.5, color: "var(--slate)", marginTop: 4 }}>Only verified {COLLEGE} emails can register.</p>
      <div style={{ marginTop: 18 }}><label className="cc-label">Full name</label><input required className="cc-input" style={{ marginTop: 5 }} placeholder="e.g. Parth Gupta" value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
      <div style={{ marginTop: 12 }}><label className="cc-label">College email</label><input required type="email" className="cc-input" style={{ marginTop: 5 }} placeholder="yourname@tcsc.edu.in" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <div style={{ flex: 1 }}><label className="cc-label">Roll no.</label><input required className="cc-input" style={{ marginTop: 5 }} placeholder="261777" value={form.roll} onChange={(e) => set("roll", e.target.value)} /></div>
        <div style={{ flex: 1 }}>
          <label className="cc-label">Role</label>
          <select className="cc-input" style={{ marginTop: 5 }} value={form.role} onChange={(e) => set("role", e.target.value)}>
            {Object.entries(ROLE_META).filter(([k]) => k !== "admin").map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <p style={{ fontSize: 10.5, color: "var(--slate)", marginTop: 4 }}>Admin accounts are provisioned by the college, not self-registered.</p>
        </div>
      </div>
      <div style={{ marginTop: 12 }}><label className="cc-label">Password</label><input required type="password" className="cc-input" style={{ marginTop: 5 }} placeholder="Create a password" value={form.password} onChange={(e) => set("password", e.target.value)} /></div>
      <button className="btn-cc-accent" style={{ width: "100%", marginTop: 18 }}>Create account</button>
      <p style={{ fontSize: 13.5, textAlign: "center", marginTop: 16 }}>Already registered? <a href="#" onClick={(e) => { e.preventDefault(); setAuthStep("login"); }} style={{ fontWeight: 700, color: "var(--marigold-d)" }}>Sign in</a></p>
    </form>
  );
}
