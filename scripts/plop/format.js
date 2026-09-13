import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { format, resolveConfig } from "prettier"

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
)

export const formatGeneratedFiles = async (filePaths) => {
  const formattedFiles = []

  for (const filePath of filePaths) {
    const absolutePath = path.resolve(REPO_ROOT, filePath)
    const relativePath = path.relative(REPO_ROOT, absolutePath)

    if (relativePath.startsWith(`..${path.sep}`) || relativePath === "..") {
      throw new Error(
        `Cannot format a file outside the repository: ${filePath}`,
      )
    }

    const source = await readFile(absolutePath, "utf8")
    const config = (await resolveConfig(absolutePath)) ?? {}
    const formatted = await format(source, {
      ...config,
      filepath: absolutePath,
    })

    if (formatted !== source) {
      await writeFile(absolutePath, formatted, "utf8")
    }
    formattedFiles.push(relativePath)
  }

  return `formatted ${formattedFiles.join(", ")}`
}
