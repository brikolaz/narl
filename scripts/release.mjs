import { execFileSync } from "node:child_process"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const repoDir = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const [inputVersion, ...extraArgs] = process.argv.slice(2)
const version = inputVersion?.replace(/^v/, "")
const tag = `v${version}`
const semver =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/

if (!version || extraArgs.length || !semver.test(version)) {
  console.error("Usage: npm run release -- <version>, e.g. 0.2.0 or v0.2.0")
  process.exit(1)
}

try {
  const status = execFileSync("git", ["status", "--porcelain"], {
    cwd: repoDir,
    encoding: "utf8",
  })

  if (status.trim()) {
    throw new Error("Commit or stash pending changes before releasing.")
  }

  const tags = execFileSync("git", ["tag", "--list", tag], {
    cwd: repoDir,
    encoding: "utf8",
  })

  if (tags.trim()) throw new Error(`Tag ${tag} already exists.`)

  execFileSync(
    process.platform === "win32" ? "npm.cmd" : "npm",
    [
      "version",
      version,
      "--git-tag-version=true",
      "--tag-version-prefix=v",
      `--message=${tag}`,
      "--ignore-scripts",
    ],
    { cwd: repoDir, stdio: "inherit", env: { ...process.env, CI: "true" } },
  )

  execFileSync("git", ["push", "origin", tag], {
    cwd: repoDir,
    stdio: "inherit",
  })
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
