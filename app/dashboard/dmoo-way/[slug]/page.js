import Link from "next/link";
import { notFound } from "next/navigation";
import { videosCol } from "@/lib/videos";
import CopyButton from "../copy";
import PlatformToggle from "../toggle";

export const dynamic = "force-dynamic";

const download = (url) => url.replace("/upload/", "/upload/fl_attachment/");
const asText = (v) => (Array.isArray(v) ? v.join(", ") : String(v));

export default async function VideoPage({ params }) {
  const { slug } = await params;
  const v = await (await videosCol()).findOne({ slug, project: "dmoo-way" });
  if (!v) notFound();

  return (
    <>
      <p><Link href="/dashboard/dmoo-way" style={{ color: "#000" }}>← Dmoo Way</Link></p>
      <h1>{v.title}</h1>
      {v.videoDeleted ? (
        <p>Video deleted from storage.</p>
      ) : (
        <>
          <video src={v.videoUrl} controls playsInline preload="metadata" style={{ maxWidth: "100%", maxHeight: "70vh", background: "#000" }} />
          <p>
            <a href={v.videoUrl} target="_blank" rel="noreferrer">Open</a>
            {" | "}
            <a href={download(v.videoUrl)}>Download</a>
          </p>
          <p>
            <small>
              {v.deleteAt
                ? `All platforms published — video auto-deletes ${v.deleteAt.toUTCString()}.`
                : "Video is deleted from storage 1 day after every platform is marked Published."}
            </small>
          </p>
        </>
      )}
      {Object.entries(v.platforms || {}).map(([platform, fields]) => (
        <section key={platform} style={{ border: "1px solid #000", padding: 12, marginBottom: 16 }}>
          <h2 style={{ marginTop: 0, textTransform: "capitalize" }}>{platform}</h2>
          <PlatformToggle slug={v.slug} platform={platform} published={!!v.published?.[platform]} />
          {Object.entries(fields).map(([name, value]) => (
            <div key={name} style={{ margin: "10px 0" }}>
              <div>{name} <CopyButton text={asText(value)} /></div>
              <div style={{ whiteSpace: "pre-wrap" }}>{asText(value)}</div>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
