/**
 * BabyQuip branded paths on ultimate-travel-tips.com/bq/...
 * Redirect: https://www.babyquip.com?a=66993aa
 */

import {
  DC_LEGACY_SHORT_TO_PLACE_SLUG,
  DC_TOP_DESTINATIONS,
} from "./dc-config";

export const BQ_GENERIC_SLUG = "best-baby-gear-options";

/** Same destinations as Discover Cars; paths use /bq/baby-gear-in-{slug} */
export const BQ_TOP_DESTINATIONS = DC_TOP_DESTINATIONS;

/** Short /bq/miami -> /bq/baby-gear-in-miami (308) */
export const BQ_LEGACY_SHORT_TO_PLACE_SLUG = DC_LEGACY_SHORT_TO_PLACE_SLUG;
