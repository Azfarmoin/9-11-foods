"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { applyChange, cartCount, cartSubtotal, emptyCart, needsNewCart } from "@/lib/cart";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export default function CartProvider({ children }) {
  const [state, setState] = useState(emptyCart);

  const value = useMemo(() => {
    const change = (food, restaurantId, delta) => {
      if (delta > 0 && needsNewCart(state, restaurantId) &&
          !confirm("Your cart has items from another restaurant. Start a new cart?")) return;
      setState((s) => applyChange(s, food, restaurantId, delta));
    };
    return {
      restaurantId: state.restaurantId,
      list: Object.values(state.lines),
      change,
      clear: () => setState(emptyCart),
      count: cartCount(state),
      subtotal: cartSubtotal(state),
    };
  }, [state]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
