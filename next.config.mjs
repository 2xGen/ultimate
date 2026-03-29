import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // When a lockfile exists higher in the tree (e.g. C:\Users\...\package-lock.json),
  // Turbopack may pick the wrong root. Pin it to this app folder.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
