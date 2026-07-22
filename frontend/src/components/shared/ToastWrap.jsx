export default function ToastWrap({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 18, left: "50%", transform: "translateX(-50%)", zIndex: 999, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      {toasts.map((t) => <div key={t.id} className="cc-toast cc-rise">{t.msg}</div>)}
    </div>
  );
}
