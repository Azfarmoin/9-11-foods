import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { buildOrder, isObjectId } from "@/lib/orders";
import Order from "@/models/Order";
import Food from "@/models/Food";
import Restaurant from "@/models/Restaurant";

export async function GET() {
  await connectDB();
  return NextResponse.json(await Order.find().sort({ createdAt: -1 }).limit(50).lean());
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  if (!isObjectId(body.restaurant)) return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  await connectDB();
  const rest = await Restaurant.findById(body.restaurant).lean();
  if (!rest) return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });

  const ids = Array.isArray(body.items) ? body.items.map((i) => i?.food).filter(isObjectId) : [];
  const foods = await Food.find({ _id: { $in: ids }, restaurant: body.restaurant }).lean();

  // Prices come from the database, never from the client
  const result = buildOrder(body, foods, rest.deliveryFee);
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });

  const order = await Order.create({
    restaurant: body.restaurant, items: result.lines, address: body.address.trim(),
    payment: body.payment, total: result.total,
  });
  return NextResponse.json(order, { status: 201 });
}
