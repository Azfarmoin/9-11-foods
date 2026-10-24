import "./globals.css";
import Link from "next/link";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import CartProvider from "@/components/CartProvider";
import CartBar from "@/components/CartBar";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["700", "800"] });
const body = Figtree({ subsets: ["latin"], variable: "--font-body" });

export const metadata = { title: "9-11 Foods", description: "Hot food from nearby kitchens, delivered to your door." };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>
          <div className="top">
            <div className="in">
              <Link href="/" className="brand"><i>🍱</i>9-11 Foods</Link>
              <span className="hint">Delivering now</span>
            </div>
          </div>
          {children}
          <CartBar />
        </CartProvider>
      </body>
    </html>
  );
}
