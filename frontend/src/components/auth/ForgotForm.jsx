import { useState } from "react";
import {
  Send
} from "lucide-react";

export default function ForgotForm({ setAuthStep, toast }) {
  const [email, setEmail] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); toast("Reset link sent to " + email); setAuthStep("login"); }}>
      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 23, color: "var(--ink)" }}>Reset password</h2>
      <p style={{ fontSize: 13.5, color: "var(--slate)", marginTop: 4 }}>We'll email you a secure reset link.</p>
      <div style={{ marginTop: 18 }}><label className="cc-label">College email</label><input required type="email" className="cc-input" style={{ marginTop: 5 }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@tcsc.edu.in" /></div>
      <button className="btn-cc-primary" style={{ width: "100%", marginTop: 18 }}>Send reset link</button>
      <p style={{ fontSize: 13.5, textAlign: "center", marginTop: 16 }}><a href="#" onClick={(e) => { e.preventDefault(); setAuthStep("login"); }} style={{ fontWeight: 700, color: "var(--marigold-d)" }}>← Back to sign in</a></p>
    </form>
  );
}

/* ================================ MAIN APP ================================ */
