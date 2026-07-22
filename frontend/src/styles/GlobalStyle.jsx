export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');
      html, body{ margin:0; padding:0; height:100%; width:100%; }
      body{ display:block !important; place-items:unset !important; }
      #root, #app{ width:100%; min-height:100vh; margin:0; padding:0; max-width:none; text-align:initial; display:block; }
      .cc-root{ --ink:#0F172A; --ink-2:#020617; --ink-solid:#0F172A; --chalk:#F7F8FA; --chalk-2:#EEF1F5; --surface:#FFFFFF;
        --marigold:#2563EB; --marigold-d:#1D4ED8; --teal:#0D9488; --coral:#B45309; --violet:#7C3AED; --pink:#BE185C;
        --slate:#64748B; --line:#E2E8F0;
        font-family:'Inter',sans-serif; background:
          radial-gradient(700px circle at 12% -8%, rgba(37,99,235,.07), transparent 60%),
          radial-gradient(600px circle at 100% 0%, rgba(124,58,237,.05), transparent 55%),
          var(--chalk);
        color:var(--ink);
        width:100%; min-height:100vh; transition:background .15s ease, color .15s ease; }
      .cc-root.theme-dark{ --ink:#E7ECF3; --ink-2:#FFFFFF; --chalk:#0B1220; --chalk-2:#141F32; --surface:#111A2B;
        --marigold:#3B82F6; --marigold-d:#60A5FA; --teal:#2DD4BF; --coral:#F59E0B; --violet:#A78BFA; --pink:#F472B6;
        --slate:#8B99AE; --line:#243248; }
      .cc-root.theme-dark{ background:
          radial-gradient(700px circle at 12% -8%, rgba(59,130,246,.10), transparent 60%),
          radial-gradient(600px circle at 100% 0%, rgba(167,139,250,.07), transparent 55%),
          var(--chalk); }
      .cc-root *{ box-sizing:border-box; }
      .font-display{ font-family:'Manrope',sans-serif; letter-spacing:-.01em; }
      .font-mono{ font-family:'JetBrains Mono',monospace; }
      .cc-root ::-webkit-scrollbar{ width:9px; height:9px; }
      .cc-root ::-webkit-scrollbar-thumb{ background:var(--line); border-radius:99px; }
      .cc-scroll::-webkit-scrollbar{ display:none; }
      .cc-scroll{ scrollbar-width:none; }
      @keyframes ccRise{ from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:translateY(0)} }
      .cc-rise{ animation:ccRise .25s ease both; }
      @keyframes ccLoad{ from{width:0} to{width:100%} }
      .hairline{ border-color:var(--line) !important; }

      /* ---- eyebrow label: quiet section marker ---- */
      .cc-eyebrow{ display:inline-flex; align-items:center; gap:7px; font-family:'JetBrains Mono',monospace; font-size:10.5px;
        font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--slate);
        padding:0; }
      .cc-eyebrow::before{ content:""; width:14px; height:2px; background:var(--marigold); flex:none; }

      /* ---- card: flat hairline border, soft elevation, no rotation/sticker motifs ---- */
      .cc-card{ background:var(--surface); border:1px solid var(--line); border-radius:12px;
        box-shadow:0 1px 2px rgba(15,23,42,.04); transition:box-shadow .18s ease, border-color .18s ease, transform .18s ease; }
      .cc-card.pin{ border-left:3px solid var(--stripe,var(--marigold)); }
      .cc-card.tilt-l, .cc-card.tilt-r{ transform:none; }
      .cc-card.tilt-l:hover, .cc-card.tilt-r:hover{ box-shadow:0 10px 24px rgba(15,23,42,.09); border-color:#D8DEE8; transform:translateY(-2px); }
      .cc-card-hover:hover{ box-shadow:0 10px 24px rgba(15,23,42,.09); border-color:#D8DEE8; transform:translateY(-2px); }
      .cc-notice::after{ content:none; }

      .cc-avatar{ border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff; flex:none;
        font-family:'Manrope',sans-serif; }

      /* ---- id chip (sidebar identity card) ---- */
      .cc-id-chip{ display:flex; align-items:center; gap:10px; background:var(--surface); border:1px solid var(--line);
        border-radius:10px; padding:9px 12px 9px 10px; position:relative; overflow:hidden; }
      .cc-id-chip::before{ content:""; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--stripe,var(--marigold)); }
      .role-student{ --stripe:#2563EB; } .role-faculty{ --stripe:#0D9488; }
      .role-club{ --stripe:#7C3AED; } .role-placement{ --stripe:#B45309; } .role-admin{ --stripe:#0F172A; }

      .cc-chip{ display:inline-flex; align-items:center; gap:4px; font-size:11px; font-family:'Inter',sans-serif; font-weight:600;
        padding:3px 9px; border-radius:6px; border:1px solid var(--line); background:var(--chalk-2); color:var(--slate); white-space:nowrap; }

      /* ---- role badge: flat solid label, no rotation ---- */
      .cc-stamp{ display:inline-flex; align-items:center; gap:5px; font-family:'Inter',sans-serif; font-size:10.5px;
        font-weight:700; text-transform:uppercase; letter-spacing:.03em; padding:3px 9px;
        border-radius:6px; color:#fff; background:linear-gradient(135deg, var(--stamp-color,var(--marigold-d)), color-mix(in srgb, var(--stamp-color,var(--marigold-d)) 70%, black));
        box-shadow:0 2px 6px color-mix(in srgb, var(--stamp-color,var(--marigold-d)) 35%, transparent); }

      .cc-tab{ padding:7px 14px; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer;
        border:1px solid var(--line); color:var(--ink); background:var(--surface); white-space:nowrap; transition:.12s; }
      .cc-tab.active{ background:var(--ink-solid); color:#fff; border-color:var(--ink-solid); }
      .cc-navlink{ display:flex; align-items:center; gap:11px; padding:9px 12px; border-radius:8px; color:var(--slate);
        font-size:13.5px; font-weight:500; cursor:pointer; transition:.14s; border:1px solid transparent; position:relative; }
      .cc-navlink:hover{ background:var(--chalk-2); color:var(--ink); }
      .cc-navlink.active{ background:linear-gradient(90deg, color-mix(in srgb, var(--marigold) 12%, var(--surface)), var(--surface)); color:var(--ink-solid); font-weight:700; }
      .cc-navlink.active::before{ content:""; position:absolute; left:-14px; top:8px; bottom:8px; width:3px; background:var(--marigold); border-radius:0 3px 3px 0; }
      .cc-navlink.active svg{ color:var(--marigold-d); }

      .btn-cc-primary{ background:linear-gradient(135deg,#0F172A,#1E293B); color:#fff; font-weight:600; border-radius:8px; border:1px solid var(--ink-solid);
        padding:9px 18px; font-size:13px; transition:.16s; }
      .btn-cc-primary:hover{ background:linear-gradient(135deg,#1E293B,#0F172A); transform:translateY(-1px); box-shadow:0 6px 16px rgba(15,23,42,.25); }
      .btn-cc-primary:disabled{ opacity:.45; cursor:not-allowed; transform:none; box-shadow:none; }
      .btn-cc-accent{ background:linear-gradient(135deg, var(--marigold), var(--marigold-d)); color:#fff; font-weight:600; border-radius:8px; border:1px solid var(--marigold-d);
        padding:9px 18px; font-size:13px; transition:.16s; }
      .btn-cc-accent:hover{ background:linear-gradient(135deg, var(--marigold-d), var(--marigold)); transform:translateY(-1px); box-shadow:0 6px 16px rgba(37,99,235,.32); }
      .btn-cc-accent:disabled{ opacity:.45; cursor:not-allowed; transform:none; box-shadow:none; }
      .btn-cc-ghost{ background:var(--surface); color:var(--ink); font-weight:600; border-radius:8px; border:1px solid var(--line);
        padding:9px 18px; font-size:13px; transition:.16s; }
      .btn-cc-ghost:hover{ background:var(--chalk-2); border-color:#CBD3DF; transform:translateY(-1px); }
      .btn-cc-danger{ background:var(--surface); color:#DC2626; font-weight:600; border-radius:8px; border:1px solid #F3B4B0;
        padding:9px 18px; font-size:13px; }
      .btn-cc-danger:hover{ background:#FEF2F2; }
      .cc-input{
    width:100%;
    border:1px solid var(--line);
    border-radius:8px;
    padding:9px 12px;
    font-size:13.5px;
    background:var(--surface);
    color:var(--ink);
    caret-color:var(--marigold);
}
    .cc-input::placeholder{
    color:#97A1AF;
} 
      .cc-input:focus{ outline:none; border-color:var(--marigold); box-shadow:0 0 0 3px rgba(37,99,235,.14); }
      .cc-label{ font-size:11px; font-weight:700; color:var(--slate); text-transform:uppercase; letter-spacing:.06em; font-family:'Inter',sans-serif; }
      .cc-progress{ height:7px; border-radius:99px; background:var(--chalk-2); overflow:hidden; border:1px solid var(--line); }
      .cc-progress > span{ display:block; height:100%; background:linear-gradient(90deg, var(--marigold), var(--marigold-d)); border-radius:99px; transition:width .4s ease; }
      .cc-empty{ background:var(--chalk-2); border:1px dashed #C7CEDA; border-radius:12px; padding:2.25rem; text-align:center; color:var(--slate); font-size:13.5px; font-weight:500; }
      .cc-grid-2{ display:grid; grid-template-columns:1fr; gap:14px; }
      .cc-grid-3{ display:grid; grid-template-columns:1fr; gap:14px; }
      .cc-grid-4{ display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
      @media(min-width:640px){ .cc-grid-2{grid-template-columns:repeat(2,1fr)} .cc-grid-3{grid-template-columns:repeat(2,1fr)} }
      @media(min-width:860px){ .cc-grid-3{grid-template-columns:repeat(3,1fr)} .cc-grid-4{grid-template-columns:repeat(4,1fr)} }
      @media(min-width:1080px){ .cc-grid-2{grid-template-columns:repeat(3,1fr)} }
      .cc-feed{ max-width:760px; margin:0 auto; }
      .cc-panel{ max-width:960px; margin:0 auto; }
      .cc-two-col{ display:grid; grid-template-columns:1fr 280px; gap:24px; align-items:start; }
      @media(max-width:920px){ .cc-two-col{ grid-template-columns:1fr; } .cc-rail{ display:none; } }
      .cc-rail{ display:flex; flex-direction:column; gap:14px; position:sticky; top:76px; }
      .cc-rail-card{ padding:16px; }
      .cc-rail-title{ font-family:'Inter',sans-serif; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--slate); margin-bottom:10px; }
      .cc-rail-row{ display:flex; justify-content:space-between; align-items:center; gap:8px; padding:7px 0; border-bottom:1px solid var(--line); font-size:12.5px; }
      .cc-rail-row:last-of-type{ border-bottom:none; }
      .cc-toast{ background:var(--ink-solid); color:#fff; font-size:13px; font-weight:500; padding:10px 18px; border-radius:8px; box-shadow:0 8px 24px rgba(15,23,42,.35); }
      .cc-bottomnav{ position:sticky; bottom:0; left:0; right:0; background:var(--surface); border-top:1px solid var(--line); display:flex; z-index:40; }
      .cc-bottomtab{ display:flex; flex-direction:column; align-items:center; gap:2px; font-size:9.5px; color:var(--slate); padding:8px 0; flex:1; background:none; border:0; font-weight:600; }
      .cc-bottomtab.active{ color:var(--marigold-d); }

      /* ---- stat card: colored top rule reads as a category marker ---- */
      .cc-stat{ position:relative; overflow:hidden; }
      .cc-stat::before{ content:""; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, var(--stat-color,var(--ink)), color-mix(in srgb, var(--stat-color,var(--ink)) 55%, transparent)); }
      .cc-stat-icon{ width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex:none; }
    `}</style>
  );
}
