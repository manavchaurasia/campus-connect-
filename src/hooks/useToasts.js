import { useState } from "react";
import { uid } from "../utils";

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  function push(msg) {
    const id = uid();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400);
  }
  return { toasts, push };
}
