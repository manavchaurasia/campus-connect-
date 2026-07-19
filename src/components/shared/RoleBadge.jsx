import { ROLE_META } from "../../constants";

export default function RoleBadge({ role }) {
  const m = ROLE_META[role] || ROLE_META.student;
  return <span className="cc-stamp" style={{ "--stamp-color": m.color }}>{m.label}</span>;
}
