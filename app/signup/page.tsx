"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

export default function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const supabase = getSupabaseClient();

    if (!supabase) {
      setMessage("Supabase configuration is missing.");
      setLoading(false);
      return;
    }

    // Step 1: Create the authentication account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setMessage("Account could not be created.");
      setLoading(false);
      return;
    }

    // Step 2: Save the student's profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        full_name: name,
        phone: phone || null,
        email: email,
      });

    if (profileError) {
      setMessage(
        `Account created, but profile could not be saved: ${profileError.message}`
      );
      setLoading(false);
      return;
    }

    setMessage(
      "Account and student profile created successfully."
    );

    setLoading(false);
  }

  return (
    <main
      className="container"
      style={{ padding: "60px 20px" }}
    >
      <div
        className="card"
        style={{
          maxWidth: 500,
          margin: "auto",
          padding: 30,
        }}
      >
        <h1>Create your account</h1>

        <p style={{ color: "#667085" }}>
          Create your Neet Nexa account to save your tests,
          results, progress and analytics.
        </p>

        <form
          onSubmit={handleSignup}
          style={{
            display: "grid",
            gap: 13,
            marginTop: 20,
          }}
        >
          <input
            className="input"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="input"
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: 16 }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: 18 }}>
          Already registered?{" "}
          <Link
            href="/login"
            style={{
              color: "#176bff",
              fontWeight: 700,
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}