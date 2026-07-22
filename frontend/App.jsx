import React, { useState, useEffect } from "react";
import {
  Home, Compass, Calendar, Briefcase, Award, FolderKanban, ShoppingBag,
  Search as SearchIcon, MessageSquare, Bell, Settings as SettingsIcon,
  LayoutDashboard, Plus, Heart, MessageCircle, Bookmark, CheckCircle2,
  X, LogOut, Menu, ChevronLeft, MapPin, Send, Sparkles, Sun, Moon,
  Users, TrendingUp, Activity, ShieldAlert
} from "lucide-react";

/* =========================================================================
   CampusConnect — fully working single-file React app
   Real auth, real state mutations, persisted via window.storage (per-user).
   Visual system: institutional / professional (see design notes below).
   ========================================================================= */

const COLLEGE = "Thakur College of Science and Commerce";

const ROLE_META = {
  student:   { label: "Student",           color: "#2563EB", cls: "role-student"   },
  faculty:   { label: "Faculty",           color: "#0D9488", cls: "role-faculty"   },
  club:      { label: "Club Coordinator",  color: "#7C3AED", cls: "role-club"      },
  placement: { label: "Placement Cell",    color: "#B45309", cls: "role-placement" },
  admin:     { label: "Admin",             color: "#0F172A", cls: "role-admin"     },
};

const PALETTE = ["#2563EB", "#0D9488", "#7C3AED", "#B45309", "#0F172A", "#BE185C"];

function initials(name) {
  return (name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}
function avatarColor(seed) {
  let h = 0;
  for (const c of seed || "?") h = (h * 31 + c.charCodeAt(0)) % PALETTE.length;
  return PALETTE[h];
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ------------------------------- global style ---------------------------- */
/* Design notes: institutional / operations-software register — a records
   office for a whole campus. Deep slate-navy ink, cool paper background,
   a single confident blue for action, restrained per-role identity color
   used only as a thin left-rail marker (like a filed-folder tab), not as
   decoration. No hand-drawn or sticker motifs; flat 1px hairlines, soft
   elevation shadows, consistent 8/12px radii. Display face: Manrope
   (assured, geometric, but not novelty). Body: Inter. Data/labels: 
   JetBrains Mono, used narrowly for IDs, prices, timestamps — the kind of
   detail a registrar's system would monospace. */

function GlobalStyle() {
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

/* ------------------------------- seed data ------------------------------ */

const SEED_POSTS = [
  { id: uid(), authorEmail: "anita.rao@tcsc.edu.in", authorName: "Dr. Anita Rao", role: "faculty", dept: "IT Dept", time: "2h ago", text: "Reminder: Database Systems internal exam moved to Friday, 10:00 AM, Lab 3. Syllabus: Units 1–4 only.", tag: "Announcement", likedBy: [], comments: [{ a: "Sanya Mehta", t: "Noted, thank you ma'am!" }], savedBy: [] },
  { id: uid(), authorEmail: "manav.c@tcsc.edu.in", authorName: "Manav Chaurasia", role: "student", dept: "TY IT", time: "4h ago", text: "Shipped the auth module for our final year project — JWT + refresh tokens + role guards working end to end.", tag: "Project Update", likedBy: ["parth.gupta@tcsc.edu.in"], comments: [], savedBy: [] },
  { id: uid(), authorEmail: "robotics@tcsc.edu.in", authorName: "Robotics Club", role: "club", dept: "Tech Council", time: "6h ago", text: "RoboWars 2026 registrations are open. Teams of up to 4, ₹200/team. Last date: 20 July.", tag: "Event", likedBy: [], comments: [], savedBy: [] },
  { id: uid(), authorEmail: "placement@tcsc.edu.in", authorName: "Placement Cell", role: "placement", dept: "T&P Office", time: "1d ago", text: "Infosys Springboard drive — 45 openings for Systems Engineer roles. Eligibility: 60%+ throughout, no active backlogs.", tag: "Placement", likedBy: [], comments: [], savedBy: [] },
];

const SEED_EVENTS = [
  { id: uid(), title: "RoboWars 2026", host: "Robotics Club", date: "20 Jul 2026", time: "10:00 AM", venue: "Main Auditorium", cap: 120, registered: 87, fee: "₹200/team", desc: "Flagship robo-combat tournament. Teams of up to 4.", tags: ["Technical", "Team Event"] },
  { id: uid(), title: "Placement Orientation — Batch 2027", host: "Placement Cell", date: "22 Jul 2026", time: "11:30 AM", venue: "Seminar Hall 2", cap: 300, registered: 212, fee: "Free", desc: "Mandatory orientation covering resume building and drive eligibility.", tags: ["Placement", "Mandatory"] },
  { id: uid(), title: "UI/UX Design Sprint", host: "Dept. of IT", date: "25 Jul 2026", time: "9:30 AM", venue: "Design Lab, 4th Floor", cap: 40, registered: 36, fee: "₹100", desc: "A one-day intensive on Figma prototyping and usability testing.", tags: ["Workshop"] },
  { id: uid(), title: "Alumni Connect: Careers in Cloud", host: "Alumni Cell", date: "29 Jul 2026", time: "4:00 PM", venue: "Online — Google Meet", cap: 500, registered: 145, fee: "Free", desc: "Alumni at AWS, GCP and Azure share how they broke into cloud roles.", tags: ["Talk", "Online"] },
];

const SEED_JOBS = [
  { id: uid(), company: "Infosys Springboard", role: "Systems Engineer", ctc: "₹4.5 LPA", type: "Full-time", deadline: "18 Jul 2026", applicants: 212 },
  { id: uid(), company: "Zeta Cloud Labs", role: "Backend Intern → FTE", ctc: "₹22k/mo + ₹6 LPA", type: "Internship+PPO", deadline: "21 Jul 2026", applicants: 64 },
  { id: uid(), company: "NovaBank Fintech", role: "Java Developer", ctc: "₹6.2 LPA", type: "Full-time", deadline: "25 Jul 2026", applicants: 98 },
  { id: uid(), company: "PixelForge Studios", role: "Frontend Developer", ctc: "₹5 LPA", type: "Full-time", deadline: "12 Jul 2026", applicants: 41 },
];

const SEED_PROJECTS = [
  { id: uid(), title: "Campus Carpool Matcher", owner: "Rohan Iyer", need: ["React", "Node.js", "Maps API"], members: 2, seats: 4, desc: "Matches students commuting from similar routes for shared rides.", joinedBy: [] },
  { id: uid(), title: "AI Notes Summarizer", owner: "Sanya Mehta", need: ["Python", "NLP", "Flask"], members: 3, seats: 4, desc: "Summarizes lecture PDFs into structured revision notes.", joinedBy: [] },
  { id: uid(), title: "CampusConnect Mobile", owner: "Melbourne D'costa", need: ["React Native", "REST APIs"], members: 1, seats: 3, desc: "A companion mobile client focused on notifications and QR attendance.", joinedBy: [] },
];

const SEED_SKILL_STUDENTS = [
  { name: "Manav Chaurasia", roll: "261738", skills: ["Spring Boot", "Java", "MySQL"], projects: 5, verified: true },
  { name: "Parth Gupta", roll: "261777", skills: ["React", "Java", "Docker"], projects: 4, verified: true },
  { name: "Melbourne D'costa", roll: "261782", skills: ["React Native", "UI Design", "Figma"], projects: 6, verified: true },
  { name: "Sanya Mehta", roll: "261701", skills: ["Python", "NLP", "Data Analysis"], projects: 3, verified: false },
  { name: "Ayaan Sheikh", roll: "261715", skills: ["AWS", "DevOps", "Docker"], projects: 2, verified: true },
];

const SEED_MARKET = [
  { id: uid(), title: "Data Structures (Reference Textbook)", price: "₹250", seller: "Ayaan Sheikh", cond: "Good", cat: "Books" },
  { id: uid(), title: "Drafter Kit — barely used", price: "₹150", seller: "Sanya Mehta", cond: "Like new", cat: "Stationery" },
  { id: uid(), title: "Casio fx-991ES Calculator", price: "₹400", seller: "Rohan Iyer", cond: "Fair", cat: "Electronics" },
];

const SEED_LOSTFOUND = [
  { id: uid(), type: "Lost", item: "Black Casio Calculator", where: "Lab 3", when: "11 Jul", by: "Rohan Iyer", status: "Open" },
  { id: uid(), type: "Found", item: "Blue Wired Earphones", where: "Canteen", when: "10 Jul", by: "Security Desk", status: "Open" },
];

const SEED_CLUBS = [
  { name: "Robotics Club", members: 64, events: 12, coordinator: "Manav Chaurasia" },
  { name: "Tech Council", members: 210, events: 18, coordinator: "Melbourne D'costa" },
  { name: "Literary Society", members: 88, events: 9, coordinator: "Sanya Mehta" },
  { name: "Sports Committee", members: 150, events: 22, coordinator: "Ayaan Sheikh" },
];

function seedData() {
  return {
    posts: SEED_POSTS,
    events: SEED_EVENTS,
    myEventIds: [],
    jobs: SEED_JOBS,
    myApplications: [],
    projects: SEED_PROJECTS,
    market: SEED_MARKET,
    lostFound: SEED_LOSTFOUND,
    threads: [
      { id: uid(), name: "Manav Chaurasia", messages: [{ from: "them", text: "Pushed the migration scripts, check GitHub" }] },
      { id: uid(), name: "Dr. Anita Rao", messages: [{ from: "them", text: "Please submit the revised synopsis by Monday." }] },
      { id: uid(), name: "Placement Cell", messages: [{ from: "them", text: "Your application has moved to Round 2." }] },
    ],
    notifications: [
      { id: uid(), text: "Dr. Anita Rao posted a new announcement in Database Systems.", time: "10m ago", unread: true },
      { id: uid(), text: "Your Skill Discovery profile was viewed by Placement Cell.", time: "3h ago", unread: true },
      { id: uid(), text: "RoboWars 2026 registration closes in 8 days.", time: "5h ago", unread: false },
    ],
    settings: {
      notifEvents: true, notifPlacement: true, notifFaculty: true, notifDM: true, notifMarket: true,
      privPortfolio: true, privEmail: false, privClubDM: true,
    },
  };
}

/* --------------------------- storage persistence ------------------------- */

async function storageGet(key, fallback) {
  try {
    const r = await window.storage.get(key, false);
    return r ? JSON.parse(r.value) : fallback;
  } catch {
    return fallback;
  }
}
async function storageSet(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), false);
  } catch {
    /* best effort */
  }
}

