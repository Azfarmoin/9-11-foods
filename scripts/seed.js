import mongoose from "mongoose";
import Restaurant from "../src/models/Restaurant.js";
import Food from "../src/models/Food.js";
import { restaurants, foods } from "./data.js";

if (!process.env.MONGODB_URI) throw new Error("Set MONGODB_URI in .env.local");
await mongoose.connect(process.env.MONGODB_URI);
try {
  await Promise.all([Restaurant.deleteMany({}), Food.deleteMany({})]);
  const created = await Restaurant.insertMany(restaurants.map(({ key, ...r }) => r));
  const byKey = Object.fromEntries(restaurants.map((r, i) => [r.key, created[i]._id]));
  await Food.insertMany(foods.map(({ r, ...f }) => ({ ...f, restaurant: byKey[r] })));
  console.log(`Seeded ${created.length} restaurants and ${foods.length} foods`);
} finally {
  await mongoose.disconnect();
}
