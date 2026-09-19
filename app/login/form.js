"use client";

import { useActionState, useState } from "react";
import { login } from "../actions";

const field = { display: "block", width: "100%", boxSizing: "border-box", padding: 8, margin: "4px 0 16px", border: "1px solid #000", background: "#fff", color: "#000" };

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  const [show, setShow] = useState(false);
  return (
    <form action={action}>
      <label>Email or username
        <input name="identifier" type="text" autoComplete="username" required style={field} />
      </label>
      <label>Password
        <input name="password" type={show ? "text" : "password"} autoComplete="current-password" required style={{ ...field, marginBottom: 8 }} />
      </label>
      <button type="button" onClick={() => setShow(!show)} style={{ margin: "0 0 16px", padding: 0, border: 0, background: "none", color: "#000", textDecoration: "underline", cursor: "pointer" }}>
        {show ? "Hide password" : "Show password"}
      </button>
      {state?.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={pending} style={{ padding: "8px 16px", border: "1px solid #000", background: "#000", color: "#fff", cursor: "pointer" }}>
        Login
      </button>
    </form>
  );
}
