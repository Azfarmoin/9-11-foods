// Pure cart logic (no React) so it can be unit-tested
export const emptyCart = { restaurantId: null, lines: {} };
const isValidFood = (f) => f && f._id && Number.isFinite(f.price);

export const cartCount = (s) => Object.values(s.lines).reduce((a, l) => a + l.qty, 0);
export const cartSubtotal = (s) =>
  Math.round(Object.values(s.lines).reduce((a, l) => a + l.qty * l.food.price * 100, 0)) / 100;

// True when adding from another restaurant would mix carts
export const needsNewCart = (s, restaurantId) =>
  Object.keys(s.lines).length > 0 && s.restaurantId !== restaurantId;

export function applyChange(state, food, restaurantId, delta) {
  if (!isValidFood(food)) return state;
  const base = needsNewCart(state, restaurantId) ? emptyCart : state;
  const qty = (base.lines[food._id]?.qty || 0) + delta;
  const lines = { ...base.lines };
  if (qty <= 0) delete lines[food._id];
  else lines[food._id] = { food, qty: Math.min(qty, 50) };
  // An empty cart belongs to no restaurant
  return Object.keys(lines).length ? { restaurantId, lines } : emptyCart;
}
