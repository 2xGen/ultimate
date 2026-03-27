import { headers } from "next/headers";
import { type NextRequest } from "next/server";

const AFFILIATE_PARAMS = "pid=P00222666&mcid=42383&medium=link";
const OG_DESCRIPTION = "Taking you to the best price...";
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

function titleCase(input: string): string {
  return input
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function isLikelyProductId(segment: string): boolean {
  return /^d\d+-[a-z0-9]+$/i.test(segment) || /^\d+[a-z0-9]+$/i.test(segment);
}

function extractTitle(pathSegments: string[]): string {
  if (!pathSegments.length) {
    return "Tour Link";
  }

  const lastIdx = pathSegments.length - 1;
  const candidateIndex =
    pathSegments.length >= 2 && isLikelyProductId(pathSegments[lastIdx])
      ? lastIdx - 1
      : lastIdx;

  const raw = decodeURIComponent(pathSegments[candidateIndex] || "")
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .trim();

  return titleCase(raw || "Tour Link");
}

function isPreviewBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((bot) => ua.includes(bot));
}

function buildDestination(pathSegments: string[], originalSearch: string): string {
  const joinedPath = pathSegments.map(encodeURIComponent).join("/");
  const base = `https://www.viator.com/${joinedPath}`;
  const queryWithoutQuestion = originalSearch.startsWith("?")
    ? originalSearch.slice(1)
    : originalSearch;
  const mergedQuery = queryWithoutQuestion
    ? `${queryWithoutQuestion}&${AFFILIATE_PARAMS}`
    : AFFILIATE_PARAMS;

  return `${base}?${mergedQuery}`;
}

async function getCurrentGoUrl(
  pathSegments: string[],
  originalSearch: string,
): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "ultimate-travel-tips.com";
  const proto = h.get("x-forwarded-proto") || "https";
  const path = pathSegments.map(encodeURIComponent).join("/");
  return `${proto}://${host}/go/${path}${originalSearch}`;
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
          <p class="eyebrow">Ultimate Travel Tips</p>
          <h1>${safeTitle}</h1>
          <p class="line">Taking you to the best price...</p>
          <p class="line subtle">Finding your tour and calculating the best price...</p>
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
          var timer = setInterval(function () {
            var elapsed = Date.now() - start;
            var ratio = Math.min(elapsed / total, 1);
            if (progress) progress.style.width = String(Math.max(ratio * 100, 6)) + "%";
            if (count) count.textContent = String(Math.max(0, ((total - elapsed) / 1000))).slice(0, 3);
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
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background:
          radial-gradient(1200px 700px at 10% 10%, rgba(56, 189, 248, 0.35), transparent 55%),
          radial-gradient(1100px 680px at 90% 20%, rgba(167, 139, 250, 0.35), transparent 52%),
          linear-gradient(145deg, #050816, #0e172f 45%, #111827);
        color: #f8fafc;
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
        border: 1px solid rgba(148, 163, 184, 0.28);
        border-radius: 20px;
        padding: 30px;
        background: rgba(15, 23, 42, 0.72);
        box-shadow: 0 24px 70px rgba(15, 23, 42, 0.45);
        backdrop-filter: blur(6px);
      }
      h1 { margin: 10px 0 18px; line-height: 1.2; }
      .eyebrow { margin: 0; color: #cbd5e1; letter-spacing: 0.06em; text-transform: uppercase; font-size: 12px; }
      .line { margin: 6px 0; font-size: 18px; }
      .subtle { color: #cbd5e1; }
      .progress-wrap {
        width: 100%;
        height: 10px;
        margin-top: 18px;
        border-radius: 999px;
        overflow: hidden;
        background: rgba(226, 232, 240, 0.18);
      }
      .progress {
        width: 6%;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, #22d3ee, #60a5fa, #a78bfa);
        transition: width 40ms linear;
      }
      .countdown { margin-top: 14px; color: #cbd5e1; font-size: 14px; }
      .bot-message {
        max-width: 760px;
        margin: 72px auto;
        padding: 0 24px;
      }
      .bot-message p { color: #cbd5e1; }
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
  context: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await context.params;
  const pathSegments = path || [];
  const requestUrl = new URL(request.url);
  const originalSearch = requestUrl.search || "";
  const destination = buildDestination(pathSegments, originalSearch);
  const title = extractTitle(pathSegments);
  const currentUrl = await getCurrentGoUrl(pathSegments, originalSearch);
  const h = await headers();
  const userAgent = h.get("user-agent") || "";
  const bot = isPreviewBot(userAgent);
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
