import Link from "next/link";
import { videosCol } from "@/lib/videos";

export const dynamic = "force-dynamic";

const thumb = (url) => url.replace("/video/upload/", "/video/upload/so_1,w_480/").replace(/\.\w+$/, ".jpg");

function statusOf(v) {
  const names = Object.keys(v.platforms || {});
  const n = names.filter((p) => v.published?.[p]).length;
  if (names.length && n === names.length) return { label: "Published", solid: true };
  return n ? { label: `Partly published (${n}/${names.length})`, solid: false } : { label: "Unpublished", solid: false };
}

// No sweepExpired() here: it is global, and the daily cron plus the Dmoo Way page already run it.
export default async function RedHatEngineer() {
  const videos = await (await videosCol()).find({ project: "redhat-engineer" }).sort({ createdAt: -1 }).toArray();

  return (
    <>
      <h1>RedHat Engineer</h1>
      {videos.length === 0 && <p>No videos uploaded yet.</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {videos.map((v) => {
          const st = statusOf(v);
          return (
            <Link key={v.slug} href={`/dashboard/redhat-engineer/${v.slug}`} style={{ border: "1px solid #000", color: "#000", textDecoration: "none", display: "block" }}>
              {v.videoDeleted ? (
                <div style={{ aspectRatio: "16 / 9", display: "grid", placeItems: "center", borderBottom: "1px solid #000" }}>Video deleted</div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb(v.videoUrl)} alt="" style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", display: "block", borderBottom: "1px solid #000" }} />
              )}
              <div style={{ padding: 8 }}>
                <span style={{ display: "inline-block", padding: "1px 6px", marginBottom: 6, fontSize: 12, border: "1px solid #000", background: st.solid ? "#000" : "#fff", color: st.solid ? "#fff" : "#000" }}>{st.label}</span>
                <br />
                <strong>{v.title}</strong>
                <div style={{ fontSize: 13, marginTop: 6 }}>
                  {Object.keys(v.platforms || {}).map((p) => (
                    <span key={p} style={{ marginRight: 8, textTransform: "capitalize" }}>{p} {v.published?.[p] ? "✓" : "–"}</span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
