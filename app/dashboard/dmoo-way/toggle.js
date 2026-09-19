"use client";

import { useTransition } from "react";
import { setPublished } from "./actions";

export default function PublishToggle({ id, published, disabled }) {
  const [pending, start] = useTransition();
  return (
    <label style={{ cursor: "pointer" }}>
      <input type="checkbox" checked={published} disabled={pending || disabled} onChange={(e) => start(() => setPublished(id, e.target.checked))} />{" "}
      {published ? "Published" : "Unpublished"}
    </label>
  );
}
