import { useState } from "react";
import {
  Home,
  Compass,
  Calendar,
  Briefcase,
  Bell,
  Settings as SettingsIcon,
  LayoutDashboard,
  ShieldCheck,
  Plus,
  LogOut,
  Menu,
  ChevronLeft,
  Sparkles,
  Sun,
  Moon
} from "lucide-react";
import RoleDashboard from "../dashboards/RoleDashboard";
import EventsView from "../pages/EventsView";
import ExplorePeople from "../pages/ExplorePeople";
import HomeFeed from "../pages/HomeFeed";
import LostFoundView from "../pages/LostFoundView";
import MarketView from "../pages/MarketView";
import MessagesView from "../pages/MessagesView";
import NotificationsView from "../pages/NotificationsView";
import PlacementView from "../pages/PlacementView";
import ProfileView from "../pages/ProfileView";
import ProjectsView from "../pages/ProjectsView";
import SettingsView from "../pages/SettingsView";
import SkillDiscovery from "../pages/SkillDiscovery";
import Avatar from "../shared/Avatar";
import ToastWrap from "../shared/ToastWrap";
import { NAV_ITEMS, ROLE_META } from "../../constants";

export default function MainApp({ me, updateMe, role, setRole, data, persistData, logout, toast, toasts, theme, toggleTheme, users, deleteUser }) {
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
                {me.role === "admin" ? <ShieldCheck size={16} /> : <LayoutDashboard size={16} />}
                {me.role === "admin" ? "Admin panel" : "Dashboard"}
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
          {view === "home" && (role === "student" ? <HomeFeed me={me} data={data} persistData={persistData} toast={toast} onNavigate={go} /> : <RoleDashboard role={role} me={me} data={data} persistData={persistData} toast={toast} setView={go} users={users} deleteUser={deleteUser} />)}
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
          {view === "settings" && <SettingsView me={me} data={data} persistData={persistData} role={role} setRole={setRole} logout={logout} setView={go} theme={theme} toggleTheme={toggleTheme} />}
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
