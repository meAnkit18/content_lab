import { NextResponse } from "next/server";
import { hasBearer } from "@/lib/apiAuth";
import { getAsset, getVideo } from "@/lib/cloudinary";
import { videosCol } from "@/lib/videos";

const SLUG = /^[a-z0-9][a-z0-9-]{2,120}$/;

// Step 2 for the agent: register the uploaded video + per-platform text. Idempotent by slug.
export async function POST(req) {
  if (!hasBearer(req, "INGEST_API_KEY")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const project = b.project || "dmoo-way";
  if (!SLUG.test(b.slug || "") || !SLUG.test(project)) return NextResponse.json({ error: "invalid slug/project" }, { status: 400 });
  if (!b.title || typeof b.platforms !== "object" || !b.platforms) {
    return NextResponse.json({ error: "title and platforms are required" }, { status: 400 });
  }

  const publicId = `${project}/${b.slug}`;
  const asset = await getVideo(publicId); // verify the upload really landed
  if (!asset) return NextResponse.json({ error: "video not found on Cloudinary" }, { status: 422 });

  // Long-form only: up to 3 thumbnail images (YouTube Test & Compare), uploaded beforehand.
  const thumbnails = [];
  for (const id of Array.isArray(b.thumbnails) ? b.thumbnails.slice(0, 3) : []) {
    if (typeof id !== "string" || !id.startsWith(`${project}/`)) return NextResponse.json({ error: "invalid thumbnail id" }, { status: 400 });
    const img = await getAsset(id, "image");
    if (!img) return NextResponse.json({ error: `thumbnail not found on Cloudinary: ${id}` }, { status: 422 });
    thumbnails.push({ publicId: id, url: img.secure_url });
  }

  const col = await videosCol();
  await col.updateOne(
    { slug: b.slug },
    {
      $set: {
        project,
        title: String(b.title),
        platforms: b.platforms,
        publicId,
        videoUrl: asset.secure_url,
        bytes: asset.bytes,
        duration: asset.duration,
        videoDeleted: false,
        ...(thumbnails.length ? { thumbnails } : {}),
        ...(typeof b.chapters === "string" ? { chapters: b.chapters } : {}),
      },
      $setOnInsert: { status: "unpublished", createdAt: new Date() },
    },
    { upsert: true }
  );
  return NextResponse.json({ ok: true, slug: b.slug, url: asset.secure_url });
}
