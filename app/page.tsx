"use client";

import { type CSSProperties, type FormEvent, useMemo, useState } from "react";

import { BQ_GENERIC_SLUG, BQ_TOP_DESTINATIONS } from "../lib/bq-config";
import { BG_CANONICAL_PATH } from "../lib/bg-config";
import { DC_GENERIC_SLUG, DC_TOP_DESTINATIONS } from "../lib/dc-config";
import { getPackingListGuideRows } from "../lib/packing-list-guides";
import { EX_ENTRIES } from "../lib/ex-config";
import {
  SW_SLUG_COMPLETE,
  SW_SLUG_ESSENTIAL,
  SW_TOP_DESTINATIONS,
  swDestinationPath,
  type SwProduct,
} from "../lib/sw-config";

const SITE_ORIGIN = "https://ultimate-travel-tips.com";

type AffiliatePanel = "dc" | "bq" | "bg" | "sw" | "ex" | "pl";

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
  const [dcCopiedId, setDcCopiedId] = useState<string | null>(null);
  const [bqCopiedId, setBqCopiedId] = useState<string | null>(null);
  const [plCopiedId, setPlCopiedId] = useState<string | null>(null);
  const [swCopiedId, setSwCopiedId] = useState<string | null>(null);
  const [swProduct, setSwProduct] = useState<SwProduct>("essential");
  const [bgCopiedId, setBgCopiedId] = useState<string | null>(null);
  const [exCopiedId, setExCopiedId] = useState<string | null>(null);
  const [openAffiliate, setOpenAffiliate] = useState<AffiliatePanel | null>(null);
  const canCopy = useMemo(() => Boolean(generatedUrl), [generatedUrl]);

  function toggleAffiliate(id: AffiliatePanel): void {
    setOpenAffiliate((cur) => (cur === id ? null : id));
  }

  const packingListRows = useMemo(() => getPackingListGuideRows(), []);

  const exRows = useMemo(
    () =>
      EX_ENTRIES.map((e) => ({
        id: e.slug,
        label: e.label,
        url: `${SITE_ORIGIN}/ex/${e.slug}`,
      })),
    [],
  );

  const dcGenericUrl = `${SITE_ORIGIN}/dc/${DC_GENERIC_SLUG}`;
  const dcDestinationRows = useMemo(
    () =>
      DC_TOP_DESTINATIONS.map((d) => ({
        id: d.slug,
        label: d.label,
        url: `${SITE_ORIGIN}/dc/car-rentals-in-${d.slug}`,
      })),
    [],
  );

  const swGenericUrl = `${SITE_ORIGIN}/sw/${swProduct === "essential" ? SW_SLUG_ESSENTIAL : SW_SLUG_COMPLETE}`;
  const swDestinationRows = useMemo(
    () =>
      SW_TOP_DESTINATIONS.map((d) => ({
        id: d.slug,
        label: d.label,
        url: `${SITE_ORIGIN}/sw/${swDestinationPath(swProduct, d.slug)}`,
      })),
    [swProduct],
  );
  const bgArubaUrl = `${SITE_ORIGIN}${BG_CANONICAL_PATH}`;

  const bqGenericUrl = `${SITE_ORIGIN}/bq/${BQ_GENERIC_SLUG}`;
  const bqDestinationRows = useMemo(
    () =>
      BQ_TOP_DESTINATIONS.map((d) => ({
        id: d.slug,
        label: d.label,
        url: `${SITE_ORIGIN}/bq/baby-gear-in-${d.slug}`,
      })),
    [],
  );

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

  async function copyDiscoverCarsLink(id: string, url: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      setDcCopiedId(id);
      window.setTimeout(() => setDcCopiedId((current) => (current === id ? null : current)), 2000);
    } catch {
      setDcCopiedId(null);
    }
  }

  async function copyBabyQuipLink(id: string, url: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      setBqCopiedId(id);
      window.setTimeout(() => setBqCopiedId((current) => (current === id ? null : current)), 2000);
    } catch {
      setBqCopiedId(null);
    }
  }

  async function copyPackingListLink(id: string, url: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      setPlCopiedId(id);
      window.setTimeout(() => setPlCopiedId((current) => (current === id ? null : current)), 2000);
    } catch {
      setPlCopiedId(null);
    }
  }

  async function copySafetyWingLink(id: string, url: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      setSwCopiedId(id);
      window.setTimeout(() => setSwCopiedId((current) => (current === id ? null : current)), 2000);
    } catch {
      setSwCopiedId(null);
    }
  }

  async function copyBeachGearLink(id: string, url: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      setBgCopiedId(id);
      window.setTimeout(() => setBgCopiedId((current) => (current === id ? null : current)), 2000);
    } catch {
      setBgCopiedId(null);
    }
  }

  async function copyExLink(id: string, url: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      setExCopiedId(id);
      window.setTimeout(() => setExCopiedId((current) => (current === id ? null : current)), 2000);
    } catch {
      setExCopiedId(null);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.stack}>
        <p style={styles.pageBrand}>Ultimate Travel Tips</p>

        <section style={styles.viatorCard} aria-labelledby="viator-heading">
          <p style={styles.cardKicker}>Tours</p>
          <h1 id="viator-heading" style={styles.title}>
            Viator Link Generator
          </h1>
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

        <div style={styles.accordionIntro}>
          <p style={styles.accordionIntroText}>
            Partner links below — expand a category to copy URLs. Only one open at a time.
          </p>
        </div>

        <div style={styles.accordionStack}>
          <div style={styles.accordionItem}>
            <button
              type="button"
              id="affiliate-trigger-dc"
              style={{
                ...styles.accordionHeader,
                ...(openAffiliate === "dc" ? styles.accordionHeaderOpen : {}),
              }}
              onClick={() => toggleAffiliate("dc")}
              aria-expanded={openAffiliate === "dc"}
              aria-controls="affiliate-panel-dc"
            >
              <span style={styles.accordionHeaderText}>
                <span style={styles.accordionKicker}>Car rentals</span>
                <span style={styles.accordionTitle}>Discover Cars</span>
              </span>
              <span style={styles.accordionChevron} aria-hidden>
                {openAffiliate === "dc" ? "▼" : "▶"}
              </span>
            </button>
            {openAffiliate === "dc" ? (
              <div id="affiliate-panel-dc" style={styles.accordionPanel} role="region" aria-labelledby="affiliate-trigger-dc">
                <p style={styles.dcSubtitle}>
                  Shareable links that preview on social, then open Discover Cars with our partner tag (
                  <code style={styles.code}>/dc/...</code>). Copy the full URL below.
                </p>
                <div style={styles.dcBlock}>
                  <div style={styles.dcRowHeader}>
                    <span style={styles.dcRowTitle}>Best car rental options (generic)</span>
                    <button
                      type="button"
                      style={styles.dcCopyButton}
                      onClick={() => copyDiscoverCarsLink("generic", dcGenericUrl)}
                    >
                      {dcCopiedId === "generic" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <code style={styles.dcUrl}>{dcGenericUrl}</code>
                </div>
                <p style={styles.dcDestLabel}>Top destinations</p>
                <div style={styles.dcList}>
                  {dcDestinationRows.map((row) => (
                    <div key={row.id} style={styles.dcBlock}>
                      <div style={styles.dcRowHeader}>
                        <span style={styles.dcRowTitle}>{row.label}</span>
                        <button
                          type="button"
                          style={styles.dcCopyButton}
                          onClick={() => copyDiscoverCarsLink(row.id, row.url)}
                        >
                          {dcCopiedId === row.id ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <code style={styles.dcUrl}>{row.url}</code>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div style={styles.accordionItem}>
            <button
              type="button"
              id="affiliate-trigger-bq"
              style={{
                ...styles.accordionHeader,
                ...(openAffiliate === "bq" ? styles.accordionHeaderOpen : {}),
              }}
              onClick={() => toggleAffiliate("bq")}
              aria-expanded={openAffiliate === "bq"}
              aria-controls="affiliate-panel-bq"
            >
              <span style={styles.accordionHeaderText}>
                <span style={styles.accordionKicker}>Baby gear</span>
                <span style={styles.accordionTitle}>BabyQuip</span>
              </span>
              <span style={styles.accordionChevron} aria-hidden>
                {openAffiliate === "bq" ? "▼" : "▶"}
              </span>
            </button>
            {openAffiliate === "bq" ? (
              <div id="affiliate-panel-bq" style={styles.accordionPanel} role="region" aria-labelledby="affiliate-trigger-bq">
                <p style={styles.dcSubtitle}>
                  Shareable links that preview on social with destination-style titles and a baby-equipment
                  image, then redirect to{" "}
                  <a
                    href="https://www.babyquip.com?a=66993aa"
                    style={styles.inlineLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BabyQuip
                  </a>{" "}
                  with our partner tag (<code style={styles.code}>/bq/...</code>). Copy the full URL below.
                </p>
                <div style={styles.dcBlock}>
                  <div style={styles.dcRowHeader}>
                    <span style={styles.dcRowTitle}>Best baby gear options (generic)</span>
                    <button
                      type="button"
                      style={styles.dcCopyButton}
                      onClick={() => copyBabyQuipLink("bq-generic", bqGenericUrl)}
                    >
                      {bqCopiedId === "bq-generic" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <code style={styles.dcUrl}>{bqGenericUrl}</code>
                </div>
                <p style={styles.dcDestLabel}>Top destinations</p>
                <div style={styles.dcList}>
                  {bqDestinationRows.map((row) => (
                    <div key={row.id} style={styles.dcBlock}>
                      <div style={styles.dcRowHeader}>
                        <span style={styles.dcRowTitle}>{row.label}</span>
                        <button
                          type="button"
                          style={styles.dcCopyButton}
                          onClick={() => copyBabyQuipLink(`bq-${row.id}`, row.url)}
                        >
                          {bqCopiedId === `bq-${row.id}` ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <code style={styles.dcUrl}>{row.url}</code>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div style={styles.accordionItem}>
            <button
              type="button"
              id="affiliate-trigger-bg"
              style={{
                ...styles.accordionHeader,
                ...(openAffiliate === "bg" ? styles.accordionHeaderOpen : {}),
              }}
              onClick={() => toggleAffiliate("bg")}
              aria-expanded={openAffiliate === "bg"}
              aria-controls="affiliate-panel-bg"
            >
              <span style={styles.accordionHeaderText}>
                <span style={styles.accordionKicker}>Beach gear</span>
                <span style={styles.accordionTitle}>Aruba · Coconut Rentals</span>
              </span>
              <span style={styles.accordionChevron} aria-hidden>
                {openAffiliate === "bg" ? "▼" : "▶"}
              </span>
            </button>
            {openAffiliate === "bg" ? (
              <div id="affiliate-panel-bg" style={styles.accordionPanel} role="region" aria-labelledby="affiliate-trigger-bg">
                <p style={styles.dcSubtitle}>
                  Shareable link that previews on social, then opens{" "}
                  <a
                    href="https://coconutrentals.com/?ref=arubabuddies"
                    style={styles.inlineLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Coconut Rentals
                  </a>{" "}
                  with our partner tag after a short interstitial (<code style={styles.code}>/bg/...</code>
                  ). Copy the full URL below.
                </p>
                <div style={styles.dcBlock}>
                  <div style={styles.dcRowHeader}>
                    <span style={styles.dcRowTitle}>Beach gear rentals in Aruba</span>
                    <button
                      type="button"
                      style={styles.dcCopyButton}
                      onClick={() => copyBeachGearLink("bg-aruba", bgArubaUrl)}
                    >
                      {bgCopiedId === "bg-aruba" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <code style={styles.dcUrl}>{bgArubaUrl}</code>
                </div>
              </div>
            ) : null}
          </div>

          <div style={styles.accordionItem}>
            <button
              type="button"
              id="affiliate-trigger-sw"
              style={{
                ...styles.accordionHeader,
                ...(openAffiliate === "sw" ? styles.accordionHeaderOpen : {}),
              }}
              onClick={() => toggleAffiliate("sw")}
              aria-expanded={openAffiliate === "sw"}
              aria-controls="affiliate-panel-sw"
            >
              <span style={styles.accordionHeaderText}>
                <span style={styles.accordionKicker}>Travel insurance</span>
                <span style={styles.accordionTitle}>SafetyWing</span>
              </span>
              <span style={styles.accordionChevron} aria-hidden>
                {openAffiliate === "sw" ? "▼" : "▶"}
              </span>
            </button>
            {openAffiliate === "sw" ? (
              <div id="affiliate-panel-sw" style={styles.accordionPanel} role="region" aria-labelledby="affiliate-trigger-sw">
                <p style={styles.dcSubtitle}>
                  Shareable links that preview on social with destination-style titles, then open SafetyWing
                  with our ambassador parameters after a short interstitial (
                  <code style={styles.code}>/sw/...</code>). Choose Essential or Complete, then copy the full
                  URL below.
                </p>
                <div style={styles.swProductRow}>
                  <label htmlFor="sw-product" style={styles.swSelectLabel}>
                    Plan
                  </label>
                  <select
                    id="sw-product"
                    value={swProduct}
                    onChange={(event) => setSwProduct(event.target.value as SwProduct)}
                    style={styles.selectControl}
                    aria-label="SafetyWing plan"
                  >
                    <option value="essential">Nomad Insurance (Essential)</option>
                    <option value="complete">Nomad Insurance Complete</option>
                  </select>
                </div>
                <div style={styles.dcBlock}>
                  <div style={styles.dcRowHeader}>
                    <span style={styles.dcRowTitle}>
                      {swProduct === "essential"
                        ? "Nomad Insurance (Essential) — generic"
                        : "Nomad Insurance Complete — generic"}
                    </span>
                    <button
                      type="button"
                      style={styles.dcCopyButton}
                      onClick={() => copySafetyWingLink(`sw-${swProduct}-generic`, swGenericUrl)}
                    >
                      {swCopiedId === `sw-${swProduct}-generic` ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <code style={styles.dcUrl}>{swGenericUrl}</code>
                </div>
                <p style={styles.dcDestLabel}>Top destinations</p>
                <div style={styles.dcList}>
                  {swDestinationRows.map((row) => (
                    <div key={`${swProduct}-${row.id}`} style={styles.dcBlock}>
                      <div style={styles.dcRowHeader}>
                        <span style={styles.dcRowTitle}>{row.label}</span>
                        <button
                          type="button"
                          style={styles.dcCopyButton}
                          onClick={() => copySafetyWingLink(`sw-${swProduct}-${row.id}`, row.url)}
                        >
                          {swCopiedId === `sw-${swProduct}-${row.id}` ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <code style={styles.dcUrl}>{row.url}</code>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div style={styles.accordionItem}>
            <button
              type="button"
              id="affiliate-trigger-ex"
              style={{
                ...styles.accordionHeader,
                ...(openAffiliate === "ex" ? styles.accordionHeaderOpen : {}),
              }}
              onClick={() => toggleAffiliate("ex")}
              aria-expanded={openAffiliate === "ex"}
              aria-controls="affiliate-panel-ex"
            >
              <span style={styles.accordionHeaderText}>
                <span style={styles.accordionKicker}>Hotels & rentals</span>
                <span style={styles.accordionTitle}>Expedia & Vrbo</span>
              </span>
              <span style={styles.accordionChevron} aria-hidden>
                {openAffiliate === "ex" ? "▼" : "▶"}
              </span>
            </button>
            {openAffiliate === "ex" ? (
              <div id="affiliate-panel-ex" style={styles.accordionPanel} role="region" aria-labelledby="affiliate-trigger-ex">
                <p style={styles.dcSubtitle}>
                  Shareable links that preview on social with destination titles, then open Expedia or Vrbo
                  with our partner parameters after a short interstitial (<code style={styles.code}>/ex/...</code>
                  ). Copy the full URL below.
                </p>
                <div style={styles.dcList}>
                  {exRows.map((row) => (
                    <div key={row.id} style={styles.dcBlock}>
                      <div style={styles.dcRowHeader}>
                        <span style={styles.dcRowTitle}>{row.label}</span>
                        <button
                          type="button"
                          style={styles.dcCopyButton}
                          onClick={() => copyExLink(row.id, row.url)}
                        >
                          {exCopiedId === row.id ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <code style={styles.dcUrl}>{row.url}</code>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div style={styles.accordionItem}>
            <button
              type="button"
              id="affiliate-trigger-pl"
              style={{
                ...styles.accordionHeader,
                ...(openAffiliate === "pl" ? styles.accordionHeaderOpen : {}),
              }}
              onClick={() => toggleAffiliate("pl")}
              aria-expanded={openAffiliate === "pl"}
              aria-controls="affiliate-panel-pl"
            >
              <span style={styles.accordionHeaderText}>
                <span style={styles.accordionTitle}>Packing list</span>
              </span>
              <span style={styles.accordionChevron} aria-hidden>
                {openAffiliate === "pl" ? "▼" : "▶"}
              </span>
            </button>
            {openAffiliate === "pl" ? (
              <div id="affiliate-panel-pl" style={styles.accordionPanel} role="region" aria-labelledby="affiliate-trigger-pl">
                <p style={styles.dcSubtitle}>
                  Public URLs for packing lists (Amazon disclosure pages). Aruba uses{" "}
                  <a href="https://arubabuddies.com" style={styles.inlineLink} target="_blank" rel="noopener noreferrer">
                    ArubaBuddies
                  </a>
                  ; Curaçao and general beach lists are on{" "}
                  <a href="https://toptours.ai" style={styles.inlineLink} target="_blank" rel="noopener noreferrer">
                    TopTours.ai
                  </a>
                  . Copy the full URL below.
                </p>
                <div style={styles.dcList}>
                  {packingListRows.map((row) => (
                    <div key={row.id} style={styles.dcBlock}>
                      <div style={styles.dcRowHeader}>
                        <span style={styles.dcRowTitle}>{row.label}</span>
                        <button
                          type="button"
                          style={styles.dcCopyButton}
                          onClick={() => copyPackingListLink(row.id, row.url)}
                        >
                          {plCopiedId === row.id ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <code style={styles.dcUrl}>{row.url}</code>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
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
    gap: 16,
  },
  accordionIntro: {
    width: "100%",
    padding: "0 4px",
  },
  accordionIntroText: {
    margin: 0,
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.45,
  },
  accordionStack: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  accordionItem: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 32px rgba(30, 41, 59, 0.08)",
    backdropFilter: "blur(6px)",
  },
  accordionHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "16px 18px",
    border: "none",
    borderBottom: "1px solid transparent",
    background: "rgba(255, 255, 255, 0.65)",
    cursor: "pointer",
    textAlign: "left" as const,
    fontFamily: "inherit",
    transition: "background 0.15s ease",
  },
  accordionHeaderOpen: {
    background: "rgba(241, 245, 249, 0.95)",
    borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
  },
  accordionHeaderText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    minWidth: 0,
  },
  accordionKicker: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#64748b",
  },
  accordionTitle: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#0f172a",
    lineHeight: 1.25,
  },
  accordionChevron: {
    flexShrink: 0,
    fontSize: 12,
    color: "#94a3b8",
    width: 22,
    textAlign: "center",
  },
  accordionPanel: {
    padding: "8px 18px 22px",
    borderTop: "none",
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
    borderRadius: "20px",
    padding: "28px 30px 30px",
    boxShadow: "0 18px 48px rgba(30, 41, 59, 0.1)",
    backdropFilter: "blur(6px)",
  },
  viatorCard: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.96)",
    border: "1px solid rgba(100, 116, 139, 0.28)",
    borderRadius: "20px",
    padding: "28px 30px 30px",
    boxShadow: "0 22px 56px rgba(30, 41, 59, 0.14)",
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
  title: { margin: "0 0 12px", fontSize: "1.75rem" },
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
  dcTitle: {
    margin: "0 0 8px",
    fontSize: "1.35rem",
    fontWeight: 700,
  },
  dcSubtitle: {
    margin: "0 0 14px",
    color: "#334155",
    fontSize: 14,
    lineHeight: 1.5,
  },
  dcBlock: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(148, 163, 184, 0.28)",
    background: "#f8fafc",
  },
  dcRowHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  dcRowTitle: {
    fontWeight: 600,
    fontSize: 14,
    color: "#0f172a",
  },
  dcCopyButton: {
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
  dcUrl: {
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
  dcDestLabel: {
    margin: "16px 0 8px",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#64748b",
    fontWeight: 600,
  },
  dcList: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  inlineLink: {
    color: "#0f172a",
    fontWeight: 600,
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
  swProductRow: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 6,
    marginBottom: 14,
  },
  swSelectLabel: {
    fontWeight: 600,
    fontSize: 14,
    color: "#334155",
  },
  selectControl: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 10,
    border: "1px solid rgba(148, 163, 184, 0.35)",
    padding: "10px 12px",
    fontSize: 14,
    fontWeight: 600,
    background: "#ffffff",
    color: "#0f172a",
    cursor: "pointer",
  },
};
