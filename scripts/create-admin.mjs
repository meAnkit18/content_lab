// Usage: npm run create-admin -- <email-or-username> <password>
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

const [identifier, password] = process.argv.slice(2);
if (!identifier || !password || password.length < 8) {
  console.error("Usage: npm run create-admin -- <email-or-username> <password (min 8 chars)>");
  process.exit(1);
}

const client = await new MongoClient(process.env.MONGODB_URI).connect();
const users = client.db(process.env.MONGODB_DB || "contentlab").collection("users");
await users.createIndex({ identifier: 1 }, { unique: true });
await users.updateOne(
  { identifier: identifier.trim().toLowerCase() },
  { $set: { passwordHash: await bcrypt.hash(password, 12), role: "admin" } },
  { upsert: true }
);
console.log("Admin saved:", identifier);
await client.close();
