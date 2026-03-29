import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const target = join(process.cwd(), ".next");

if (!existsSync(target)) {
  process.exit(0);
}

if (process.platform === "win32") {
  const r = spawnSync("cmd", ["/c", "rmdir", "/s", "/q", target], {
    stdio: "inherit",
    windowsHide: true,
  });
  if (r.status !== 0 && existsSync(target)) {
    console.error(
      "Could not delete .next (files may be locked). Stop `npm run dev`, close the IDE preview, then run npm run clean again.",
    );
    process.exit(1);
  }
} else {
  rmSync(target, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
