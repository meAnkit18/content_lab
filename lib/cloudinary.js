import { createHash } from "crypto";

const cloud = () => process.env.CLOUDINARY_CLOUD_NAME;

// Cloudinary signature: sha1("k=v&k=v" sorted by key + api_secret)
function sign(params) {
  const str = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(str + process.env.CLOUDINARY_API_SECRET).digest("hex");
}

const RESOURCE_TYPES = new Set(["video", "image"]);
const rt = (t) => (RESOURCE_TYPES.has(t) ? t : "video");

function basicAuth() {
  return "Basic " + Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString("base64");
}

// Params the agent needs to upload straight to Cloudinary (the file never touches Vercel).
export function signUpload(publicId, resourceType = "video") {
  const params = { overwrite: "true", public_id: publicId, timestamp: Math.floor(Date.now() / 1000) };
  return {
    upload_url: `https://api.cloudinary.com/v1_1/${cloud()}/${rt(resourceType)}/upload`,
    api_key: process.env.CLOUDINARY_API_KEY,
    params: { ...params, signature: sign(params) },
  };
}

export async function getAsset(publicId, resourceType = "video") {
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud()}/resources/${rt(resourceType)}/upload/${encodeURIComponent(publicId).replace(/%2F/g, "/")}`,
    { headers: { Authorization: basicAuth() }, cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export const getVideo = (publicId) => getAsset(publicId, "video");

// Returns true when the asset is gone (deleted now, or already missing).
export async function deleteAsset(publicId, resourceType = "video") {
  const params = { invalidate: "true", public_id: publicId, timestamp: Math.floor(Date.now() / 1000) };
  const body = new URLSearchParams({ ...params, api_key: process.env.CLOUDINARY_API_KEY, signature: sign(params) });
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud()}/${rt(resourceType)}/destroy`, { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  return res.ok && (json.result === "ok" || json.result === "not found");
}

export const deleteVideo = (publicId) => deleteAsset(publicId, "video");
