import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI est manquant");
  }

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log("MongoDB connecte");
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
