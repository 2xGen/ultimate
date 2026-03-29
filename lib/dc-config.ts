/**
 * Discover Cars branded paths on ultimate-travel-tips.com/dc/...
 * Redirect target: https://www.discovercars.com/?a_aid=toptours
 */

/** Generic share URL slug */
export const DC_GENERIC_SLUG = "best-car-rental-options";

/** Top destinations: label -> kebab slug used in /dc/car-rentals-in-{slug} */
export const DC_TOP_DESTINATIONS: { label: string; slug: string }[] = [
  { label: "Prague", slug: "prague" },
  { label: "Miami", slug: "miami" },
  { label: "Aruba", slug: "aruba" },
  { label: "Curaçao", slug: "curacao" },
  { label: "Punta Cana", slug: "punta-cana" },
  { label: "Amsterdam", slug: "amsterdam" },
  { label: "New York City", slug: "new-york-city" },
  { label: "Bonaire", slug: "bonaire" },
  { label: "Las Vegas", slug: "las-vegas" },
];

/**
 * Old short URLs like /dc/miami -> 308 to /dc/car-rentals-in-miami
 * Keys are path segments after /dc/
 */
export const DC_LEGACY_SHORT_TO_PLACE_SLUG: Record<string, string> = {
  prague: "prague",
  miami: "miami",
  aruba: "aruba",
  curacao: "curacao",
  "punta-cana": "punta-cana",
  amsterdam: "amsterdam",
  "new-york-city": "new-york-city",
  nyc: "new-york-city",
  bonaire: "bonaire",
  "las-vegas": "las-vegas",
  vegas: "las-vegas",
};
