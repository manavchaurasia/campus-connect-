import { useState } from "react";
import {
  ShoppingBag
} from "lucide-react";
import SectionHead from "../shared/SectionHead";
import { avatarColor, uid } from "../../utils";

export default function MarketView({ me, data, persistData, toast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", price: "", cond: "Good", cat: "Books" });

  function sell(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.price.trim()) return;
    persistData((d) => ({ ...d, market: [{ id: uid(), title: form.title, price: form.price, seller: me.name, cond: form.cond, cat: form.cat }, ...d.market] }));
    setForm({ title: "", price: "", cond: "Good", cat: "Books" }); setShowForm(false); toast("Listed for sale");
  }
  function remove(id) { persistData((d) => ({ ...d, market: d.market.filter((m) => m.id !== id) })); toast("Listing removed"); }

  return (
    <div>
      <SectionHead eyebrow="Swap shop" title="Marketplace" sub="Buy and sell books, gear and more within campus." action={<button className="btn-cc-accent" onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ Sell an item"}</button>} />
      {showForm && (
        <form onSubmit={sell} className="cc-card cc-rise" style={{ padding: 14, marginBottom: 16 }}>
          <input required className="cc-input" style={{ marginBottom: 8 }} placeholder="Item title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <div style={{ display: "flex", gap: 8 }}>
            <input required className="cc-input" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            <select className="cc-input" value={form.cond} onChange={(e) => setForm((f) => ({ ...f, cond: e.target.value }))}>{["Like new", "Good", "Fair"].map((c) => <option key={c}>{c}</option>)}</select>
            <select className="cc-input" value={form.cat} onChange={(e) => setForm((f) => ({ ...f, cat: e.target.value }))}>{["Books", "Electronics", "Stationery", "Apparel", "Other"].map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <button className="btn-cc-primary" style={{ marginTop: 10 }}>List item</button>
        </form>
      )}
      <div className="cc-grid-3">
        {data.market.map((m) => (
          <div key={m.id} className="cc-card pin" style={{ overflow: "hidden", "--stripe": avatarColor(m.cat) }}>
            <div className="cc-thumb" style={{ height: 96, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--chalk-2)" }}><ShoppingBag size={26} color={avatarColor(m.title)} /></div>
            <div style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ fontWeight: 700, fontSize: 13 }}>{m.title}</span><span className="font-mono" style={{ fontWeight: 700, fontSize: 13 }}>{m.price}</span></div>
              <div style={{ fontSize: 11.5, color: "var(--slate)", marginTop: 6 }}>{m.cond} · {m.cat} · sold by {m.seller}</div>
              {m.seller === me.name && <button className="btn-cc-danger" style={{ width: "100%", marginTop: 8, padding: "6px 12px" }} onClick={() => remove(m.id)}>Remove listing</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
