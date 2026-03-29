import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import {
  DC_GENERIC_SLUG,
  DC_LEGACY_SHORT_TO_PLACE_SLUG,
} from "../../../lib/dc-config";

const DISCOVER_CARS_AFFILIATE = "a_aid=toptours";
const OG_DESCRIPTION =
  "Compare car rental deals, read reviews, and check live availability before you book.";
const OG_IMAGE_URL =
  "https://iemgpccgdlwpsrsjuumo.supabase.co/storage/v1/object/public/tour-fotos/ultimate%20og.jpg";

const BOT_PATTERNS = [
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "slackbot",
  "whatsapp",
  "telegrambot",
  "discordbot",
  "skypeuripreview",
  "googlebot",
];

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function titleCaseWords(input: string): string {
  return input
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function isPreviewBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((bot) => ua.includes(bot));
}

function isLikelyHumanNavigation(requestHeaders: Headers): boolean {
  const secFetchUser = requestHeaders.get("sec-fetch-user");
  const secFetchMode = requestHeaders.get("sec-fetch-mode");
  const secFetchDest = requestHeaders.get("sec-fetch-dest");
  const upgradeInsecureRequests = requestHeaders.get("upgrade-insecure-requests");

  return (
    secFetchUser === "?1" ||
    (secFetchMode === "navigate" && secFetchDest === "document") ||
    upgradeInsecureRequests === "1"
  );
}

function buildDiscoverCarsUrl(originalSearch: string): string {
  const base = "https://www.discovercars.com/";
  const queryWithoutQuestion = originalSearch.startsWith("?")
    ? originalSearch.slice(1)
    : originalSearch;
  const mergedQuery = queryWithoutQuestion
    ? `${queryWithoutQuestion}&${DISCOVER_CARS_AFFILIATE}`
    : DISCOVER_CARS_AFFILIATE;

  return `${base}?${mergedQuery}`;
}

async function getCurrentDcUrl(slug: string, originalSearch: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "ultimate-travel-tips.com";
  const proto = h.get("x-forwarded-proto") || "https";
  return `${proto}://${host}/dc/${encodeURIComponent(slug)}${originalSearch}`;
}

function titleForSlug(slug: string): string {
  if (slug === DC_GENERIC_SLUG) {
    return "Best Car Rental Options";
  }
  const match = /^car-rentals-in-(.+)$/.exec(slug);
  if (match) {
    const place = decodeURIComponent(match[1])
      .replaceAll("-", " ")
      .trim();
    return titleCaseWords(place ? `Car Rentals In ${place}` : "Car Rentals");
  }
  return "Car Rentals";
}

