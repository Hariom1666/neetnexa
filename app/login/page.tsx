"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const supabase = getSupabaseClient();

    if (!supabase) {
      setMessage("Supabase configuration is missing.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Login successful. Opening your dashboard...");

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="container" style={{ padding: "60px 20px" }}>
      <div
        className="card"
        style={{ maxWidth: 460, margin: "auto", padding: 30 }}
      >
        <h1>Student Login</h1>

        <p style={{ color: "#667085" }}>
          Sign in to continue your Neet Nexa preparation.
        </p>

        <form
          onSubmit={handleLogin}
          style={{ display: "grid", gap: 14, marginTop: 22 }}
        >
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: 16 }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: 18 }}>
          New here?{" "}
          <Link
            href="/signup"
            style={{ color: "#176bff", fontWeight: 700 }}
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}