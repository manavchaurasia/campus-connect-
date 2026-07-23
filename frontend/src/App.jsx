import { useState, useEffect } from "react";
import GlobalStyle from "./styles/GlobalStyle";
import BootScreen from "./components/screens/BootScreen";
import SplashScreen from "./components/screens/SplashScreen";
import AuthShell from "./components/auth/AuthShell";
import MainApp from "./components/layout/MainApp";
import { seedData } from "./seedData";
import { storageGet, storageSet } from "./storage";
import { useToasts } from "./hooks/useToasts";

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
        u = [
          { name: "Parth Gupta", email: "parth.gupta@tcsc.edu.in", password: "campus123", roll: "261777", dept: "B.Sc. IT — TY", role: "student", bio: "Full-stack builder. Java/Spring Boot + React. Exploring cloud & DevOps.", skills: ["Java", "Spring Boot", "React", "MySQL", "REST APIs", "Docker"] },
          { name: "Campus Admin", email: "admin@tcsc.edu.in", password: "admin123", roll: "ADM001", dept: "System Administration", role: "admin", bio: "", skills: [] },
        ];
        await storageSet("cc_users", u);
      }
      if (!u.some((x) => x.role === "admin")) {
        u = [...u, { name: "Campus Admin", email: "admin@tcsc.edu.in", password: "admin123", roll: "ADM001", dept: "System Administration", role: "admin", bio: "", skills: [] }];
        await storageSet("cc_users", u);
      }
      setUsers(u);

      const d = savedData || seedData();
      if (d.moderationQueue === undefined) d.moderationQueue = seedData().moderationQueue;
      if (d.flaggedUsers === undefined) d.flaggedUsers = [];
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
  function deleteUser(email) {
    if (email === me.email) { toast("You can't remove your own account."); return; }
    persistUsers(users.filter((u) => u.email !== email));
    toast("Account removed.");
  }
  function logout() { setSession(null); setMe(null); storageSet("cc_session", null); setAuthStep("login"); setView("login"); }

  const wrap = (child) => <div className={`cc-root${theme === "dark" ? " theme-dark" : ""}`} style={{ minHeight: "100vh", width: "100%" }}><GlobalStyle />{child}</div>;

  if (!booted) return wrap(<BootScreen />);
  if (view === "splash") return wrap(<SplashScreen />);
  if (!session || view === "login" || view === "register" || view === "forgot") {
    return wrap(<AuthShell authStep={authStep} setAuthStep={setAuthStep} onLogin={handleLogin} onRegister={handleRegister} toast={toast} toasts={toasts} theme={theme} toggleTheme={toggleTheme} />);
  }
  return wrap(<MainApp me={me} updateMe={updateMe} role={role} setRole={setRole} data={data} persistData={persistData} logout={logout} toast={toast} toasts={toasts} theme={theme} toggleTheme={toggleTheme} users={users} deleteUser={deleteUser} />);
}
