"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const payload = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !payload.success) {
        setError(payload.error ?? "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-14">
      <h1 className="font-heading text-3xl text-primary">Create account</h1>
      <p className="mt-2 text-sm text-text-muted">Start learning and building your career with Kohaq.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div>
          <label className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">Full name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2"
          />
        </div>
        <div>
          <label className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2"
          />
        </div>
        <div>
          <label className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2"
          />
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111] disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-text-muted">
        Already have an account? <Link href="/login" className="text-accent">Sign in</Link>
      </p>
    </main>
  );
}

