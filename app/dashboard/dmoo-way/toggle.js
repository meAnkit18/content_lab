"use client";

import { useTransition } from "react";
import { setPlatformPublished } from "./actions";

export default function PlatformToggle({ slug, platform, published }) {
  const [pending, start] = useTransition();
  return (
    <label style={{ cursor: "pointer" }}>
      <input type="checkbox" checked={published} disabled={pending} onChange={(e) => start(() => setPlatformPublished(slug, platform, e.target.checked))} />{" "}
      {published ? "Published" : "Unpublished"}
    </label>
  );
}
