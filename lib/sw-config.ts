/**
 * SafetyWing travel insurance — ultimate-travel-tips.com/sw/...
 * Destination slugs mirror Discover Cars (same places + legacy shorts).
 */

import { DC_LEGACY_SHORT_TO_PLACE_SLUG, DC_TOP_DESTINATIONS } from "./dc-config";

export const SW_TOP_DESTINATIONS = DC_TOP_DESTINATIONS;

/** Same short paths as /dc → /sw/nomad-insurance-in-{place} (Essential) */
export const SW_LEGACY_SHORT_TO_PLACE_SLUG = DC_LEGACY_SHORT_TO_PLACE_SLUG;

export const SW_SLUG_ESSENTIAL = "nomad-insurance";
export const SW_SLUG_COMPLETE = "nomad-insurance-complete";

export const SW_ESSENTIAL_TARGET =
  "https://safetywing.com/nomad-insurance/?referenceID=26500684&utm_source=26500684&utm_medium=Ambassador";

export const SW_COMPLETE_TARGET =
  "https://explore.safetywing.com/Nomad-insurance-complete/?referenceID=26500684&utm_source=26500684&utm_medium=Ambassador";

export type SwProduct = "essential" | "complete";

export function swDestinationPath(product: SwProduct, placeSlug: string): string {
  const base = product === "essential" ? SW_SLUG_ESSENTIAL : SW_SLUG_COMPLETE;
  return `${base}-in-${placeSlug}`;
}

export function mergeSafetyWingQuery(baseUrl: string, originalSearch: string): string {
  const extra = originalSearch.startsWith("?") ? originalSearch.slice(1) : originalSearch;
  if (!extra) return baseUrl;
  return `${baseUrl}&${extra}`;
}
