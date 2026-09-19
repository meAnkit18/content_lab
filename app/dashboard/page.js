import { logout } from "../actions";

export default function Dashboard() {
  return (
    <main style={{ padding: 16 }}>
      <h1>Dashboard</h1>
      <form action={logout}>
        <button type="submit" style={{ padding: "6px 12px", border: "1px solid #000", background: "#fff", color: "#000", cursor: "pointer" }}>Logout</button>
      </form>
    </main>
  );
}
