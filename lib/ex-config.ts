/**
 * Expedia / Vrbo affiliate links — ultimate-travel-tips.com/ex/...
 */

export type ExEntry = {
  slug: string;
  label: string;
  destinationUrl: string;
};

/** Display order: Expedia + Vrbo home first, then alphabetical by label. */
export const EX_ENTRIES: ExEntry[] = [
  {
    slug: "expedia-home",
    label: "Expedia — home",
    destinationUrl:
      "https://expedia.com/affiliate?siteid=1&landingPage=https%3A%2F%2Fwww.expedia.com%2F&camref=1110lee9j&creativeref=1100l68075&adref=PZ6IP2GwLQ",
  },
  {
    slug: "vrbo-home",
    label: "Vrbo — home",
    destinationUrl: "https://vrbo.com/affiliate/wjhjieL",
  },
  {
    slug: "aruba-all-inclusive-hotels",
    label: "Aruba — all-inclusive hotels",
    destinationUrl:
      "https://expedia.com/affiliate?siteid=1&landingPage=https%3A%2F%2Fwww.expedia.com%2FDestinations-In-Aruba-All-Inclusive-Hotel.0-0-d9-tAllinclusiveHotel.Hotel-Filter-Destinations&camref=1110lee9j&creativeref=1100l68075&adref=PZ7oFOUm5B",
  },
  {
    slug: "hotels-aruba",
    label: "Aruba — hotels",
    destinationUrl:
      "https://expedia.com/affiliate?siteid=1&landingPage=https%3A%2F%2Fwww.expedia.com%2FDestinations-In-Aruba.d9.Hotel-Destinations&camref=1110lee9j&creativeref=1100l68075&adref=PZ7Gsm4B8h",
  },
  {
    slug: "curacao-all-inclusive",
    label: "Curaçao — all-inclusive",
    destinationUrl:
      "https://expedia.com/affiliate?siteid=1&landingPage=https%3A%2F%2Fwww.expedia.com%2FDestinations-In-Curacao-All-Inclusive-Hotel.0-0-d6143269-tAllinclusiveHotel.Hotel-Filter-Destinations&camref=1110lee9j&creativeref=1100l68075&adref=PZE_Rr0Iaz",
  },
  {
    slug: "hotels-curacao",
    label: "Curaçao — hotels",
    destinationUrl:
      "https://expedia.com/affiliate?siteid=1&landingPage=https%3A%2F%2Fwww.expedia.com%2FDestinations-In-Curacao.d6143269.Hotel-Destinations&camref=1110lee9j&creativeref=1100l68075&adref=PZ50W6jMHH",
  },
  {
    slug: "hotels-miami",
    label: "Miami — hotels",
    destinationUrl:
      "https://expedia.com/affiliate?siteid=1&landingPage=https%3A%2F%2Fwww.expedia.com%2FMiami-Hotels.d178286.Travel-Guide-Hotels&camref=1110lee9j&creativeref=1100l68075&adref=PZ2sxcrYW2",
  },
  {
    slug: "hotels-new-york-city",
    label: "New York City — hotels",
    destinationUrl:
      "https://expedia.com/affiliate?siteid=1&landingPage=https%3A%2F%2Fwww.expedia.com%2FNew-York-Hotels.d178293.Travel-Guide-Hotels&camref=1110lee9j&creativeref=1100l68075&adref=PZ5mo3hV_e",
  },
  {
    slug: "hotels-prague",
    label: "Prague — hotels",
    destinationUrl:
      "https://expedia.com/affiliate?siteid=1&landingPage=https%3A%2F%2Fwww.expedia.com%2FPrague-Hotels.d180014.Travel-Guide-Hotels&camref=1110lee9j&creativeref=1100l68075&adref=PZTw_XIYDy",
  },
  {
    slug: "punta-cana-all-inclusive",
    label: "Punta Cana — all-inclusive",
    destinationUrl:
      "https://expedia.com/affiliate?siteid=1&landingPage=https%3A%2F%2Fwww.expedia.com%2Flp%2Ftheme-vacations%2Fall-inclusive-vacations%2F601906%2FPunta-Cana&camref=1110lee9j&creativeref=1100l68075&adref=PZF_Iv0hNq",
  },
];

const EX_BY_SLUG: Record<string, ExEntry> = Object.fromEntries(EX_ENTRIES.map((e) => [e.slug, e]));

export function getExEntry(slug: string): ExEntry | undefined {
  return EX_BY_SLUG[decodeURIComponent(slug || "").toLowerCase()];
}

export function mergeExQuery(baseUrl: string, originalSearch: string): string {
  const extra = originalSearch.startsWith("?") ? originalSearch.slice(1) : originalSearch;
  if (!extra) return baseUrl;
  const joiner = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${joiner}${extra}`;
}

export function exBrandLabel(slug: string): "Expedia" | "Vrbo" {
  return slug === "vrbo-home" ? "Vrbo" : "Expedia";
}
