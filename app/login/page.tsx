"use client";

import { type CSSProperties, type FormEvent, useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError("Wrong password");
        return;
      }

      // Full navigation so the new cookie is sent immediately (avoids client-router edge cases in dev).
      window.location.assign("/");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>Ultimate Travel Tips</p>
        <h1 style={styles.title}>Login</h1>
        <p style={styles.text}>Welcome to Ultimate Travel Tips, please login here.</p>
        <form onSubmit={onSubmit} style={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            style={styles.input}
            autoFocus
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Checking..." : "Enter"}
          </button>
        </form>
        {error ? <p style={styles.error}>{error}</p> : null}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily:
      'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  card: {
    width: "min(460px, 100%)",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 14px 38px rgba(15, 23, 42, 0.07)",
  },
  kicker: {
    margin: 0,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontSize: 12,
    fontWeight: 600,
  },
  title: { margin: "8px 0 10px" },
  text: { margin: "0 0 14px", color: "#475569" },
  form: { display: "grid", gap: 10 },
  input: {
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 14,
  },
  button: {
    border: 0,
    borderRadius: 10,
    padding: "10px 12px",
    background: "#0f172a",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    marginTop: 10,
    color: "#be123c",
    fontSize: 14,
  },
};
