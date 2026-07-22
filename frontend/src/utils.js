const PALETTE = ["#2563EB", "#0D9488", "#7C3AED", "#B45309", "#0F172A", "#BE185C"];

export function initials(name) {
  return (name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function avatarColor(seed) {
  let h = 0;
  for (const c of seed || "?") h = (h * 31 + c.charCodeAt(0)) % PALETTE.length;
  return PALETTE[h];
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
