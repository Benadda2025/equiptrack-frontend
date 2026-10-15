"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND = process.env.API_URL ?? "http://localhost:5000";

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  let data: { access_token: string; refresh_token?: string };
  try {
    const res = await fetch(`${BACKEND}/api/v1/security/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, provider: "db", refresh: true }),
    });
    if (!res.ok) return { error: "Invalid username or password" };
    data = await res.json();
  } catch {
    return { error: "Cannot reach the backend" };
  }

  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
  const jar = await cookies();
  jar.set("token", data.access_token, { ...opts, maxAge: 60 * 15 });
  if (data.refresh_token) {
    jar.set("refresh_token", data.refresh_token, { ...opts, maxAge: 60 * 60 * 24 * 7 });
  }

  redirect("/dashboard"); // keep outside try/catch
}

export async function logout() {
  const jar = await cookies();
  jar.delete("token");
  jar.delete("refresh_token");
  redirect("/login");
}