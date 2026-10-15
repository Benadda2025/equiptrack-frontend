import { Suspense } from "react";

const BACKEND = process.env.API_URL ?? "http://localhost:5000";

async function Greeting() {
  const res = await fetch(`${BACKEND}/api/v1/hello/greeting`, {
    headers: { accept: "application/json" },
  });
  const data = await res.json();
  return <h1>{data.message}</h1>;
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<p>Loading...</p>}>
        <Greeting />
      </Suspense>
    </main>
  );
}