# CampusConnect — Code Guide

A map of the whole file, in the order it appears. Use this alongside the code to find your way around.

---

## 1. Imports (top of file)

```js
import { motion } from "framer-motion";
import { fadeUp } from "./animations/animations";
```

⚠️ **Heads up:** these two imports are in your uploaded version but aren't used anywhere else in the file, and `neither is actually called (no `<motion.div>`, no `fadeUp` reference)`. If `./animations/animations.js` doesn't exist in your project yet, **the build will fail**. Either:
- create that file and export a `fadeUp` variant, or
- remove those two import lines if you're not using them yet.

The rest of the imports are `lucide-react` icons — every icon used anywhere in the UI (sidebar icons, buttons, stat icons, etc.) is imported once here.

---

## 2. Constants & small helpers (top of file, before components)

| Name | What it is |
|---|---|
| `COLLEGE` | The college name string, used in headers/splash/auth copy. |
| `ROLE_META` | One object per role (`student`, `faculty`, `club`, `placement`, `admin`) with a display label, a brand color, and a CSS class name. Drives the role badge color, sidebar identity stripe, etc. |
| `PALETTE` | 6 hex colors used to auto-assign avatar colors. |
| `initials(name)` | "Parth Gupta" → "PG". Used by the `Avatar` component. |
| `avatarColor(seed)` | Hashes any string (name/category) to one of the `PALETTE` colors — deterministic, so the same name always gets the same color. |
| `uid()` | Generates a short unique ID for new posts/events/etc. |

---

## 3. `GlobalStyle` component

This is the **entire design system** in one `<style>` tag, injected once per screen. It's not a separate CSS file — it's a component that renders `<style>{...}</style>`.

Sub-sections inside it, in order:
1. **Font imports** — Manrope (headings), Inter (body), JetBrains Mono (IDs/prices/timestamps).
2. **Page-shell reset** — forces `html/body/#root` to fill the viewport (overrides Vite/CRA boilerplate that would otherwise shrink-wrap and center the app, leaving black margins).
3. **CSS variables (`--ink`, `--chalk`, `--surface`, `--marigold`, etc.)** on `.cc-root` — the entire light theme. `.cc-root.theme-dark` overrides the same variable names for dark mode. Every component reads colors via `var(--x)`, never hardcoded hex (with a few intentional exceptions noted below), so the whole app reskins by toggling one class.
4. **Component classes** — `.cc-card`, `.cc-chip`, `.cc-stamp` (role badge), `.cc-navlink`, `.btn-cc-primary/accent/ghost/danger`, `.cc-input`, `.cc-progress`, `.cc-empty`, grid helpers (`.cc-grid-2/3/4`), layout helpers (`.cc-feed`, `.cc-panel`, `.cc-two-col`, `.cc-rail`), toast, bottom-nav, stat-card styling.

**Rule of thumb for editing styles:** change the CSS variable values (step 3) for global re-theming; edit the class rules (step 4) to change one component's shape/spacing everywhere at once.

---

## 4. Seed data

```
SEED_POSTS, SEED_EVENTS, SEED_JOBS, SEED_PROJECTS,
SEED_SKILL_STUDENTS, SEED_MARKET, SEED_LOSTFOUND, SEED_CLUBS
```
Hard-coded arrays that populate the app the first time it runs (no backend). `seedData()` bundles all of these plus empty `myEventIds`/`myApplications`, starter message `threads`, starter `notifications`, and default `settings` into the one object that becomes the app's live state.

---

## 5. Persistence layer

```js
storageGet(key, fallback)   // reads + JSON.parses from window.storage, or returns fallback
storageSet(key, value)      // JSON.stringifies + writes to window.storage
```
Everything the user does — new posts, event registrations, theme choice, new accounts — is written here under keys like `cc_users`, `cc_session`, `cc_data`, `cc_theme`. This is what makes the app "remember" state between visits (per-browser, not a real server).

---

## 6. Toasts

`useToasts()` — a hook returning `{ toasts, push }`. Call `toast("message")` anywhere and it appears bottom-center for ~2.4s. `ToastWrap` renders the stack.

---

## 7. Shared small components

These are reused across almost every page — if you want to change how something *looks* everywhere at once, edit it here rather than in each page.

| Component | Purpose |
|---|---|
| `Avatar` | Circular initials avatar, color derived from name. |
| `RoleBadge` | The colored "STUDENT / FACULTY / …" pill. |
| `SectionHead` | The `eyebrow` + big title + optional subtitle + optional right-aligned action button, used at the top of every page. |
| `StatCard` | The small metric tiles (e.g. "Open drives · 4") with a colored top bar and optional icon badge. |
| `Empty` | The dashed-border "nothing here yet" placeholder box. |
| `TagChip` | Colored pill for post/event categories (Announcement/Event/Placement/etc.), color looked up from `TAG_COLORS`. |

---

## 8. `App` — the root component

This is the **state owner and router** for the whole app. Everything else is a child of this.

