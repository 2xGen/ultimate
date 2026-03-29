export const ARUBA_PACKING_LIST_URL = "https://arubabuddies.com/aruba-essentials";

/** Curaçao + general beach packing guides live on TopTours.ai */
export const TOPTOURS_PACKING_GUIDE_ORIGIN = "https://toptours.ai";

export type PackingListGuideRow = {
  id: string;
  label: string;
  url: string;
};

export function getPackingListGuideRows(): PackingListGuideRow[] {
  const base = TOPTOURS_PACKING_GUIDE_ORIGIN.replace(/\/$/, "");
  return [
    {
      id: "aruba",
      label: "Aruba beach packing list",
      url: ARUBA_PACKING_LIST_URL,
    },
    {
      id: "curacao",
      label: "Curaçao beach packing list",
      url: `${base}/travel-guides/curacao-packing-list`,
    },
    {
      id: "beach-general",
      label: "Beach vacation packing list (general)",
      url: `${base}/travel-guides/beach-vacation-packing-list`,
    },
  ];
}
