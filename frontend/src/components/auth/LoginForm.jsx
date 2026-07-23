import { useState } from "react";

export default function LoginForm({ onLogin, setAuthStep }) {
  const [email, setEmail] = useState("parth.gupta@tcsc.edu.in");
  const [password, setPassword] = useState("campus123");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }}>
      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 23, color: "var(--ink)" }}>Sign in</h2>
      <p style={{ fontSize: 13.5, color: "var(--slate)", marginTop: 4 }}>Use your institutional email to continue.</p>
      <div style={{ marginTop: 22 }}>
        <label className="cc-label">College email</label>
        <input required type="email" className="cc-input" style={{ marginTop: 5 }} value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ marginTop: 12 }}>
        <label className="cc-label">Password</label>
        <input required type="password" className="cc-input" style={{ marginTop: 5 }} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 12 }}>
        <label style={{ display: "flex", gap: 6, alignItems: "center", color: "var(--slate)" }}><input type="checkbox" defaultChecked /> Keep me signed in</label>
        <a href="#" onClick={(e) => { e.preventDefault(); setAuthStep("forgot"); }} style={{ fontWeight: 600, color: "var(--ink)" }}>Forgot password?</a>
      </div>
      <button className="btn-cc-primary" style={{ width: "100%", marginTop: 18 }}>Sign in</button>
      <p style={{ fontSize: 11.5, textAlign: "center", color: "var(--slate)", marginTop: 12 }}>Demo account pre-filled — or create your own below.</p>
      <p style={{ fontSize: 11.5, textAlign: "center", color: "var(--slate)", marginTop: 4 }}>Admin demo login: <span className="font-mono">admin@tcsc.edu.in</span> / <span className="font-mono">admin123</span></p>
      <p style={{ fontSize: 13.5, textAlign: "center", marginTop: 16 }}>New here? <a href="#" onClick={(e) => { e.preventDefault(); setAuthStep("register"); }} style={{ fontWeight: 700, color: "var(--marigold-d)" }}>Create an account</a></p>
    </form>
  );
}
