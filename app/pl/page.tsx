import type { Metadata } from "next";

import { getPackingListGuideRows } from "../../lib/packing-list-guides";
import { PlGuidesClient } from "./pl-guides-client";

export const metadata: Metadata = {
  title: "Packing list travel guides",
  description:
    "Public travel guide URLs for packing lists (Amazon disclosure pages).",
  robots: { index: false, follow: false },
};

export default function PackingListPage() {
  return <PlGuidesClient rows={getPackingListGuideRows()} />;
}
