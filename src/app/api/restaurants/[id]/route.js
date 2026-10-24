import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import Food from "@/models/Food";

export async function GET(_req, { params }) {
  await connectDB();
  const restaurant = await Restaurant.findById(params.id).lean().catch(() => null);
  if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  const foods = await Food.find({ restaurant: params.id }).lean();
  return NextResponse.json({ ...restaurant, foods });
}
