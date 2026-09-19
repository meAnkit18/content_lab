import { NextResponse } from "next/server";
import { hasBearer } from "@/lib/apiAuth";
import { sweepExpired } from "@/lib/videos";

// Called daily by Vercel Cron (sends Authorization: Bearer $CRON_SECRET).
export async function GET(req) {
  if (!hasBearer(req, "CRON_SECRET")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ deleted: await sweepExpired() });
}
