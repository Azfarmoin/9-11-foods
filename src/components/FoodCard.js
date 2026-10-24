"use client";
import { useCart } from "./CartProvider";

export default function FoodCard({ food, restaurantId }) {
  const { list, change } = useCart();
  const qty = list.find((l) => l.food._id === food._id)?.qty || 0;
  return (
    <div className="item">
      <div className="dish" aria-hidden="true">{food.emoji}</div>
      <div className="grow">
        <b>{food.name}</b>
        <p>{food.description}</p>
        <span className="price">${food.price.toFixed(2)}</span>
      </div>
      {qty === 0 ? (
        <button className="add" onClick={() => change(food, restaurantId, 1)} aria-label={`Add ${food.name} to cart`}>Add</button>
      ) : (
        <div className="qty" role="group" aria-label={`${food.name} quantity`}>
          <button onClick={() => change(food, restaurantId, -1)} aria-label={`Remove one ${food.name}`}>−</button>
          <span key={qty} aria-live="polite">{qty}</span>
          <button onClick={() => change(food, restaurantId, 1)} aria-label={`Add one more ${food.name}`}>+</button>
        </div>
      )}
    </div>
  );
}
