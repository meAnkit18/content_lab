import { NextResponse } from "next/server";
import { hasBearer } from "@/lib/apiAuth";
import { signUpload } from "@/lib/cloudinary";

const SLUG = /^[a-z0-9][a-z0-9-]{2,120}$/;

// Step 1 for the agent: get signed params, then upload the file directly to Cloudinary.
export async function POST(req) {
  if (!hasBearer(req, "INGEST_API_KEY")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug, project = "dmoo-way" } = await req.json().catch(() => ({}));
  if (!SLUG.test(slug || "") || !SLUG.test(project)) return NextResponse.json({ error: "invalid slug/project" }, { status: 400 });
  return NextResponse.json(signUpload(`${project}/${slug}`));
}
