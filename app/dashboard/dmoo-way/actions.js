"use server";

import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { COOKIE, verifyToken } from "@/lib/session";
import { videosCol } from "@/lib/videos";

const DAY = 24 * 60 * 60 * 1000;

// Publish starts a 1-day countdown to Cloudinary deletion; un-publishing cancels it.
export async function setPublished(id, published) {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !(await verifyToken(token))) throw new Error("unauthorized");

  const col = await videosCol();
  const filter = { _id: new ObjectId(id), videoDeleted: { $ne: true } };
  await col.updateOne(
    filter,
    published
      ? { $set: { status: "published", publishedAt: new Date(), deleteAt: new Date(Date.now() + DAY) } }
      : { $set: { status: "unpublished" }, $unset: { publishedAt: "", deleteAt: "" } }
  );
  revalidatePath("/dashboard/dmoo-way");
}
