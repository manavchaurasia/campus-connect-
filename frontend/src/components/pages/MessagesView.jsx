import { useState } from "react";
import {
  Send
} from "lucide-react";
import SectionHead from "../shared/SectionHead";

export default function MessagesView({ data, persistData }) {
  const [active, setActive] = useState(0);
  const [draft, setDraft] = useState("");
  const thread = data.threads[active];

  function send() {
    if (!draft.trim()) return;
    persistData((d) => ({ ...d, threads: d.threads.map((t, i) => (i === active ? { ...t, messages: [...t.messages, { from: "me", text: draft.trim() }] } : t)) }));
    setDraft("");
  }

  return (
    <div className="cc-panel">
      <SectionHead eyebrow="Mailroom" title="Messages" />
      <div className="cc-card" style={{ display: "flex", minHeight: 420, overflow: "hidden" }}>
        <div style={{ width: 180, borderRight: "1px solid var(--line)", flex: "none" }}>
          {data.threads.map((t, i) => (
            <div key={t.id} onClick={() => setActive(i)} style={{ padding: 12, cursor: "pointer", background: i === active ? "var(--chalk-2)" : "transparent", borderBottom: "1px solid var(--line)" }}>
              <div style={{ fontWeight: 700, fontSize: 12.5 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: "var(--slate)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.messages[t.messages.length - 1]?.text}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 12, borderBottom: "1px solid var(--line)", fontWeight: 700, fontSize: 13 }}>{thread.name}</div>
          <div style={{ flex: 1, padding: 12, overflowY: "auto", maxHeight: 300 }}>
            {thread.messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start", marginBottom: 8 }}>
                <div style={{ background: m.from === "me" ? "var(--ink-solid)" : "var(--chalk-2)", color: m.from === "me" ? "#fff" : "var(--ink)", padding: "8px 12px", borderRadius: 10, maxWidth: "75%", fontSize: 12.5 }}>{m.text}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid var(--line)" }}>
            <input className="cc-input" placeholder={`Message ${thread.name}…`} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
            <button className="btn-cc-accent" onClick={send}><Send size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
