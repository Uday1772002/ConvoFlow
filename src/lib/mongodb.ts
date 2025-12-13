import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL || "mongodb://localhost:27017/convoflow";

if (!MONGODB_URI) {
  throw new Error("Please define the DATABASE_URL environment variable");
}

// @ts-expect-error - global.mongoose is not in the type definitions
let cached = global.mongoose;

if (!cached) {
  // @ts-expect-error - global.mongoose is not in the type definitions
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default mongoose;
