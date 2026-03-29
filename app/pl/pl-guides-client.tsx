"use client";

import { type CSSProperties, useMemo, useState } from "react";

import type { PackingListGuideRow } from "../../lib/packing-list-guides";

type Props = {
  rows: PackingListGuideRow[];
};

export function PlGuidesClient({ rows }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const list = useMemo(() => rows, [rows]);

  async function copyLink(id: string, url: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.stack}>
        <p style={styles.pageBrand}>Ultimate Travel Tips</p>
        <section style={styles.card} aria-labelledby="pl-heading">
          <p style={styles.cardKicker}>Travel guides</p>
          <h1 id="pl-heading" style={styles.title}>
            Packing list travel guides
          </h1>
          <p style={styles.lead}>
            Public travel guide URLs (Amazon disclosure pages). Curaçao and general beach lists are on{" "}
            <a href="https://toptours.ai" style={styles.inlineLink}>
              TopTours.ai
            </a>
            ; Aruba links to{" "}
            <a href="https://arubabuddies.com" style={styles.inlineLink}>
              ArubaBuddies
            </a>
            .
          </p>

          <div style={styles.list}>
            {list.map((row) => (
              <div key={row.id} style={styles.block}>
                <div style={styles.rowHeader}>
                  <span style={styles.rowTitle}>{row.label}</span>
                  <button
                    type="button"
                    style={styles.copyButton}
                    onClick={() => copyLink(row.id, row.url)}
                  >
                    {copiedId === row.id ? "Copied" : "Copy"}
                  </button>
                </div>
                <code style={styles.urlCode}>{row.url}</code>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    margin: 0,
    padding: "24px 24px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#0f172a",
    background:
      "radial-gradient(1100px 700px at 10% 0%, rgba(56, 189, 248, 0.15), transparent 60%), radial-gradient(900px 650px at 90% 10%, rgba(167, 139, 250, 0.12), transparent 58%), linear-gradient(180deg, #f8fbff 0%, #f2f7ff 45%, #eef4ff 100%)",
    fontFamily:
      'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  stack: {
    width: "min(860px, 100%)",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  pageBrand: {
    margin: "0 0 4px",
    textAlign: "center",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: 11,
    fontWeight: 600,
  },
  card: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    borderRadius: 20,
    padding: "28px 30px 30px",
    boxShadow: "0 18px 48px rgba(30, 41, 59, 0.1)",
    backdropFilter: "blur(6px)",
  },
  cardKicker: {
    margin: "0 0 6px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontSize: 11,
    fontWeight: 600,
  },
  title: { margin: "0 0 10px", fontSize: "1.65rem", fontWeight: 700 },
  lead: {
    margin: "0 0 20px",
    color: "#334155",
    fontSize: 14,
    lineHeight: 1.55,
  },
  inlineLink: { color: "#0f172a", fontWeight: 600, textDecoration: "underline" },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  block: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(148, 163, 184, 0.28)",
    background: "#f8fafc",
  },
  rowHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  rowTitle: { fontWeight: 600, fontSize: 14, color: "#0f172a" },
  copyButton: {
    flexShrink: 0,
    border: "1px solid rgba(100, 116, 139, 0.45)",
    borderRadius: 8,
    padding: "6px 12px",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  urlCode: {
    display: "block",
    fontSize: 12,
    lineHeight: 1.45,
    wordBreak: "break-all",
    color: "#334155",
    background: "rgba(255, 255, 255, 0.85)",
    borderRadius: 8,
    padding: "8px 10px",
    border: "1px solid rgba(148, 163, 184, 0.25)",
  },
};
