import { uid } from "./utils";

export const SEED_POSTS = [
  { id: uid(), authorEmail: "anita.rao@tcsc.edu.in", authorName: "Dr. Anita Rao", role: "faculty", dept: "IT Dept", time: "2h ago", text: "Reminder: Database Systems internal exam moved to Friday, 10:00 AM, Lab 3. Syllabus: Units 1–4 only.", tag: "Announcement", likedBy: [], comments: [{ a: "Sanya Mehta", t: "Noted, thank you ma'am!" }], savedBy: [] },
  { id: uid(), authorEmail: "manav.c@tcsc.edu.in", authorName: "Manav Chaurasia", role: "student", dept: "TY IT", time: "4h ago", text: "Shipped the auth module for our final year project — JWT + refresh tokens + role guards working end to end.", tag: "Project Update", likedBy: ["parth.gupta@tcsc.edu.in"], comments: [], savedBy: [] },
  { id: uid(), authorEmail: "robotics@tcsc.edu.in", authorName: "Robotics Club", role: "club", dept: "Tech Council", time: "6h ago", text: "RoboWars 2026 registrations are open. Teams of up to 4, ₹200/team. Last date: 20 July.", tag: "Event", likedBy: [], comments: [], savedBy: [] },
  { id: uid(), authorEmail: "placement@tcsc.edu.in", authorName: "Placement Cell", role: "placement", dept: "T&P Office", time: "1d ago", text: "Infosys Springboard drive — 45 openings for Systems Engineer roles. Eligibility: 60%+ throughout, no active backlogs.", tag: "Placement", likedBy: [], comments: [], savedBy: [] },
];

export const SEED_EVENTS = [
  { id: uid(), title: "RoboWars 2026", host: "Robotics Club", date: "20 Jul 2026", time: "10:00 AM", venue: "Main Auditorium", cap: 120, registered: 87, fee: "₹200/team", desc: "Flagship robo-combat tournament. Teams of up to 4.", tags: ["Technical", "Team Event"] },
  { id: uid(), title: "Placement Orientation — Batch 2027", host: "Placement Cell", date: "22 Jul 2026", time: "11:30 AM", venue: "Seminar Hall 2", cap: 300, registered: 212, fee: "Free", desc: "Mandatory orientation covering resume building and drive eligibility.", tags: ["Placement", "Mandatory"] },
  { id: uid(), title: "UI/UX Design Sprint", host: "Dept. of IT", date: "25 Jul 2026", time: "9:30 AM", venue: "Design Lab, 4th Floor", cap: 40, registered: 36, fee: "₹100", desc: "A one-day intensive on Figma prototyping and usability testing.", tags: ["Workshop"] },
  { id: uid(), title: "Alumni Connect: Careers in Cloud", host: "Alumni Cell", date: "29 Jul 2026", time: "4:00 PM", venue: "Online — Google Meet", cap: 500, registered: 145, fee: "Free", desc: "Alumni at AWS, GCP and Azure share how they broke into cloud roles.", tags: ["Talk", "Online"] },
];

export const SEED_JOBS = [
  { id: uid(), company: "Infosys Springboard", role: "Systems Engineer", ctc: "₹4.5 LPA", type: "Full-time", deadline: "18 Jul 2026", applicants: 212 },
  { id: uid(), company: "Zeta Cloud Labs", role: "Backend Intern → FTE", ctc: "₹22k/mo + ₹6 LPA", type: "Internship+PPO", deadline: "21 Jul 2026", applicants: 64 },
  { id: uid(), company: "NovaBank Fintech", role: "Java Developer", ctc: "₹6.2 LPA", type: "Full-time", deadline: "25 Jul 2026", applicants: 98 },
  { id: uid(), company: "PixelForge Studios", role: "Frontend Developer", ctc: "₹5 LPA", type: "Full-time", deadline: "12 Jul 2026", applicants: 41 },
];

export const SEED_PROJECTS = [
  { id: uid(), title: "Campus Carpool Matcher", owner: "Rohan Iyer", need: ["React", "Node.js", "Maps API"], members: 2, seats: 4, desc: "Matches students commuting from similar routes for shared rides.", joinedBy: [] },
  { id: uid(), title: "AI Notes Summarizer", owner: "Sanya Mehta", need: ["Python", "NLP", "Flask"], members: 3, seats: 4, desc: "Summarizes lecture PDFs into structured revision notes.", joinedBy: [] },
  { id: uid(), title: "CampusConnect Mobile", owner: "Melbourne D'costa", need: ["React Native", "REST APIs"], members: 1, seats: 3, desc: "A companion mobile client focused on notifications and QR attendance.", joinedBy: [] },
];

export const SEED_SKILL_STUDENTS = [
  { name: "Manav Chaurasia", roll: "261738", skills: ["Spring Boot", "Java", "MySQL"], projects: 5, verified: true },
  { name: "Parth Gupta", roll: "261777", skills: ["React", "Java", "Docker"], projects: 4, verified: true },
  { name: "Melbourne D'costa", roll: "261782", skills: ["React Native", "UI Design", "Figma"], projects: 6, verified: true },
  { name: "Sanya Mehta", roll: "261701", skills: ["Python", "NLP", "Data Analysis"], projects: 3, verified: false },
  { name: "Ayaan Sheikh", roll: "261715", skills: ["AWS", "DevOps", "Docker"], projects: 2, verified: true },
];

export const SEED_MARKET = [
  { id: uid(), title: "Data Structures (Reference Textbook)", price: "₹250", seller: "Ayaan Sheikh", cond: "Good", cat: "Books" },
  { id: uid(), title: "Drafter Kit — barely used", price: "₹150", seller: "Sanya Mehta", cond: "Like new", cat: "Stationery" },
  { id: uid(), title: "Casio fx-991ES Calculator", price: "₹400", seller: "Rohan Iyer", cond: "Fair", cat: "Electronics" },
];

export const SEED_LOSTFOUND = [
  { id: uid(), type: "Lost", item: "Black Casio Calculator", where: "Lab 3", when: "11 Jul", by: "Rohan Iyer", status: "Open" },
  { id: uid(), type: "Found", item: "Blue Wired Earphones", where: "Canteen", when: "10 Jul", by: "Security Desk", status: "Open" },
];

export const SEED_CLUBS = [
  { name: "Robotics Club", members: 64, events: 12, coordinator: "Manav Chaurasia" },
  { name: "Tech Council", members: 210, events: 18, coordinator: "Melbourne D'costa" },
  { name: "Literary Society", members: 88, events: 9, coordinator: "Sanya Mehta" },
  { name: "Sports Committee", members: 150, events: 22, coordinator: "Ayaan Sheikh" },
];

export function seedData() {
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
    moderationQueue: [
      { id: uid(), text: "Marketplace listing reported as spam" },
      { id: uid(), text: "Lost & Found duplicate entry" },
      { id: uid(), text: "Post flagged: inappropriate language" },
    ],
    flaggedUsers: [],
    settings: {
      notifEvents: true, notifPlacement: true, notifFaculty: true, notifDM: true, notifMarket: true,
      privPortfolio: true, privEmail: false, privClubDM: true,
    },
  };
}