/* --------------------------------- toasts -------------------------------- */

function useToasts() {
  const [toasts, setToasts] = useState([]);
  function push(msg) {
    const id = uid();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400);
  }
  return { toasts, push };
}
function ToastWrap({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 18, left: "50%", transform: "translateX(-50%)", zIndex: 999, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      {toasts.map((t) => <div key={t.id} className="cc-toast cc-rise">{t.msg}</div>)}
    </div>
  );
}

/* ------------------------------ small shared bits ------------------------ */

function Avatar({ name, size = 38 }) {
  return (
    <div className="cc-avatar" style={{ width: size, height: size, fontSize: size * 0.34, background: avatarColor(name) }}>
      {initials(name)}
    </div>
  );
}
function RoleBadge({ role }) {
  const m = ROLE_META[role] || ROLE_META.student;
  return <span className="cc-stamp" style={{ "--stamp-color": m.color }}>{m.label}</span>;
}
function SectionHead({ title, sub, action, eyebrow }) {
  return (
    <div className="d-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, gap: 12, flexWrap: "wrap" }}>
      <div>
        {eyebrow && <div className="cc-eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>}
        <h2 className="font-display" style={{ fontWeight: 800, fontSize: 27, margin: 0, lineHeight: 1.1, color: "var(--ink)" }}>{title}</h2>
        {sub && <p style={{ color: "var(--slate)", fontSize: 13, margin: "6px 0 0", maxWidth: 520 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div className="cc-card cc-stat" style={{ "--stat-color": color || "var(--ink)", padding: "14px 14px 12px", flex: 1, minWidth: 130 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div className="font-mono" style={{ fontSize: 10.5, color: "var(--slate)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</div>
        {Icon && <div className="cc-stat-icon" style={{ background: `color-mix(in srgb, ${color || "var(--ink)"} 15%, transparent)` }}><Icon size={14} color={color || "var(--ink)"} /></div>}
      </div>
      <div className="font-display" style={{ fontSize: 25, fontWeight: 800, color: "var(--ink)", marginTop: 3 }}>{value}</div>
    </div>
  );
}
function Empty({ children }) { return <div className="cc-empty">{children}</div>; }

const TAG_COLORS = { Announcement: "var(--teal)", Event: "var(--violet)", Placement: "var(--coral)", "Project Update": "var(--marigold)", Update: "var(--slate)" };
function TagChip({ label, color }) {
  const c = color || TAG_COLORS[label] || "var(--slate)";
  return <span className="cc-chip" style={{ color: c, borderColor: c, background: `color-mix(in srgb, ${c} 12%, var(--surface))`, fontWeight: 700 }}>{label}</span>;
}

/* ================================ APP ==================================== */

export default function App() {
  const [booted, setBooted] = useState(false);
  const [view, setView] = useState("splash");
  const [authStep, setAuthStep] = useState("login");
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);
  const [me, setMe] = useState(null);
  const [data, setData] = useState(seedData());
  const [role, setRole] = useState("student");
  const [theme, setTheme] = useState("light");
  const { toasts, push: toast } = useToasts();

  function toggleTheme() {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      storageSet("cc_theme", next);
      return next;
    });
  }

  useEffect(() => {
    (async () => {
      const savedUsers = await storageGet("cc_users", null);
      const savedSession = await storageGet("cc_session", null);
      const savedData = await storageGet("cc_data", null);
      const savedTheme = await storageGet("cc_theme", "light");
      setTheme(savedTheme);

      let u = savedUsers;
      if (!u) {
        u = [{ name: "Parth Gupta", email: "parth.gupta@tcsc.edu.in", password: "campus123", roll: "261777", dept: "B.Sc. IT — TY", role: "student", bio: "Full-stack builder. Java/Spring Boot + React. Exploring cloud & DevOps.", skills: ["Java", "Spring Boot", "React", "MySQL", "REST APIs", "Docker"] }];
        await storageSet("cc_users", u);
      }
      setUsers(u);

      const d = savedData || seedData();
      setData(d);
      if (!savedData) await storageSet("cc_data", d);

      if (savedSession) {
        const found = u.find((x) => x.email === savedSession);
        if (found) { setSession(savedSession); setMe(found); setRole(found.role); setView("home"); }
        else setView("splash");
      } else setView("splash");
      setBooted(true);
    })();
  }, []);

  useEffect(() => {
    if (view === "splash") {
      const t = setTimeout(() => setView((v) => (v === "splash" ? "login" : v)), 1300);
      return () => clearTimeout(t);
    }
  }, [view]);

  function persistUsers(next) { setUsers(next); storageSet("cc_users", next); }
  function persistData(updater) {
    setData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      storageSet("cc_data", next);
      return next;
    });
  }

  function handleLogin(email, password) {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return toast("No account found for that email. Try registering.");
    if (found.password !== password) return toast("Incorrect password.");
    setSession(found.email); setMe(found); setRole(found.role);
    storageSet("cc_session", found.email);
    setView("home");
    toast(`Welcome back, ${found.name.split(" ")[0]}`);
  }
  function handleRegister(profile) {
    if (users.some((u) => u.email.toLowerCase() === profile.email.toLowerCase())) { toast("An account with that email already exists."); return false; }
    const next = [...users, profile];
    persistUsers(next);
    setSession(profile.email); setMe(profile); setRole(profile.role);
    storageSet("cc_session", profile.email);
    setView("home");
    toast("Account created. Welcome to CampusConnect.");
    return true;
  }
  function updateMe(patch) {
    const updated = { ...me, ...patch };
    setMe(updated);
    persistUsers(users.map((u) => (u.email === me.email ? updated : u)));
  }
  function logout() { setSession(null); setMe(null); storageSet("cc_session", null); setAuthStep("login"); setView("login"); }

  const wrap = (child) => <div className={`cc-root${theme === "dark" ? " theme-dark" : ""}`} style={{ minHeight: "100vh", width: "100%" }}><GlobalStyle />{child}</div>;

  if (!booted) return wrap(<BootScreen />);
  if (view === "splash") return wrap(<SplashScreen />);
  if (!session || view === "login" || view === "register" || view === "forgot") {
    return wrap(<AuthShell authStep={authStep} setAuthStep={setAuthStep} onLogin={handleLogin} onRegister={handleRegister} toast={toast} toasts={toasts} theme={theme} toggleTheme={toggleTheme} />);
  }
  return wrap(<MainApp me={me} updateMe={updateMe} role={role} setRole={setRole} data={data} persistData={persistData} logout={logout} toast={toast} toasts={toasts} theme={theme} toggleTheme={toggleTheme} />);
}

function BootScreen() {
  return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A", color: "#fff", fontSize: 14, fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>Loading CampusConnect…</div>;
}

function SplashScreen() {
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

function AuthShell({ authStep, setAuthStep, onLogin, onRegister, toast, toasts, theme, toggleTheme }) {
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

function LoginForm({ onLogin, setAuthStep }) {
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
      <p style={{ fontSize: 13.5, textAlign: "center", marginTop: 16 }}>New here? <a href="#" onClick={(e) => { e.preventDefault(); setAuthStep("register"); }} style={{ fontWeight: 700, color: "var(--marigold-d)" }}>Create an account</a></p>
    </form>
  );
}

function RegisterForm({ onRegister, setAuthStep }) {
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
            {Object.entries(ROLE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginTop: 12 }}><label className="cc-label">Password</label><input required type="password" className="cc-input" style={{ marginTop: 5 }} placeholder="Create a password" value={form.password} onChange={(e) => set("password", e.target.value)} /></div>
      <button className="btn-cc-accent" style={{ width: "100%", marginTop: 18 }}>Create account</button>
      <p style={{ fontSize: 13.5, textAlign: "center", marginTop: 16 }}>Already registered? <a href="#" onClick={(e) => { e.preventDefault(); setAuthStep("login"); }} style={{ fontWeight: 700, color: "var(--marigold-d)" }}>Sign in</a></p>
    </form>
  );
}

function ForgotForm({ setAuthStep, toast }) {
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

const NAV_ITEMS = [
  { key: "home", label: "Home feed", icon: Home },
  { key: "explore", label: "Explore people", icon: Compass },
  { key: "events", label: "Events", icon: Calendar },
  { key: "placement", label: "Placement hub", icon: Briefcase },
  { key: "skill", label: "Skill discovery", icon: Award },
  { key: "projects", label: "Collaboration", icon: FolderKanban },
  { key: "market", label: "Marketplace", icon: ShoppingBag },
  { key: "lostfound", label: "Lost & found", icon: MapPin },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "notifications", label: "Notifications", icon: Bell },
];

function MainApp({ me, updateMe, role, setRole, data, persistData, logout, toast, toasts, theme, toggleTheme }) {
  const [view, setView] = useState("home");
  const [navOpen, setNavOpen] = useState(false);
  const unreadCount = data.notifications.filter((n) => n.unread).length;
  const showDashboard = role !== "student";

  function go(v) { setView(v); setNavOpen(false); }

  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      <ToastWrap toasts={toasts} />

      {/* Topbar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--chalk)", borderBottom: "1px solid var(--line)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn-cc-ghost cc-mobile-only" style={{ padding: "7px 9px" }} onClick={() => setNavOpen((o) => !o)}>
            {navOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>
          <div className="font-display" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 15, letterSpacing: "-.01em" }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 7l8-4 8 4-8 4-8-4z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" /></svg>
            </div>
            CampusConnect
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn-cc-ghost" style={{ padding: "7px 9px", display: "flex", alignItems: "center" }} onClick={toggleTheme} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="btn-cc-ghost" style={{ padding: "7px 10px", position: "relative", display: "flex", alignItems: "center" }} onClick={() => go("notifications")}>
            <Bell size={16} />
            {unreadCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "var(--coral)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</span>}
          </button>
          <div onClick={() => go("profile")} style={{ cursor: "pointer" }}><Avatar name={me.name} size={34} /></div>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* Sidebar (desktop always, mobile as slide-down) */}
        <div className={navOpen ? "cc-sidebar-open" : "cc-sidebar-closed"} style={{
          width: 236, flex: "none", borderRight: "1px solid var(--line)", background: "var(--surface)", padding: 14,
          position: "sticky", top: 53, height: "calc(100vh - 53px)", overflowY: "auto",
        }}>
          <div className={`cc-id-chip ${ROLE_META[role].cls}`} style={{ marginBottom: 12 }}>
            <Avatar name={me.name} size={34} />
            <div style={{ fontSize: 12.5, overflow: "hidden" }}>
              <div style={{ fontWeight: 700, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{me.name}</div>
              <div className="font-mono" style={{ fontSize: 10.5, color: "var(--slate)" }}>#{me.roll} · {ROLE_META[role].label}</div>
            </div>
          </div>
          <button className="btn-cc-accent" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 }} onClick={() => go("home")}>
            <Plus size={15} /> {role === "student" ? "Create post" : "Go to feed"}
          </button>
          {showDashboard && (
            <>
              <div onClick={() => go("home")} className={`cc-navlink ${view === "home" ? "active" : ""}`}>
                <LayoutDashboard size={16} /> Dashboard
              </div>
              <div style={{ height: 1, background: "var(--line)", margin: "8px 0" }} />
            </>
          )}
          {NAV_ITEMS.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.key} onClick={() => go(n.key)} className={`cc-navlink ${view === n.key ? "active" : ""}`}>
                <Icon size={16} /> {n.label}
              </div>
            );
          })}
          <div style={{ height: 1, background: "var(--line)", margin: "8px 0" }} />
          <div onClick={() => go("profile")} className={`cc-navlink ${view === "profile" ? "active" : ""}`}><Sparkles size={16} /> My profile</div>
          <div onClick={() => go("settings")} className={`cc-navlink ${view === "settings" ? "active" : ""}`}><SettingsIcon size={16} /> Settings</div>
          <button className="btn-cc-danger" style={{ width: "100%", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={logout}><LogOut size={15} /> Log out</button>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, padding: "24px 32px 90px", maxWidth: 1180, margin: "0 auto", width: "100%" }}>
          {view === "home" && (role === "student" ? <HomeFeed me={me} data={data} persistData={persistData} toast={toast} onNavigate={go} /> : <RoleDashboard role={role} data={data} persistData={persistData} toast={toast} setView={go} />)}
          {view === "explore" && <ExplorePeople />}
          {view === "events" && <EventsView data={data} persistData={persistData} toast={toast} />}
          {view === "placement" && <PlacementView data={data} persistData={persistData} toast={toast} />}
          {view === "skill" && <SkillDiscovery />}
          {view === "projects" && <ProjectsView me={me} data={data} persistData={persistData} toast={toast} />}
          {view === "market" && <MarketView me={me} data={data} persistData={persistData} toast={toast} />}
          {view === "lostfound" && <LostFoundView me={me} data={data} persistData={persistData} toast={toast} />}
          {view === "messages" && <MessagesView data={data} persistData={persistData} />}
          {view === "notifications" && <NotificationsView data={data} persistData={persistData} />}
          {view === "profile" && <ProfileView me={me} updateMe={updateMe} data={data} toast={toast} onNavigate={go} />}
          {view === "settings" && <SettingsView data={data} persistData={persistData} role={role} setRole={setRole} logout={logout} setView={go} theme={theme} toggleTheme={toggleTheme} />}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="cc-bottomnav cc-mobile-only">
        {[["home", Home, "Feed"], ["explore", Compass, "Explore"], ["events", Calendar, "Events"], ["placement", Briefcase, "Jobs"], ["profile", Sparkles, "Profile"]].map(([key, Icon, label]) => (
          <button key={key} className={`cc-bottomtab ${view === key ? "active" : ""}`} onClick={() => go(key)}>
            <Icon size={18} /> <span>{label}</span>
          </button>
        ))}
      </div>

      <style>{`
        .cc-mobile-only{ display:none; }
        .cc-sidebar-closed{ display:none; }
        @media(max-width:899px){
          .cc-mobile-only{ display:flex; }
          .d-none-mobile{ display:none !important; }
          .cc-sidebar-open{ display:block !important; position:fixed !important; top:53px; left:0; bottom:0; z-index:60; box-shadow:0 20px 40px rgba(15,23,42,.15); }
        }
        @media(min-width:900px){
          .cc-sidebar-closed, .cc-sidebar-open{ display:block; position:sticky; }
        }
      `}</style>
    </div>
  );
}

