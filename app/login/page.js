import LoginForm from "./form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, verifyToken } from "@/lib/session";

export default async function LoginPage() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (token && (await verifyToken(token))) redirect("/dashboard");
  return (
    <main style={{ maxWidth: 320, margin: "20vh auto 0", padding: "0 16px" }}>
      <h1>Content Lab</h1>
      <LoginForm />
    </main>
  );
}
