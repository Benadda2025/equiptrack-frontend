import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "@/app/login/actions";

const BACKEND = process.env.API_URL ?? "http://localhost:5000";

async function Secret() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");

  const res = await fetch(`${BACKEND}/api/v1/hello/secret`, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
  });
  if (res.status === 401) redirect("/login");

  const data = await res.json();
  return <p>{data.message}</p>;
}

export default function Dashboard() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Secret />
      </Suspense>
      <form action={logout}>
        <button>Logout</button>
      </form>
    </main>
  );
}