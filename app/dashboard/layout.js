import Link from "next/link";
import { logout } from "../actions";

const link = { display: "block", padding: "8px 0", color: "#000" };

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav style={{ width: 200, borderRight: "1px solid #000", padding: 16, boxSizing: "border-box" }}>
        <strong>Content Lab</strong>
        <div style={{ marginTop: 16 }}>
          <Link href="/dashboard" style={link}>Dashboard</Link>
          <Link href="/dashboard/dmoo-way" style={link}>Dmoo Way</Link>
        </div>
        <form action={logout} style={{ marginTop: 24 }}>
          <button type="submit" style={{ padding: "6px 12px", border: "1px solid #000", background: "#fff", color: "#000", cursor: "pointer" }}>Logout</button>
        </form>
      </nav>
      <main style={{ flex: 1, padding: 16, minWidth: 0 }}>{children}</main>
    </div>
  );
}
