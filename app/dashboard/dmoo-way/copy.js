"use client";

import { useState } from "react";

export default function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      style={{ padding: "2px 8px", border: "1px solid #000", background: "#fff", color: "#000", cursor: "pointer" }}
    >
      {done ? "Copied" : "Copy"}
    </button>
  );
}
