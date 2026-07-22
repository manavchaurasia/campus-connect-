import { avatarColor, initials } from "../../utils";

export default function Avatar({ name, size = 38 }) {
  return (
    <div className="cc-avatar" style={{ width: size, height: size, fontSize: size * 0.34, background: avatarColor(name) }}>
      {initials(name)}
    </div>
  );
}
