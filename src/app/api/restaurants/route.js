import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Restaurant from "@/models/Restaurant";

export async function GET() {
  await connectDB();
  return NextResponse.json(await Restaurant.find().sort({ rating: -1 }).lean());
}
