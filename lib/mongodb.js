import { MongoClient } from "mongodb";

// Reuse one client across hot reloads (dev) and warm serverless invocations (Vercel).
const globalForMongo = globalThis;

export function getDb() {
  if (!globalForMongo._mongoClient) {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
    globalForMongo._mongoClient = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 5,
    }).connect();
  }
  return globalForMongo._mongoClient.then((c) => c.db(process.env.MONGODB_DB || "contentlab"));
}
