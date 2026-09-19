"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { COOKIE, verifyToken } from "@/lib/session";
import { videosCol } from "@/lib/videos";

const DAY = 24 * 60 * 60 * 1000;

// Each platform is toggled separately. Once every platform is published the
// 1-day countdown to Cloudinary deletion starts; un-publishing any one cancels it.
export async function setPlatformPublished(slug, platform, published) {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !(await verifyToken(token))) throw new Error("unauthorized");

  const col = await videosCol();
  const video = await col.findOne({ slug, videoDeleted: { $ne: true } });
  if (!video || !(platform in (video.platforms || {}))) throw new Error("not found");

  const state = { ...(video.published || {}), [platform]: !!published };
  const all = Object.keys(video.platforms).every((p) => state[p]);
  await col.updateOne(
    { _id: video._id },
    all
      ? { $set: { published: state, status: "published", deleteAt: new Date(Date.now() + DAY) } }
      : { $set: { published: state, status: "unpublished" }, $unset: { deleteAt: "" } }
  );
  revalidatePath("/dashboard/dmoo-way", "layout");
}
