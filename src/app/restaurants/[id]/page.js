import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB, plain } from "@/lib/db";
import { isObjectId } from "@/lib/orders";
import Restaurant from "@/models/Restaurant";
import Food from "@/models/Food";
import FoodCard from "@/components/FoodCard";

export const dynamic = "force-dynamic";

export default async function RestaurantPage({ params }) {
  if (!isObjectId(params.id)) notFound();
  await connectDB();
  const restaurant = await Restaurant.findById(params.id).lean();
  if (!restaurant) notFound();
  const foods = plain(await Food.find({ restaurant: params.id }).lean());

  const groups = foods.reduce((acc, f) => {
    const key = f.category || "Menu";
    (acc[key] ||= []).push(f);
    return acc;
  }, {});

  return (
    <main className="wrap">
      <Link href="/" className="back">← All kitchens</Link>
      <div className="banner">
        <span className="em">{restaurant.emoji}</span>
        <div>
          <h1>{restaurant.name}</h1>
          <div className="pills">
            <span className="rate">★ {restaurant.rating.toFixed(1)}</span>
            <span className="pill">{restaurant.etaMin} min</span>
            <span className={`pill ${restaurant.deliveryFee ? "" : "free"}`}>
              {restaurant.deliveryFee ? `$${restaurant.deliveryFee.toFixed(2)} delivery` : "Free delivery"}
            </span>
          </div>
        </div>
      </div>

      {Object.entries(groups).map(([cat, list]) => (
        <section key={cat}>
          <h2 className="cat">{cat}</h2>
          {list.map((f) => <FoodCard key={f._id} food={f} restaurantId={params.id} />)}
        </section>
      ))}
      {!foods.length && <p className="mute">This kitchen has no dishes yet.</p>}
    </main>
  );
}
