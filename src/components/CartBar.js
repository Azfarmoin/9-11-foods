"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

export default function CartBar() {
  const { count, subtotal } = useCart();
  const path = usePathname();
  if (!count || path === "/cart") return null; // don't cover the checkout button
  return (
    <Link href="/cart" className="bar" aria-label={`View cart, ${count} items, $${subtotal.toFixed(2)}`}>
      <span><span className="n">{count}</span>View your tin</span>
      <span className="t">${subtotal.toFixed(2)}</span>
    </Link>
  );
}
