import { getDb } from "@/lib/mongodb";
import { deleteVideo } from "@/lib/cloudinary";

export async function videosCol() {
  const col = (await getDb()).collection("videos");
  await col.createIndex({ slug: 1 }, { unique: true });
  return col;
}

// Delete from Cloudinary every published video whose 1-day timer has run out.
export async function sweepExpired() {
  const col = await videosCol();
  const due = await col.find({ videoDeleted: { $ne: true }, deleteAt: { $lte: new Date() } }).toArray();
  let deleted = 0;
  for (const v of due) {
    if (await deleteVideo(v.publicId)) {
      await col.updateOne({ _id: v._id }, { $set: { videoDeleted: true, videoUrl: null, deletedAt: new Date() } });
      deleted++;
    }
  }
  return deleted;
}