function buildHtml({
  isBot,
  title,
  currentUrl,
  destinationUrl,
}: {
  isBot: boolean;
  title: string;
  currentUrl: string;
  destinationUrl: string;
}): string {
  const safeTitle = escapeHtml(title);
  const safeCurrentUrl = escapeHtml(currentUrl);
  const safeDestination = escapeHtml(destinationUrl);
  const safeImage = escapeHtml(OG_IMAGE_URL);

  const redirectMeta = isBot
    ? ""
    : `<meta http-equiv="refresh" content="1;url=${safeDestination}" />`;
  const redirectScript = isBot
    ? ""
    : `<script>
      setTimeout(function () {
        window.location.replace(${JSON.stringify(destinationUrl)});
      }, 1000);
    </script>`;
  const bodyForHumans = isBot
    ? `<div class="bot-message">
        <h1>${safeTitle}</h1>
        <p>Preview mode for social crawlers. This page intentionally does not auto-redirect.</p>
      </div>`
    : `<main class="hero">
        <div class="card">
          <div class="top-row">
            <p class="eyebrow">Ultimate Travel Tips</p>
            <span class="badge">Discover Cars</span>
          </div>
          <h1>${safeTitle}</h1>
          <p class="line">Just a second while we find the best rental options for your trip...</p>
          <p class="line subtle" id="status">Finding rental rates...</p>
          <div class="activity">
            <span class="spinner" aria-hidden="true"></span>
            <span>We are comparing offers and sending you there in 1 second.</span>
          </div>
          <ul class="steps" aria-label="Redirect progress">
            <li class="step active" id="step-1">Finding the best rental rates</li>
            <li class="step" id="step-2">Comparing options</li>
            <li class="step" id="step-3">Opening Discover Cars</li>
          </ul>
          <div class="progress-wrap">
            <div class="progress" id="progress"></div>
          </div>
          <p class="countdown">Redirecting in <span id="count">1.0</span>s</p>
        </div>
      </main>
      <script>
        (function () {
          var total = 1000;
          var start = Date.now();
          var progress = document.getElementById("progress");
          var count = document.getElementById("count");
          var status = document.getElementById("status");
          var step1 = document.getElementById("step-1");
          var step2 = document.getElementById("step-2");
          var step3 = document.getElementById("step-3");
          var timer = setInterval(function () {
            var elapsed = Date.now() - start;
            var ratio = Math.min(elapsed / total, 1);
            if (progress) progress.style.width = String(Math.max(ratio * 100, 6)) + "%";
            if (count) count.textContent = String(Math.max(0, ((total - elapsed) / 1000))).slice(0, 3);
            if (status && ratio < 0.4) status.textContent = "Finding rental rates...";
            if (status && ratio >= 0.4 && ratio < 0.85) status.textContent = "Comparing the best options...";
            if (status && ratio >= 0.85) status.textContent = "Opening Discover Cars...";
            if (step1) step1.className = ratio < 0.4 ? "step active" : "step done";
            if (step2) step2.className = ratio >= 0.4 && ratio < 0.85 ? "step active" : ratio >= 0.85 ? "step done" : "step";
            if (step3) step3.className = ratio >= 0.85 ? "step active" : "step";
            if (ratio >= 1) clearInterval(timer);
          }, 40);
        })();
      </script>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
    <meta name="description" content="${escapeHtml(OG_DESCRIPTION)}" />
    <meta name="robots" content="noindex,nofollow" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${escapeHtml(OG_DESCRIPTION)}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:url" content="${safeCurrentUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${escapeHtml(OG_DESCRIPTION)}" />
    <meta name="twitter:image" content="${safeImage}" />
    ${redirectMeta}
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f8fafc;
        color: #0f172a;
        min-height: 100vh;
      }
      .hero {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
      }
      .card {
        width: min(720px, 100%);
        border: 1px solid #dbe4ef;
        border-radius: 22px;
        padding: 32px;
        background: #ffffff;
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
      }
      .top-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
      }
      .badge {
        font-size: 12px;
        color: #0f172a;
        background: #eef2f7;
        border: 1px solid #d8e1ec;
        border-radius: 999px;
        padding: 4px 10px;
        white-space: nowrap;
      }
      h1 { margin: 6px 0 14px; line-height: 1.2; font-size: clamp(1.45rem, 2.3vw, 2rem); }
      .eyebrow { margin: 0; color: #475569; letter-spacing: 0.06em; text-transform: uppercase; font-size: 12px; font-weight: 600; }
      .line { margin: 4px 0; font-size: 17px; }
      .subtle { color: #334155; font-weight: 500; }
      .activity {
        margin-top: 14px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: #475569;
        font-size: 14px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 9px 12px;
      }
      .spinner {
        width: 16px;
        height: 16px;
        border-radius: 999px;
        border: 2px solid #cbd5e1;
        border-top-color: #0f172a;
        animation: spin 0.85s linear infinite;
      }
      .steps {
        margin: 16px 0 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 8px;
      }
      .step {
        font-size: 14px;
        color: #64748b;
        transition: color 120ms ease-in;
        position: relative;
        padding-left: 20px;
      }
      .step::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #cbd5e1;
        position: absolute;
        left: 0;
        top: 7px;
      }
      .step.active {
        color: #0f172a;
        font-weight: 600;
      }
      .step.active::before { background: #0f172a; }
      .step.done {
        color: #059669;
      }
      .step.done::before { background: #059669; }
      .progress-wrap {
        width: 100%;
        height: 9px;
        margin-top: 18px;
        border-radius: 999px;
        overflow: hidden;
        background: #e5ebf3;
      }
      .progress {
        width: 6%;
        height: 100%;
        border-radius: inherit;
        background: #0f172a;
        transition: width 40ms linear;
      }
      .countdown { margin-top: 12px; color: #64748b; font-size: 14px; }
      .bot-message {
        max-width: 760px;
        margin: 72px auto;
        padding: 0 24px;
      }
      .bot-message p { color: #475569; }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
    ${redirectScript}
  </head>
  <body>
    ${bodyForHumans}
  </body>
</html>`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug: rawSlug } = await context.params;
  const slug = decodeURIComponent(rawSlug || "").toLowerCase();
  const requestUrl = new URL(request.url);
  const originalSearch = requestUrl.search || "";

  const legacyTarget = DC_LEGACY_SHORT_TO_PLACE_SLUG[slug];
  if (legacyTarget) {
    const dest = new URL(request.url);
    dest.pathname = `/dc/car-rentals-in-${legacyTarget}`;
    dest.search = originalSearch;
    return NextResponse.redirect(dest, 308);
  }

  const isGeneric = slug === DC_GENERIC_SLUG;
  const placeMatch = /^car-rentals-in-(.+)$/.exec(slug);

  if (!isGeneric && !placeMatch) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const destination = buildDiscoverCarsUrl(originalSearch);
  const title = titleForSlug(slug);
  const currentUrl = await getCurrentDcUrl(slug, originalSearch);
  const h = await headers();
  const userAgent = h.get("user-agent") || "";
  const bot = isPreviewBot(userAgent) && !isLikelyHumanNavigation(request.headers);
  const html = buildHtml({
    isBot: bot,
    title,
    currentUrl,
    destinationUrl: destination,
  });

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300",
      "X-Robots-Tag": "noindex",
    },
  });
}
