"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main style={{ padding: 24, maxWidth: 320 }}>
      <form action={action} style={{ display: "grid", gap: 12 }}>
        <input name="username" placeholder="username" required />
        <input name="password" type="password" placeholder="password" required />
        <button disabled={pending}>{pending ? "Signing in..." : "Login"}</button>
        {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
      </form>
    </main>
  );
}