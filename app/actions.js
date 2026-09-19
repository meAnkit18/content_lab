"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import { COOKIE, MAX_AGE, createToken } from "@/lib/session";

// Valid bcrypt hash used to keep timing similar when the user does not exist.
const DUMMY_HASH = "$2b$12$XlkOFzpTY4KM3RAXmEPBe.4UOOryG.sqlVpnQXzQqBPErF3s4lsOK";

export async function login(_prev, formData) {
  const identifier = String(formData.get("identifier") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!identifier || !password) return { error: "Enter your email and password." };

  const db = await getDb();
  const user = await db.collection("users").findOne({ identifier });
  const ok = await bcrypt.compare(password, user?.passwordHash || DUMMY_HASH);
  if (!user || !ok) return { error: "Invalid credentials." };

  const token = await createToken(user._id.toString());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  redirect("/dashboard");
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/login");
}
