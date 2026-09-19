import { sweepExpired, videosCol } from "@/lib/videos";
import CopyButton from "./copy";
import PublishToggle from "./toggle";

export const dynamic = "force-dynamic";

const box = { border: "1px solid #000", padding: 12, marginBottom: 16 };
const download = (url) => url.replace("/upload/", "/upload/fl_attachment/");
const asText = (v) => (Array.isArray(v) ? v.join(", ") : String(v));

export default async function DmooWay() {
  await sweepExpired().catch(() => {}); // backstop for the daily cron
  const videos = await (await videosCol()).find({ project: "dmoo-way" }).sort({ createdAt: -1 }).toArray();

  return (
    <>
      <h1>Dmoo Way</h1>
      {videos.length === 0 && <p>No videos uploaded yet.</p>}
      {videos.map((v) => {
        const id = v._id.toString();
        const published = v.status === "published";
        return (
          <section key={id} style={box}>
            <h2 style={{ marginTop: 0 }}>{v.title}</h2>
            <p>
              <PublishToggle id={id} published={published} disabled={v.videoDeleted} />
              {published && !v.videoDeleted && v.deleteAt && <small> — video auto-deletes {v.deleteAt.toUTCString()}</small>}
            </p>
            {v.videoDeleted ? (
              <p>Video deleted from storage.</p>
            ) : (
              <p>
                <a href={v.videoUrl} target="_blank" rel="noreferrer">Open</a>
                {" | "}
                <a href={download(v.videoUrl)}>Download</a>
              </p>
            )}
            {Object.entries(v.platforms || {}).map(([platform, fields]) => (
              <div key={platform} style={{ marginTop: 12 }}>
                <strong style={{ textTransform: "capitalize" }}>{platform}</strong>
                {Object.entries(fields).map(([name, value]) => (
                  <div key={name} style={{ margin: "6px 0" }}>
                    <div>{name} <CopyButton text={asText(value)} /></div>
                    <div style={{ whiteSpace: "pre-wrap" }}>{asText(value)}</div>
                  </div>
                ))}
              </div>
            ))}
          </section>
        );
      })}
    </>
  );
}
