import Link from "next/link";
import { notFound } from "next/navigation";
import { videosCol } from "@/lib/videos";
import CopyButton from "../../dmoo-way/copy";
import PlatformToggle from "../../dmoo-way/toggle";

export const dynamic = "force-dynamic";

const download = (url) => url.replace("/upload/", "/upload/fl_attachment/");
const asText = (v) => (Array.isArray(v) ? v.join(", ") : String(v));

export default async function LongVideoPage({ params }) {
  const { slug } = await params;
  const v = await (await videosCol()).findOne({ slug, project: "dmoo-way-long" });
  if (!v) notFound();

  return (
    <>
      <p><Link href="/dashboard/dmoo-way-long" style={{ color: "#000" }}>← Dmoo Way Long</Link></p>
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
        </>
      )}
      {!!v.thumbnails?.length && (
        <section style={{ border: "1px solid #000", padding: 12, marginBottom: 16 }}>
          <h2 style={{ marginTop: 0 }}>Thumbnails (YouTube Test &amp; Compare)</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {v.thumbnails.map((t, i) => (
              <div key={t.publicId}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.url} alt={`Thumbnail ${i + 1}`} style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", border: "1px solid #000" }} />
                <a href={download(t.url)}>Download {i + 1}</a>
              </div>
            ))}
          </div>
        </section>
      )}
      {Object.entries(v.platforms || {}).map(([platform, fields]) => (
        <section key={platform} style={{ border: "1px solid #000", padding: 12, marginBottom: 16 }}>
          <h2 style={{ marginTop: 0, textTransform: "capitalize" }}>{platform}</h2>
          <PlatformToggle slug={v.slug} platform={platform} published={!!v.published?.[platform]} />
          {Object.entries(fields).filter(([, value]) => asText(value).trim()).map(([name, value]) => (
            <div key={name} style={{ margin: "10px 0" }}>
              <div>{name.replace(/_/g, " ")} <CopyButton text={asText(value)} /></div>
              <div style={{ whiteSpace: "pre-wrap" }}>{asText(value)}</div>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
