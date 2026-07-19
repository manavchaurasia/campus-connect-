import {
  Home, Compass, Calendar, Briefcase, Award, FolderKanban, ShoppingBag,
  MapPin, MessageSquare, Bell
} from "lucide-react";

export const COLLEGE = "Thakur College of Science and Commerce";

export const ROLE_META = {
  student:   { label: "Student",           color: "#2563EB", cls: "role-student"   },
  faculty:   { label: "Faculty",           color: "#0D9488", cls: "role-faculty"   },
  club:      { label: "Club Coordinator",  color: "#7C3AED", cls: "role-club"      },
  placement: { label: "Placement Cell",    color: "#B45309", cls: "role-placement" },
  admin:     { label: "Admin",             color: "#0F172A", cls: "role-admin"     },
};

export const NAV_ITEMS = [
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
