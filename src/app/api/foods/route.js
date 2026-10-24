import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Food from "@/models/Food";

// GET /api/foods?q=pizza&category=Drinks
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const filter = {};
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  if (q) filter.name = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  if (category) filter.category = category;
  return NextResponse.json(await Food.find(filter).populate("restaurant", "name emoji").lean());
}
