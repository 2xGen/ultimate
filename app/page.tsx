"use client";

import { type CSSProperties, type FormEvent, useMemo, useState } from "react";

const SITE_ORIGIN = "https://ultimate-travel-tips.com";

function buildGoLink(inputUrl: string): string {
  const parsed = new URL(inputUrl.trim());
  if (!parsed.hostname.toLowerCase().includes("viator.com")) {
    throw new Error("Please paste a valid Viator URL.");
  }

  const cleanedPath = parsed.pathname.replace(/^\/+/, "");
  if (!cleanedPath) {
    throw new Error("This Viator URL has no path to convert.");
  }

  const suffix = parsed.search || "";
  return `${SITE_ORIGIN}/go/${cleanedPath}${suffix}`;
}

export default function HomePage() {
  const [sourceUrl, setSourceUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [error, setError] = useState("");
  const canCopy = useMemo(() => Boolean(generatedUrl), [generatedUrl]);

  function onGenerate(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError("");

    try {
      const result = buildGoLink(sourceUrl);
      setGeneratedUrl(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid URL.";
      setGeneratedUrl("");
      setError(message);
    }
  }

  async function onCopy(): Promise<void> {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.kicker}>Ultimate Travel Tips</p>
        <h1 style={styles.title}>Viator Link Generator</h1>
        <p style={styles.subtitle}>
          Paste any Viator tour URL to generate a branded share link under
          <code style={styles.code}> /go/...</code>.
        </p>

        <form onSubmit={onGenerate} style={styles.form}>
          <label htmlFor="viator-url" style={styles.label}>
            Full Viator URL
          </label>
          <textarea
            id="viator-url"
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            placeholder="https://www.viator.com/tours/Aruba/Natural-Pool-Horseback-Riding-Tour-in-Aruba/d28-14261P1"
            style={styles.textarea}
            rows={4}
          />
          <button type="submit" style={styles.primaryButton}>
            Generate `/go` link
          </button>
        </form>

        {error ? <p style={styles.error}>{error}</p> : null}

        {generatedUrl ? (
          <div style={styles.resultWrap}>
            <p style={styles.resultLabel}>Generated link</p>
            <code style={styles.resultCode}>{generatedUrl}</code>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={onCopy}
              disabled={!canCopy}
            >
              Copy
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    margin: 0,
    padding: "24px",
    display: "grid",
    placeItems: "center",
    color: "#0f172a",
    background:
      "radial-gradient(1100px 700px at 10% 0%, rgba(56, 189, 248, 0.15), transparent 60%), radial-gradient(900px 650px at 90% 10%, rgba(167, 139, 250, 0.12), transparent 58%), linear-gradient(180deg, #f8fbff 0%, #f2f7ff 45%, #eef4ff 100%)",
    fontFamily:
      'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  hero: {
    width: "min(860px, 100%)",
    background: "rgba(255, 255, 255, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 22px 60px rgba(30, 41, 59, 0.14)",
    backdropFilter: "blur(6px)",
  },
  kicker: {
    margin: 0,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontSize: "12px",
  },
  title: { margin: "8px 0 12px", fontSize: "2rem" },
  subtitle: { margin: "0 0 18px", color: "#334155" },
  code: {
    marginLeft: 6,
    background: "rgba(148, 163, 184, 0.18)",
    borderRadius: 8,
    padding: "2px 6px",
  },
  form: { display: "grid", gap: 10 },
  label: { fontWeight: 600, fontSize: 14 },
  textarea: {
    width: "100%",
    resize: "vertical",
    borderRadius: 12,
    border: "1px solid rgba(148, 163, 184, 0.35)",
    background: "#ffffff",
    color: "#0f172a",
    padding: 12,
    lineHeight: 1.4,
    fontSize: 14,
  },
  primaryButton: {
    width: "fit-content",
    border: 0,
    borderRadius: 10,
    padding: "10px 14px",
    background: "#0f172a",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },
  error: { color: "#be123c", marginTop: 12 },
  resultWrap: {
    marginTop: 20,
    borderRadius: 14,
    border: "1px solid rgba(148, 163, 184, 0.26)",
    padding: 12,
    background: "rgba(255, 255, 255, 0.7)",
    display: "grid",
    gap: 10,
  },
  resultLabel: {
    margin: 0,
    color: "#334155",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  resultCode: {
    display: "block",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
    background: "rgba(148, 163, 184, 0.14)",
    borderRadius: 10,
    padding: "10px 12px",
    color: "#0f172a",
  },
  secondaryButton: {
    width: "fit-content",
    border: "1px solid rgba(100, 116, 139, 0.42)",
    borderRadius: 10,
    padding: "8px 12px",
    background: "#ffffff",
    color: "#0f172a",
    cursor: "pointer",
  },
};
