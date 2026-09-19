import { NextResponse } from "next/server";
import { COOKIE, verifyToken } from "@/lib/session";

export async function middleware(req) {
  const token = req.cookies.get(COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
