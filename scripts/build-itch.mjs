import { mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(repoDir, "dist");
const releaseDir = join(repoDir, "releases");
const archive = join(releaseDir, "narl-itch.zip");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoDir,
    stdio: "inherit",
    ...options,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(npm, ["run", "build:itch:web"]);
await mkdir(releaseDir, { recursive: true });
await rm(archive, { force: true });
run("zip", ["-qr", archive, "."], { cwd: distDir });

console.log(`Created ${archive}`);
