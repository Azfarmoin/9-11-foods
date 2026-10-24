import Link from "next/link";
import { connectDB, plain } from "@/lib/db";
import { escapeRegex } from "@/lib/text";
import Restaurant from "@/models/Restaurant";
import Food from "@/models/Food";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
  const q = (searchParams?.q || "").trim().slice(0, 60);
  const cuisine = searchParams?.cuisine || "";
  await connectDB();

  const filter = {};
  if (cuisine) filter.cuisine = cuisine;
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    const hit = await Food.find({ name: rx }).distinct("restaurant");
    filter.$or = [{ name: rx }, { _id: { $in: hit } }];
  }
  const [restaurants, cuisines] = await Promise.all([
    Restaurant.find(filter).sort({ rating: -1 }).lean().then(plain),
    Restaurant.distinct("cuisine"),
  ]);

  return (
    <>
      <section className="hero">
        <div className="in">
          <div>
            <h1>Hot lunch, packed and at your door.</h1>
            <p>Pick a kitchen nearby, fill your tin, and we bring it over.</p>
          </div>
          <div className="tin" aria-hidden="true"><b /><b /><b /></div>
        </div>
      </section>

      <div className="search">
        <form action="/" role="search">
          {cuisine && <input type="hidden" name="cuisine" value={cuisine} />}
          <input name="q" defaultValue={q} placeholder="Search a kitchen or a dish" aria-label="Search a kitchen or a dish" />
          <button type="submit">Search</button>
        </form>
      </div>

      <main className="wrap">
        <nav className="chips" aria-label="Cuisine">
          <Link className="chip" href={q ? `/?q=${encodeURIComponent(q)}` : "/"} aria-current={!cuisine}>All</Link>
          {cuisines.map((c) => (
            <Link key={c} className="chip" aria-current={cuisine === c}
              href={`/?cuisine=${encodeURIComponent(c)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>{c}</Link>
          ))}
        </nav>

        <div className="sec">
          <h2>{q || cuisine ? "Matching kitchens" : "Open near you"}</h2>
          <span className="mute">{restaurants.length} found</span>
        </div>

        {restaurants.map((r) => (
          <Link key={r._id} href={`/restaurants/${r._id}`} className="rcard">
            <div className="lid"><span className="em">{r.emoji}</span><span className="rate">★ {r.rating.toFixed(1)}</span></div>
            <div className="rbody">
              <h3>{r.name}</h3>
              <p className="mute">{r.cuisine}</p>
              <div className="pills">
                <span className="pill">{r.etaMin} min</span>
                <span className={`pill ${r.deliveryFee ? "" : "free"}`}>{r.deliveryFee ? `$${r.deliveryFee.toFixed(2)} delivery` : "Free delivery"}</span>
              </div>
            </div>
          </Link>
        ))}

        {!restaurants.length && (
          <div className="empty">
            <div className="em">🥡</div>
            <h2>{q || cuisine ? "No kitchens match that" : "No kitchens yet"}</h2>
            <p className="mute">{q || cuisine ? "Try a different dish or clear the filter." : "Run npm run seed to add sample kitchens."}</p>
            {(q || cuisine) && <Link href="/">Show all kitchens</Link>}
          </div>
        )}
      </main>
    </>
  );
}
