import mongoose from "mongoose";

const cache = (globalThis._mongoose ||= { conn: null, promise: null });

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Set MONGODB_URI in .env.local");
  if (cache.conn) return cache.conn;
  cache.promise ||= mongoose.connect(uri);
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null; // allow retry after a failed connection
    throw err;
  }
  return cache.conn;
}

// Convert Mongo documents to plain JSON for server components
export const plain = (doc) => JSON.parse(JSON.stringify(doc));
