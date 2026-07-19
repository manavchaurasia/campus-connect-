# CampusConnect

A campus portal built with React + Vite. Multi-role (student / faculty / club coordinator /
placement cell / admin), light & dark themes, and everything persisted locally via
`localStorage` — no backend required to try it out.

## Setup

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

## Other commands

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

## Demo login

The app seeds one account on first run:

- **Email:** `parth.gupta@tcsc.edu.in`
- **Password:** `campus123`

Or use "Create an account" with any `@tcsc.edu.in` email to register a new one.
Use **Settings → Preview as role** to see the Faculty / Club / Placement Cell / Admin
dashboards without logging out.

## Project structure

```
src/
├── App.jsx                 # root component — auth flow, routing between screens
├── main.jsx                 # React DOM mount point
├── constants.js              # COLLEGE name, ROLE_META, sidebar NAV_ITEMS
├── utils.js                  # initials(), avatarColor(), uid()
├── storage.js                 # localStorage persistence helpers
├── seedData.js                 # starter/demo data
├── hooks/
│   └── useToasts.js
├── styles/
│   └── GlobalStyle.jsx         # the entire design system (CSS variables + component classes)
└── components/
    ├── shared/                 # Avatar, RoleBadge, SectionHead, StatCard, TagChip, etc.
    ├── screens/                # Boot / Splash screens
    ├── auth/                   # Login / Register / Forgot-password screens
    ├── layout/
    │   └── MainApp.jsx          # topbar + sidebar + page router (once logged in)
    ├── pages/                   # one file per sidebar item (Home feed, Events, Placement, ...)
    └── dashboards/              # role-specific dashboards (Faculty/Club/Placement/Admin)
```

See `CampusConnect_Code_Guide.md` (if included alongside this project) for a full
section-by-section walkthrough of what each file does.

## Notes

- All data (accounts, posts, event registrations, theme choice, etc.) is stored in your
  browser's `localStorage` under keys prefixed `campusconnect:`. Clearing site data will
  reset the app back to its seed state.
- This is a front-end-only demo — there's no real server, authentication, or file storage
  behind it.
