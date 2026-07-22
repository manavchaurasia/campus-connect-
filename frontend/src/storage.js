// Persists app state to the browser's localStorage, namespaced under "campusconnect:".
// Kept async (returning Promises) so call sites don't need to change if you ever swap
// this out for a real backend/API later.

const PREFIX = "campusconnect:";

export async function storageGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw != null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export async function storageSet(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* best effort — e.g. storage full or unavailable (private browsing) */
  }
}
