import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = process.env.ITCH_TARGET;
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const butler = process.env.BUTLER_BIN ?? "butler";

if (!target) {
  console.error("Set ITCH_TARGET=<user>/<game> env var to use this command.");
  process.exit(2);
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: repoDir, stdio: "inherit" });

  if (result.error?.code === "ENOENT") {
    console.error(
      command === butler
        ? "No Butler in PATH."
        : `Not found: ${command}`,
    );
    process.exit(127);
  }

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(npm, ["run", "build:itch"]);
run(butler, ["push", "dist", `${target}:html`]);