/* --------------------------------- Home feed ------------------------------ */

function HomeFeed({ me, data, persistData, toast, onNavigate }) {
  const [draft, setDraft] = useState("");
  const [commentDraft, setCommentDraft] = useState({});
  const [openComments, setOpenComments] = useState({});

  function addPost() {
    if (!draft.trim()) return;
    persistData((d) => ({ ...d, posts: [{ id: uid(), authorEmail: me.email, authorName: me.name, role: me.role, dept: me.dept, time: "just now", text: draft.trim(), tag: "Update", likedBy: [], comments: [], savedBy: [] }, ...d.posts] }));
    setDraft(""); toast("Post published");
  }
  function toggleLike(id) {
    persistData((d) => ({ ...d, posts: d.posts.map((p) => p.id !== id ? p : { ...p, likedBy: p.likedBy.includes(me.email) ? p.likedBy.filter((e) => e !== me.email) : [...p.likedBy, me.email] }) }));
  }
  function toggleSave(id) {
    persistData((d) => ({ ...d, posts: d.posts.map((p) => p.id !== id ? p : { ...p, savedBy: p.savedBy.includes(me.email) ? p.savedBy.filter((e) => e !== me.email) : [...p.savedBy, me.email] }) }));
  }
  function addComment(id) {
    const text = (commentDraft[id] || "").trim();
    if (!text) return;
    persistData((d) => ({ ...d, posts: d.posts.map((p) => (p.id === id ? { ...p, comments: [...p.comments, { a: me.name, t: text }] } : p)) }));
    setCommentDraft((c) => ({ ...c, [id]: "" }));
  }

  const savedCount = data.posts.filter((p) => p.savedBy.includes(me.email)).length;
  const upcomingEvents = data.events.slice(0, 3);

  return (
    <div>
      <SectionHead eyebrow="Bulletin board" title="Home feed" />
      <div className="cc-card" style={{ padding: "24px 26px", marginBottom: 16, background: "linear-gradient(135deg,#0F172A 0%,#1E3A8A 100%)", border: "none", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -36, top: -36, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
        <div style={{ position: "absolute", right: 48, bottom: -46, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.05)" }} />
        <div style={{ position: "relative" }}>
          <div className="font-mono" style={{ fontSize: 10.5, color: "#93B4EF", textTransform: "uppercase", letterSpacing: ".14em", fontWeight: 600 }}>Welcome back</div>
          <div className="font-display" style={{ color: "#fff", fontSize: 25, fontWeight: 800, marginTop: 6 }}>Good to see you, {me.name.split(" ")[0]}</div>
          <p style={{ color: "rgba(255,255,255,.72)", fontSize: 13, marginTop: 6, maxWidth: 440 }}>Here's what's happening across {COLLEGE} today.</p>
        </div>
      </div>
      <div className="cc-two-col">
        <div>
          <div className="cc-card" style={{ padding: 14, marginBottom: 16 }}>
            <textarea className="cc-input" rows={2} placeholder="Share an update, achievement, or announcement…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button className="btn-cc-accent" onClick={addPost}>Publish</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {data.posts.map((p) => {
              const liked = p.likedBy.includes(me.email);
              const saved = p.savedBy.includes(me.email);
              const open = !!openComments[p.id];
              const stripe = (ROLE_META[p.role] || ROLE_META.student).color;
              return (
                <div key={p.id} className="cc-card pin cc-rise" style={{ padding: 16, "--stripe": stripe }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <Avatar name={p.authorName} size={42} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5 }}>{p.authorName}</span>
                        <RoleBadge role={p.role} />
                        <span style={{ fontSize: 11.5, color: "var(--slate)" }}>· {p.dept} · {p.time}</span>
                      </div>
                      <div style={{ marginTop: 6 }}><TagChip label={p.tag} /></div>
                      <p style={{ fontSize: 13.5, marginTop: 8, lineHeight: 1.55 }}>{p.text}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                        <button onClick={() => toggleLike(p.id)} style={{ background: "none", border: 0, display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: liked ? "var(--marigold-d)" : "var(--slate)" }}>
                          <Heart size={15} fill={liked ? "currentColor" : "none"} /> {p.likedBy.length}
                        </button>
                        <button onClick={() => setOpenComments((o) => ({ ...o, [p.id]: !o[p.id] }))} style={{ background: "none", border: 0, display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: "var(--slate)" }}>
                          <MessageCircle size={15} /> {p.comments.length}
                        </button>
                        <button onClick={() => toggleSave(p.id)} style={{ marginLeft: "auto", background: "none", border: 0, display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: saved ? "var(--marigold-d)" : "var(--slate)" }}>
                          <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
                        </button>
                      </div>
                      {open && (
                        <div style={{ marginTop: 10 }} className="cc-rise">
                          {p.comments.map((c, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                              <div style={{ width: 22, height: 22, borderRadius: 6, background: avatarColor(c.a), color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{initials(c.a)}</div>
                              <div style={{ fontSize: 12.5, background: "var(--chalk-2)", borderRadius: 8, padding: "6px 10px", flex: 1 }}><b>{c.a}</b> {c.t}</div>
                            </div>
                          ))}
                          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                            <input className="cc-input" style={{ padding: "6px 10px" }} placeholder="Write a comment…" value={commentDraft[p.id] || ""} onChange={(e) => setCommentDraft((c) => ({ ...c, [p.id]: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addComment(p.id)} />
                            <button className="btn-cc-ghost" style={{ padding: "6px 12px" }} onClick={() => addComment(p.id)}><Send size={13} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cc-rail">
          <div className="cc-card cc-rail-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={me.name} size={40} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{me.name}</div>
                <div className="font-mono" style={{ fontSize: 10.5, color: "var(--slate)" }}>#{me.roll} · {me.dept}</div>
              </div>
            </div>
            <button className="btn-cc-ghost" style={{ width: "100%", marginTop: 12 }} onClick={() => onNavigate && onNavigate("profile")}>View profile</button>
          </div>

          <div className="cc-card cc-rail-card">
            <div className="cc-rail-title">Your activity</div>
            <div className="cc-rail-row"><span>Saved posts</span><span className="font-mono" style={{ fontWeight: 700 }}>{savedCount}</span></div>
            <div className="cc-rail-row"><span>Event registrations</span><span className="font-mono" style={{ fontWeight: 700 }}>{data.myEventIds.length}</span></div>
            <div className="cc-rail-row"><span>Job applications</span><span className="font-mono" style={{ fontWeight: 700 }}>{data.myApplications.length}</span></div>
          </div>

          <div className="cc-card cc-rail-card">
            <div className="cc-rail-title">Upcoming events</div>
            {upcomingEvents.map((ev) => (
              <div key={ev.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ fontWeight: 600, fontSize: 12.5 }}>{ev.title}</div>
                <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{ev.date} · {ev.venue}</div>
              </div>
            ))}
            <button className="btn-cc-ghost" style={{ width: "100%", marginTop: 10 }} onClick={() => onNavigate && onNavigate("events")}>View all events</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Explore ---------------------------------- */

function ExplorePeople() {
  const [q, setQ] = useState("");
  const people = SEED_SKILL_STUDENTS.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <SectionHead eyebrow="Student directory" title="Explore people" sub="Find students, faculty and clubs across campus." />
      <div style={{ position: "relative", maxWidth: 340, marginBottom: 16 }}>
        <SearchIcon size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--slate)" }} />
        <input className="cc-input" style={{ paddingLeft: 34 }} placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="cc-grid-2">
        {people.map((s) => (
          <div key={s.roll} className="cc-card" style={{ padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar name={s.name} size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", gap: 5 }}>{s.name} {s.verified && <CheckCircle2 size={14} color="var(--teal)" />}</div>
              <div className="font-mono" style={{ fontSize: 11, color: "var(--slate)" }}>#{s.roll} · {s.projects} projects</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>{s.skills.map((sk) => <span key={sk} className="cc-chip">{sk}</span>)}</div>
            </div>
          </div>
        ))}
        {people.length === 0 && <Empty>No one matches "{q}".</Empty>}
      </div>
    </div>
  );
}

/* -------------------------------- Events ------------------------------------ */

function EventsView({ data, persistData, toast }) {
  function toggleRegister(ev) {
    const registered = data.myEventIds.includes(ev.id);
    persistData((d) => ({ ...d, myEventIds: registered ? d.myEventIds.filter((id) => id !== ev.id) : [...d.myEventIds, ev.id], events: d.events.map((e) => (e.id === ev.id ? { ...e, registered: e.registered + (registered ? -1 : 1) } : e)) }));
    toast(registered ? `Unregistered from ${ev.title}` : `Registered for ${ev.title}`);
  }
  return (
    <div>
      <SectionHead eyebrow="Campus calendar" title="Events" sub="Workshops, tournaments and talks happening on campus." />
      <div className="cc-grid-2">
        {data.events.map((ev) => {
          const registered = data.myEventIds.includes(ev.id);
          const full = ev.registered >= ev.cap;
          const pct = Math.round((ev.registered / ev.cap) * 100);
          const stripe = ev.tags.includes("Placement") ? "var(--coral)" : ev.tags.includes("Workshop") ? "var(--violet)" : ev.tags.includes("Online") || ev.tags.includes("Talk") ? "var(--teal)" : "var(--marigold)";
          return (
            <div key={ev.id} className="cc-card pin" style={{ padding: 14, position: "relative", "--stripe": stripe }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }} className="font-display">{ev.title}</div>
                  <div style={{ fontSize: 11.5, color: "var(--slate)", marginTop: 2 }}>{ev.host} · {ev.date} · {ev.time}</div>
                </div>
                <span className="font-mono" style={{ fontSize: 12 }}>{ev.fee}</span>
              </div>
              <p style={{ fontSize: 12.5, marginTop: 8, lineHeight: 1.5 }}>{ev.desc}</p>
              <div style={{ fontSize: 11.5, color: "var(--slate)", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}><MapPin size={12} /> {ev.venue}</div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--slate)", marginBottom: 4 }}><span>{ev.registered}/{ev.cap} registered</span><span>{pct}%</span></div>
                <div className="cc-progress"><span style={{ width: pct + "%" }} /></div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>{ev.tags.map((t) => <span key={t} className="cc-chip" style={{ borderColor: "var(--teal)", color: "var(--teal)", background: "var(--surface)" }}>{t}</span>)}</div>
              <button
                disabled={!registered && full}
                className={registered ? "btn-cc-danger" : "btn-cc-accent"}
                style={{ marginTop: 10, width: "100%" }}
                onClick={() => toggleRegister(ev)}
              >
                {registered ? "Cancel registration" : full ? "Full" : "Register now"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------- Placement ----------------------------------- */

function PlacementView({ data, persistData, toast }) {
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

/* ----------------------------- Skill discovery -------------------------------- */

function SkillDiscovery() {
  const [filter, setFilter] = useState("");
  const filtered = SEED_SKILL_STUDENTS.filter((s) => !filter || s.skills.some((sk) => sk.toLowerCase().includes(filter.toLowerCase())));
  return (
    <div>
      <SectionHead eyebrow="Talent registry" title="Skill discovery" sub="Faculty and placement officers can search verified student skills and projects." />
      <div style={{ position: "relative", maxWidth: 340, marginBottom: 16 }}>
        <Award size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--slate)" }} />
        <input className="cc-input" style={{ paddingLeft: 34 }} placeholder="e.g. React, Java, Docker…" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      <div className="cc-grid-2">
        {filtered.map((s) => (
          <div key={s.roll} className="cc-card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}>{s.name} {s.verified && <span className="cc-chip" style={{ borderColor: "var(--teal)", color: "var(--teal)", background: "var(--surface)" }}><CheckCircle2 size={11} /> Verified</span>}</div>
            <div className="font-mono" style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>#{s.roll} · {s.projects} projects</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>{s.skills.map((sk) => <span key={sk} className="cc-chip">{sk}</span>)}</div>
          </div>
        ))}
        {filtered.length === 0 && <Empty>No students match this skill yet.</Empty>}
      </div>
    </div>
  );
}

/* -------------------------------- Projects ------------------------------------- */

function ProjectsView({ me, data, persistData, toast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", need: "", desc: "", seats: 3 });

  function join(p) {
    if (p.joinedBy.includes(me.email)) return;
    persistData((d) => ({ ...d, projects: d.projects.map((x) => (x.id === p.id ? { ...x, joinedBy: [...x.joinedBy, me.email], members: x.members + 1 } : x)) }));
    toast(`Joined ${p.title}`);
  }
  function createProject(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    persistData((d) => ({ ...d, projects: [{ id: uid(), title: form.title, owner: me.name, need: form.need.split(",").map((s) => s.trim()).filter(Boolean), members: 1, seats: Number(form.seats) || 3, desc: form.desc, joinedBy: [] }, ...d.projects] }));
    setForm({ title: "", need: "", desc: "", seats: 3 }); setShowForm(false); toast("Project posted");
  }

  return (
    <div>
      <SectionHead eyebrow="Team-up desk" title="Project collaboration" sub="Find teammates or start your own build." action={<button className="btn-cc-accent" onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ New project"}</button>} />
      {showForm && (
        <form onSubmit={createProject} className="cc-card cc-rise" style={{ padding: 14, marginBottom: 16 }}>
          <input required className="cc-input" style={{ marginBottom: 8 }} placeholder="Project title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <input className="cc-input" style={{ marginBottom: 8 }} placeholder="Skills needed, comma separated" value={form.need} onChange={(e) => setForm((f) => ({ ...f, need: e.target.value }))} />
          <textarea className="cc-input" style={{ marginBottom: 8 }} placeholder="Short description" value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} />
          <input type="number" min={1} className="cc-input" style={{ marginBottom: 10, maxWidth: 120 }} placeholder="Seats" value={form.seats} onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))} />
          <button className="btn-cc-primary">Post project</button>
        </form>
      )}
      <div className="cc-grid-2">
        {data.projects.map((p) => (
          <div key={p.id} className="cc-card pin" style={{ padding: 14, "--stripe": "var(--violet)" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }} className="font-display">{p.title}</div>
            <div style={{ fontSize: 11.5, color: "var(--slate)", marginTop: 2 }}>by {p.owner} · {p.members}/{p.seats} members</div>
            <p style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.5 }}>{p.desc}</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{p.need.map((n) => <span key={n} className="cc-chip">{n}</span>)}</div>
            <button disabled={p.joinedBy.includes(me.email) || p.members >= p.seats} className={p.joinedBy.includes(me.email) ? "cc-chip" : "btn-cc-accent"} style={p.joinedBy.includes(me.email) ? { color: "var(--teal)", borderColor: "var(--teal)", marginTop: 10, background: "var(--surface)" } : { marginTop: 10, width: "100%" }} onClick={() => join(p)}>
              {p.joinedBy.includes(me.email) ? "Joined ✓" : p.members >= p.seats ? "Team full" : "Request to join"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Marketplace ----------------------------------- */

function MarketView({ me, data, persistData, toast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", price: "", cond: "Good", cat: "Books" });

  function sell(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.price.trim()) return;
    persistData((d) => ({ ...d, market: [{ id: uid(), title: form.title, price: form.price, seller: me.name, cond: form.cond, cat: form.cat }, ...d.market] }));
    setForm({ title: "", price: "", cond: "Good", cat: "Books" }); setShowForm(false); toast("Listed for sale");
  }
  function remove(id) { persistData((d) => ({ ...d, market: d.market.filter((m) => m.id !== id) })); toast("Listing removed"); }

  return (
    <div>
      <SectionHead eyebrow="Swap shop" title="Marketplace" sub="Buy and sell books, gear and more within campus." action={<button className="btn-cc-accent" onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ Sell an item"}</button>} />
      {showForm && (
        <form onSubmit={sell} className="cc-card cc-rise" style={{ padding: 14, marginBottom: 16 }}>
          <input required className="cc-input" style={{ marginBottom: 8 }} placeholder="Item title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <div style={{ display: "flex", gap: 8 }}>
            <input required className="cc-input" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            <select className="cc-input" value={form.cond} onChange={(e) => setForm((f) => ({ ...f, cond: e.target.value }))}>{["Like new", "Good", "Fair"].map((c) => <option key={c}>{c}</option>)}</select>
            <select className="cc-input" value={form.cat} onChange={(e) => setForm((f) => ({ ...f, cat: e.target.value }))}>{["Books", "Electronics", "Stationery", "Apparel", "Other"].map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <button className="btn-cc-primary" style={{ marginTop: 10 }}>List item</button>
        </form>
      )}
      <div className="cc-grid-3">
        {data.market.map((m) => (
          <div key={m.id} className="cc-card pin" style={{ overflow: "hidden", "--stripe": avatarColor(m.cat) }}>
            <div className="cc-thumb" style={{ height: 96, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--chalk-2)" }}><ShoppingBag size={26} color={avatarColor(m.title)} /></div>
            <div style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ fontWeight: 700, fontSize: 13 }}>{m.title}</span><span className="font-mono" style={{ fontWeight: 700, fontSize: 13 }}>{m.price}</span></div>
              <div style={{ fontSize: 11.5, color: "var(--slate)", marginTop: 6 }}>{m.cond} · {m.cat} · sold by {m.seller}</div>
              {m.seller === me.name && <button className="btn-cc-danger" style={{ width: "100%", marginTop: 8, padding: "6px 12px" }} onClick={() => remove(m.id)}>Remove listing</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Lost & Found ------------------------------------ */

function LostFoundView({ me, data, persistData, toast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "Lost", item: "", where: "" });

  function report(e) {
    e.preventDefault();
    if (!form.item.trim()) return;
    persistData((d) => ({ ...d, lostFound: [{ id: uid(), type: form.type, item: form.item, where: form.where, when: "Today", by: me.name, status: "Open" }, ...d.lostFound] }));
    setForm({ type: "Lost", item: "", where: "" }); setShowForm(false); toast("Report submitted");
  }
  function resolve(id) { persistData((d) => ({ ...d, lostFound: d.lostFound.map((l) => (l.id === id ? { ...l, status: "Resolved" } : l)) })); }

  return (
    <div className="cc-panel">
      <SectionHead eyebrow="Front desk log" title="Lost & found" sub="Report or search for lost items on campus." action={<button className="btn-cc-accent" onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ Report item"}</button>} />
      {showForm && (
        <form onSubmit={report} className="cc-card cc-rise" style={{ padding: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <select className="cc-input" style={{ maxWidth: 110 }} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}><option>Lost</option><option>Found</option></select>
            <input required className="cc-input" placeholder="Item description" value={form.item} onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))} />
          </div>
          <input className="cc-input" style={{ marginTop: 8 }} placeholder="Location" value={form.where} onChange={(e) => setForm((f) => ({ ...f, where: e.target.value }))} />
          <button className="btn-cc-primary" style={{ marginTop: 10 }}>Submit report</button>
        </form>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.lostFound.map((l) => (
          <div key={l.id} className="cc-card" style={{ padding: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
            <div>
              <span className="cc-chip" style={{ borderColor: l.type === "Lost" ? "var(--coral)" : "var(--teal)", color: l.type === "Lost" ? "var(--coral)" : "var(--teal)", background: "var(--surface)" }}>{l.type}</span>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 6 }}>{l.item}</div>
              <div style={{ fontSize: 11.5, color: "var(--slate)" }}>{l.where} · {l.when} · reported by {l.by}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span className="cc-chip">{l.status}</span>
              {l.status === "Open" && <button className="btn-cc-ghost" style={{ padding: "6px 12px" }} onClick={() => resolve(l.id)}>Mark resolved</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Messages --------------------------------------- */

function MessagesView({ data, persistData }) {
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

/* ------------------------------- Notifications --------------------------------------- */

function NotificationsView({ data, persistData }) {
  function markRead(id) { persistData((d) => ({ ...d, notifications: d.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)) })); }
  function markAllRead() { persistData((d) => ({ ...d, notifications: d.notifications.map((n) => ({ ...n, unread: false })) })); }
  return (
    <div className="cc-feed">
      <SectionHead eyebrow="Pigeonhole" title="Notifications" action={<button className="btn-cc-ghost" onClick={markAllRead}>Mark all read</button>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.notifications.map((n) => (
          <div key={n.id} onClick={() => markRead(n.id)} className="cc-card" style={{ padding: 14, cursor: "pointer", borderLeft: n.unread ? "3px solid var(--marigold)" : "1px solid var(--line)" }}>
            <div style={{ fontSize: 13 }}>{n.text}</div>
            <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 4 }}>{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- Profile ------------------------------------------- */

function ProfileView({ me, updateMe, data, toast, onNavigate }) {
  const [bio, setBio] = useState(me.bio || "");
  const [skillsText, setSkillsText] = useState((me.skills || []).join(", "));
  const [editing, setEditing] = useState(false);
  const mySaved = data.posts.filter((p) => p.savedBy.includes(me.email));

  function save() { updateMe({ bio, skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean) }); setEditing(false); toast("Profile updated"); }

  return (
    <div>
      <SectionHead eyebrow="Student dossier" title="My profile" />
      <div className="cc-two-col">
        <div>
          <div className="cc-card" style={{ overflow: "hidden", marginBottom: 20 }}>
            <div style={{ height: 60, background: "linear-gradient(120deg,#0F172A,#1E293B)" }} />
            <div style={{ padding: 16, marginTop: -30 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
                <div style={{ width: 64, height: 64, borderRadius: 14, border: "3px solid var(--surface)", background: avatarColor(me.name), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20 }} className="font-display">{initials(me.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><span className="font-display" style={{ fontWeight: 700, fontSize: 18 }}>{me.name}</span><RoleBadge role={me.role} /></div>
                  <div className="font-mono" style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>#{me.roll} · {me.dept} · {me.email}</div>
                </div>
                {!editing && <button className="btn-cc-ghost" onClick={() => setEditing(true)}>Edit profile</button>}
              </div>
              {!editing ? (
                <>
                  <p style={{ fontSize: 13.5, marginTop: 14 }}>{me.bio || "No bio yet — tell people what you're building."}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{(me.skills || []).map((s) => <span key={s} className="cc-chip" style={{ borderColor: "var(--teal)", color: "var(--teal)", background: "var(--surface)" }}><CheckCircle2 size={11} /> {s}</span>)}</div>
                </>
              ) : (
                <div style={{ marginTop: 14 }}>
                  <label className="cc-label">Bio</label>
                  <textarea className="cc-input" style={{ marginTop: 5, marginBottom: 10 }} value={bio} onChange={(e) => setBio(e.target.value)} />
                  <label className="cc-label">Skills (comma separated)</label>
                  <input className="cc-input" style={{ marginTop: 5, marginBottom: 10 }} value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
                  <button className="btn-cc-accent" onClick={save}>Save changes</button>
                  <button className="btn-cc-ghost" style={{ marginLeft: 8 }} onClick={() => setEditing(false)}>Cancel</button>
                </div>
              )}
            </div>
          </div>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Saved posts</h3>
          {mySaved.length === 0 && <Empty>Posts you save will show up here — tap the bookmark icon on any post.</Empty>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mySaved.map((p) => <div key={p.id} className="cc-card" style={{ padding: 14, fontSize: 13 }}><b>{p.authorName}:</b> {p.text}</div>)}
          </div>
        </div>

        <div className="cc-rail">
          <div className="cc-card cc-rail-card">
            <div className="cc-rail-title">Account snapshot</div>
            <div className="cc-rail-row"><span>Roll no.</span><span className="font-mono">#{me.roll}</span></div>
            <div className="cc-rail-row"><span>Department</span><span>{me.dept}</span></div>
            <div className="cc-rail-row"><span>Skills listed</span><span className="font-mono" style={{ fontWeight: 700 }}>{(me.skills || []).length}</span></div>
            <div className="cc-rail-row"><span>Saved posts</span><span className="font-mono" style={{ fontWeight: 700 }}>{mySaved.length}</span></div>
          </div>
          <div className="cc-card cc-rail-card">
            <div className="cc-rail-title">Quick links</div>
            <button className="btn-cc-ghost" style={{ width: "100%", marginBottom: 8 }} onClick={() => onNavigate && onNavigate("settings")}>Account settings</button>
            <button className="btn-cc-ghost" style={{ width: "100%" }} onClick={() => onNavigate && onNavigate("skill")}>Skill discovery</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Settings --------------------------------------------- */

function SettingsView({ data, persistData, role, setRole, logout, setView, theme, toggleTheme }) {
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
            {Object.entries(ROLE_META).map(([k, v]) => (
              <button key={k} className={role === k ? "btn-cc-primary" : "btn-cc-ghost"} onClick={() => { setRole(k); setView("home"); }}>{v.label}</button>
            ))}
          </div>
          <button className="btn-cc-danger" style={{ width: "100%", marginTop: 14 }} onClick={logout}>Log out</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Role dashboards ------------------------------------------ */

function RoleDashboard({ role, data, persistData, toast, setView }) {
  if (role === "faculty") return <FacultyDashboard data={data} setView={setView} />;
  if (role === "club") return <ClubDashboard />;
  if (role === "placement") return <PlacementDashboard data={data} setView={setView} />;
  if (role === "admin") return <AdminDashboard toast={toast} />;
  return null;
}

function FacultyDashboard({ data, setView }) {
  const announcements = data.posts.filter((p) => p.role === "faculty");
  const batches = [["TY IT — A", 88], ["TY IT — B", 76], ["SY IT — A", 91], ["SY IT — B", 64]];
  return (
    <div>
      <SectionHead eyebrow="Staff desk" title="Faculty dashboard" sub="Publish announcements, manage classes and track participation." action={<button className="btn-cc-accent" onClick={() => setView("home")}>+ New announcement</button>} />
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <StatCard label="Students managed" value="186" color="var(--teal)" icon={Users} />
        <StatCard label="Announcements" value={announcements.length} color="var(--marigold-d)" icon={Bell} />
        <StatCard label="Avg. participation" value="82%" color="var(--coral)" icon={TrendingUp} />
      </div>
      <div className="cc-grid-2">
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Recent announcements</h3>
          {announcements.map((p) => <div key={p.id} style={{ borderBottom: "1px solid var(--line)", padding: "8px 0", fontSize: 12.5 }}>{p.text}</div>)}
        </div>
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Batch participation</h3>
          {batches.map(([b, pct]) => (
            <div key={b} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}><span>{b}</span><span className="font-mono">{pct}%</span></div>
              <div className="cc-progress"><span style={{ width: pct + "%", background: "var(--teal)" }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClubDashboard() {
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

function PlacementDashboard({ data, setView }) {
  return (
    <div>
      <SectionHead eyebrow="T&P control room" title="Placement Cell dashboard" sub="Post opportunities, search talent and track drive performance." action={<button className="btn-cc-accent" onClick={() => setView("placement")}>Manage drives</button>} />
      <div className="cc-grid-4" style={{ marginBottom: 16 }}>
        <StatCard label="Open drives" value={data.jobs.length} color="var(--coral)" icon={Briefcase} />
        <StatCard label="Total applicants" value={data.jobs.reduce((s, j) => s + j.applicants, 0)} color="var(--marigold-d)" icon={Users} />
        <StatCard label="Placed this year" value="112" color="var(--teal)" icon={Award} />
        <StatCard label="Avg. CTC" value="₹5.4 LPA" color="var(--ink)" icon={TrendingUp} />
      </div>
      <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Top skill matches</h3>
      <div className="cc-grid-2">
        {SEED_SKILL_STUDENTS.slice(0, 4).map((s) => (
          <div key={s.roll} className="cc-card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>{s.skills.map((sk) => <span key={sk} className="cc-chip">{sk}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard({ toast }) {
  const [flagged, setFlagged] = useState([]);
  return (
    <div>
      <SectionHead eyebrow="System registrar" title="Admin dashboard" sub="Platform-wide analytics, user management and moderation." />
      <div className="cc-grid-4" style={{ marginBottom: 16 }}>
        <StatCard label="Total users" value="1,842" color="var(--ink)" icon={Users} />
        <StatCard label="Daily active" value="612" color="var(--teal)" icon={Activity} />
        <StatCard label="Pending reports" value="3" color="var(--coral)" icon={ShieldAlert} />
        <StatCard label="Uptime" value="99.9%" color="var(--marigold-d)" icon={CheckCircle2} />
      </div>
      <div className="cc-grid-2">
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>User management</h3>
          {SEED_SKILL_STUDENTS.map((s) => (
            <div key={s.roll} style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--line)", padding: "7px 0" }}>
              <Avatar name={s.name} size={28} />
              <div style={{ flex: 1, fontSize: 12.5 }}>{s.name} <span className="font-mono" style={{ fontSize: 10.5, color: "var(--slate)" }}>#{s.roll}</span></div>
              <button disabled={flagged.includes(s.roll)} className="cc-chip" style={{ color: "var(--coral)", borderColor: "var(--coral)", cursor: "pointer", background: "var(--surface)" }} onClick={() => { setFlagged((f) => [...f, s.roll]); toast("User flagged for review"); }}>
                {flagged.includes(s.roll) ? "Flagged" : "Flag"}
              </button>
            </div>
          ))}
        </div>
        <div className="cc-card" style={{ padding: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Moderation queue</h3>
          {["Marketplace listing reported as spam", "Lost & Found duplicate entry", "Post flagged: inappropriate language"].map((m) => (
            <div key={m} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", padding: "7px 0", fontSize: 12.5, gap: 8 }}>
              <span>{m}</span><button className="btn-cc-ghost" style={{ padding: "4px 10px", fontSize: 11.5 }} onClick={() => toast("Reviewed")}>Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}