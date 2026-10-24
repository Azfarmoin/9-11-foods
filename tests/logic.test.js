import test from "node:test";
import assert from "node:assert/strict";
import { applyChange, emptyCart, cartCount, cartSubtotal, needsNewCart } from "../src/lib/cart.js";
import { buildOrder, isObjectId } from "../src/lib/orders.js";
import { restaurants, foods } from "../scripts/data.js";

const id = (n) => String(n).padStart(24, "a");
const burger = { _id: id(1), name: "Burger", price: 8.5 };
const pizza = { _id: id(2), name: "Pizza", price: 9.5 };

test("seed data: 9-11 foods, unique, every restaurant has a menu", () => {
  assert.ok(foods.length >= 9 && foods.length <= 11);
  assert.equal(new Set(foods.map((f) => f.name)).size, foods.length);
  for (const r of restaurants) assert.ok(foods.filter((f) => f.r === r.key).length >= 2, r.key);
  assert.ok(foods.every((f) => f.price > 0));
});

test("cart: add, increment, remove", () => {
  let s = applyChange(emptyCart, burger, "R1", 1);
  s = applyChange(s, burger, "R1", 1);
  assert.equal(cartCount(s), 2);
  assert.equal(cartSubtotal(s), 17);
  s = applyChange(s, burger, "R1", -2);
  assert.equal(cartCount(s), 0);
});

test("cart: emptied cart forgets its restaurant (no false 'other restaurant' prompt)", () => {
  let s = applyChange(emptyCart, burger, "R1", 1);
  s = applyChange(s, burger, "R1", -1);
  assert.equal(s.restaurantId, null);
  assert.equal(needsNewCart(s, "R2"), false);
});

test("cart: switching restaurant starts a new cart", () => {
  let s = applyChange(emptyCart, burger, "R1", 1);
  assert.equal(needsNewCart(s, "R2"), true);
  s = applyChange(s, pizza, "R2", 1);
  assert.deepEqual(Object.keys(s.lines), [pizza._id]);
});

test("cart: floating point subtotal and quantity cap", () => {
  const f = { _id: id(3), price: 0.1 };
  let s = emptyCart;
  for (let i = 0; i < 3; i++) s = applyChange(s, f, "R1", 1);
  assert.equal(cartSubtotal(s), 0.3);
  for (let i = 0; i < 60; i++) s = applyChange(s, f, "R1", 1);
  assert.equal(cartCount(s), 50);
});

const base = { address: "1 Main St", payment: "card" };
test("order: server prices, fees and rounding", () => {
  const r = buildOrder({ ...base, items: [{ food: burger._id, qty: 2 }] }, [burger], 1.5);
  assert.equal(r.total, 19);
  assert.equal(r.lines[0].price, 8.5);
});

test("order: duplicate lines merge", () => {
  const r = buildOrder({ ...base, items: [{ food: burger._id, qty: 1 }, { food: burger._id, qty: 2 }] }, [burger], 0);
  assert.equal(r.lines.length, 1);
  assert.equal(r.lines[0].qty, 3);
});

test("order: rejects bad input", () => {
  const ok = [{ food: burger._id, qty: 1 }];
  assert.match(buildOrder({ ...base, address: " ", items: ok }, [burger], 0).error, /address/);
  assert.match(buildOrder({ ...base, payment: "bitcoin", items: ok }, [burger], 0).error, /payment/);
  assert.match(buildOrder({ ...base, items: [] }, [burger], 0).error, /empty/);
  assert.match(buildOrder({ ...base, items: [{ food: "nope", qty: 1 }] }, [burger], 0).error, /Invalid/);
  for (const qty of [0, -1, 1.5, "x", 999]) assert.ok(buildOrder({ ...base, items: [{ food: burger._id, qty }] }, [burger], 0).error);
  assert.match(buildOrder({ ...base, items: [{ food: pizza._id, qty: 1 }] }, [burger], 0).error, /unavailable/);
  assert.equal(isObjectId(burger._id), true);
});
