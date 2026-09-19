import { timingSafeEqual } from "crypto";

// Constant-time bearer token check against an env var.
export function hasBearer(req, envName) {
  const expected = process.env[envName];
  if (!expected) return false;
  const given = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
