import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import {
  findSourceMatches,
  generateTest,
  normalizeTarget,
  resolveDestination,
} from "../testGenerator.js"
import { formatGeneratedFiles } from "../format.js"

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
)

export const registerTestGenerator = (plop) => {
  plop.setGenerator("test", {
    description: "Create a colocated test with the standard game lifecycle",
    prompts: [
      {
        type: "input",
        name: "target",
        message: "Test path/name:",
        validate: (value) => {
          try {
            normalizeTarget(value)
            return true
          } catch (error) {
            return error.message
          }
        },
      },
      {
        type: "list",
        name: "sourceMatch",
        message: "Multiple matches found:",
        choices: (answers) =>
          answers.sourceMatches.map((match) => ({
            name: path.relative(REPO_ROOT, match),
            value: match,
          })),
        when: async (answers) => {
          const target = normalizeTarget(answers.target)
          if (target.includes("/")) {
            return false
          }
          answers.sourceMatches = await findSourceMatches(REPO_ROOT, target)
          return answers.sourceMatches.length > 1
        },
      },
      {
        type: "confirm",
        name: "createInCwd",
        message: (answers) =>
          `No matching source file found.\nCreate ${normalizeTarget(answers.target)}.test.ts in the current directory?`,
        default: false,
        when: (answers) =>
          !normalizeTarget(answers.target).includes("/") &&
          answers.sourceMatches.length === 0,
      },
    ],
    actions: (answers) => [
      async () => {
        const resolution = await resolveDestination({
          target: answers.target,
          repoRoot: REPO_ROOT,
          cwd: process.cwd(),
          findMatches: async () =>
            answers.sourceMatches ??
            findSourceMatches(REPO_ROOT, normalizeTarget(answers.target)),
          chooseMatch: async () => answers.sourceMatch,
          confirmFallback: async () => answers.createInCwd,
        })

        if (!resolution) {
          return "No test created"
        }

        const destination = await generateTest({
          destination: resolution.destination,
          repoRoot: REPO_ROOT,
        })
        await formatGeneratedFiles([destination])
        return path.relative(REPO_ROOT, destination)
      },
    ],
  })
}