- **State:** `booted`, `view` (splash/login/register/forgot), `authStep`, `users`, `session`, `me` (current user object), `data` (the big shared app-state object from `seedData()`), `role` (lets you preview other role dashboards), `theme`.
- **On mount (`useEffect`):** loads users/session/data/theme from `window.storage`; logs the session user back in automatically if one was saved; otherwise shows the splash → login flow.
- **`persistData(updater)`:** the single function every page calls to mutate shared data — takes either a new object or an updater function `(prev) => next`, applies it, and saves it to storage. This is effectively your "database write" function.
- **`handleLogin` / `handleRegister` / `updateMe` / `logout`:** auth actions.
- **`wrap(child)`:** wraps whatever screen is being shown in the `.cc-root` div (applying the dark-mode class) plus `<GlobalStyle />`.
- **Final `return`:** picks one of `BootScreen`, `SplashScreen`, `AuthShell`, or `MainApp` based on `booted`/`view`/`session`.

---

## 9. Boot / Splash / Auth screens

- `BootScreen` — one-line loading state while storage is being read.
- `SplashScreen` — animated logo intro, auto-advances to login after 1.3s.
- `AuthShell` — the two-pane login page (dark brand panel on the left, form on the right). Renders `LoginForm`, `RegisterForm`, or `ForgotForm` depending on `authStep`. Also hosts the light/dark toggle button (top-right).
- `LoginForm` / `RegisterForm` / `ForgotForm` — self-contained forms with their own local `useState`, calling back up to `onLogin` / `onRegister` / `toast`.

---

## 10. `MainApp` — the logged-in shell

This is the app frame once someone is signed in: **topbar + sidebar + main content area + mobile bottom nav.**

- `NAV_ITEMS` — the array driving the sidebar links (icon + label + view key). Add a new page to the sidebar by adding one entry here.
- **Topbar:** logo, mobile menu toggle, theme toggle, notifications bell (with unread badge), avatar (→ profile).
- **Sidebar:** identity chip (avatar/name/role), "Create post" button, optional "Dashboard" link (for non-student roles), the mapped `NAV_ITEMS`, then profile/settings/logout.
- **Main content:** a big `switch`-like block of `{view === "x" && <XView .../>}` — this is the actual page router. `go(v)` (aliased from `setView`) is passed down as `onNavigate` to a few pages so they can jump elsewhere (e.g. the Home Feed rail's "View all events" button).
- **Bottom nav:** mobile-only condensed version of 5 key links.
- Trailing `<style>` block: the mobile/desktop responsive rules for the sidebar and bottom nav (separate from `GlobalStyle` because it's specific to this component's layout).

---

## 11. Page components (one per sidebar item)

Each of these receives whatever slice of `data`/`me` it needs, plus `persistData` and `toast` to make changes. They're independent — you can edit one without touching the others.

| Component | View key | What it does |
|---|---|---|
| `HomeFeed` | `home` (student) | Gradient welcome hero, post composer, post list (like/comment/save), plus a right-hand rail (profile card, activity stats, upcoming events). |
| `ExplorePeople` | `explore` | Searchable directory of students (reads `SEED_SKILL_STUDENTS` directly — not wired to shared `data`). |
| `EventsView` | `events` | Event cards with registration progress bar and register/cancel. |
| `PlacementView` | `placement` | Stat cards + a table of job drives with "Apply". |
| `SkillDiscovery` | `skill` | Searchable-by-skill student cards. |
| `ProjectsView` | `projects` | Create-a-project form + list of projects with "Request to join". |
| `MarketView` | `market` | Create-a-listing form + marketplace grid, with "Remove" for your own listings. |
| `LostFoundView` | `lostfound` | Report form + list, with "Mark resolved". |
| `MessagesView` | `messages` | Two-pane thread list + chat window (local-only, no real messaging backend). |
| `NotificationsView` | `notifications` | List with unread markers + "Mark all read". |
| `ProfileView` | `profile` | Editable bio/skills, saved posts, account-snapshot rail. |
| `SettingsView` | `settings` | Appearance (light/dark), notification toggles, privacy toggles, "preview as role" switcher, logout. |

---

## 12. Role dashboards

Shown instead of `HomeFeed` on the `home` view when `role !== "student"`. Routed by `RoleDashboard`:

| Component | Role |
|---|---|
| `FacultyDashboard` | faculty |
| `ClubDashboard` | club |
| `PlacementDashboard` | placement |
| `AdminDashboard` | admin |

Each is its own self-contained block of stat cards + a table or list — no shared logic beyond `StatCard`/`Avatar`.

**Try it:** Settings → "Preview as role" lets you switch `role` without logging out, so you can see all four dashboards from one account.

---

## How to extend this file

- **Add a new page:** write a new `function MyView({ ...props }) { return <div>...</div> }`, add an entry to `NAV_ITEMS`, add a matching `{view === "mykey" && <MyView .../>}` line in `MainApp`.
- **Add a new stat/metric:** reuse `<StatCard label="..." value={...} color="var(--teal)" icon={SomeIcon} />` — no new CSS needed.
- **Change the color palette:** edit the `--marigold`, `--teal`, `--violet`, `--coral` values in `GlobalStyle` (both the light block and `.theme-dark` block) — every component picks it up automatically.
- **Change what persists:** anything you want remembered across reloads needs to live inside the `data` object and be written via `persistData`, or be its own `storageGet`/`storageSet` pair like `theme` and `session` are.
