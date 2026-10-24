"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { SERVICE_FEE } from "@/lib/orders";

const PAY = [["card", "💳 Card"], ["cash", "💵 Cash"], ["wallet", "👛 Wallet"]];

export default function CartPage() {
  const { list, restaurantId, change, clear, subtotal } = useCart();
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("card");
  const [rest, setRest] = useState(null);
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;
    fetch(`/api/restaurants/${restaurantId}`).then((r) => r.json())
      .then((d) => setRest({ name: d.name, fee: d.deliveryFee || 0 })).catch(() => setRest(null));
  }, [restaurantId]);

  if (done)
    return (
      <main className="wrap">
        <div className="panel done">
          <div className="em">🍱</div>
          <h1>Your tin is on its way</h1>
          <p className="mute">We told the kitchen. Total paid with fees: <b>${done.total.toFixed(2)}</b></p>
          <span className="stamp">Order {done.id.slice(-6)}</span>
          <p><Link className="back" href="/">Order something else</Link></p>
        </div>
      </main>
    );

  if (!list.length)
    return (
      <main className="wrap">
        <div className="empty">
          <div className="em">🥡</div>
          <h2>Your tin is empty</h2>
          <p className="mute">Pick a kitchen and add a dish to get started.</p>
          <Link href="/">Browse kitchens</Link>
        </div>
      </main>
    );

  const fee = rest?.fee ?? 0;
  const total = Math.round((subtotal + fee + SERVICE_FEE) * 100) / 100;

  async function place() {
    if (busy) return;
    setError("");
    if (!address.trim()) return setError("Enter a delivery address so the rider knows where to go.");
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant: restaurantId, address, payment,
          items: list.map((l) => ({ food: l.food._id, qty: l.qty })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data.error || "We couldn’t place the order. Try again.");
      clear();
      setDone({ id: data._id, total: data.total });
    } catch {
      setError("No connection. Check your internet and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="wrap">
      <Link href={`/restaurants/${restaurantId}`} className="back">← Back to menu</Link>
      <div className="panel">
        <h2>{rest?.name || "Your order"}</h2>
        {list.map(({ food, qty }) => (
          <div className="item" key={food._id}>
            <div className="dish" aria-hidden="true">{food.emoji}</div>
            <div className="grow"><b>{food.name}</b><p><span className="price">${(food.price * qty).toFixed(2)}</span></p></div>
            <div className="qty" role="group" aria-label={`${food.name} quantity`}>
              <button onClick={() => change(food, restaurantId, -1)} aria-label={`Remove one ${food.name}`}>−</button>
              <span key={qty}>{qty}</span>
              <button onClick={() => change(food, restaurantId, 1)} aria-label={`Add one more ${food.name}`}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <label className="fld" htmlFor="addr">Delivery address</label>
        <input id="addr" className="inp" placeholder="Street, building, apartment" autoComplete="street-address"
          value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="panel">
        <h2>Pay with</h2>
        <div className="pay" role="radiogroup" aria-label="Payment method">
          {PAY.map(([v, label]) => (
            <label key={v}><input type="radio" name="pay" value={v} checked={payment === v} onChange={() => setPayment(v)} />{label}</label>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="line"><span>Dishes</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="line"><span>Delivery</span><span>{rest ? (fee ? `$${fee.toFixed(2)}` : "Free") : "…"}</span></div>
        <div className="line"><span>Service fee</span><span>${SERVICE_FEE.toFixed(2)}</span></div>
        <div className="line tot"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>

      {error && <p className="err" role="alert">{error}</p>}
      <button className="btn" onClick={place} disabled={busy}>{busy ? "Placing order…" : `Place order, $${total.toFixed(2)}`}</button>
    </main>
  );
}
