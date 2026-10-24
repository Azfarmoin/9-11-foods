// Pure order validation/pricing so it can be unit-tested
export const isObjectId = (v) => typeof v === "string" && /^[a-f\d]{24}$/i.test(v);
export const SERVICE_FEE = 0.5;
const fail = (error, status = 400) => ({ error, status });

export function buildOrder({ restaurant, items, address, payment }, foods, deliveryFee) {
  if (!address || !address.trim()) return fail("Add a delivery address.");
  if (!["card", "cash", "wallet"].includes(payment)) return fail("Choose a valid payment method.");
  if (!Array.isArray(items) || !items.length) return fail("Your cart is empty.");

  // Merge duplicate lines and validate quantities
  const wanted = new Map();
  for (const i of items) {
    const qty = Number(i?.qty);
    if (!isObjectId(i?.food) || !Number.isInteger(qty) || qty < 1 || qty > 50)
      return fail("Invalid item in your cart.");
    wanted.set(i.food, (wanted.get(i.food) || 0) + qty);
  }

  const lines = [];
  for (const [id, qty] of wanted) {
    const f = foods.find((x) => String(x._id) === id);
    if (!f) return fail("Some items are unavailable.");
    lines.push({ food: f._id, name: f.name, price: f.price, qty: Math.min(qty, 50) });
  }
  const cents = lines.reduce((a, l) => a + Math.round(l.price * 100) * l.qty, 0);
  const total = (cents + Math.round((deliveryFee + SERVICE_FEE) * 100)) / 100;
  return { lines, total };
}
