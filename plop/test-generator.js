import { mkdir, opendir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GENERATED_TEST_SUFFIX = ".test.ts";
const EXCLUDED_DIRECTORIES = new Set([
  ".agents",
  ".codex",
  ".git",
  ".vite",
  ".VSCodeCounter",
  "build",
  "coverage",
  "dist",
  "generated",
  "node_modules",
  "tmp",
  "vendor",
]);
const TEST_TEMPLATE_PATH = fileURLToPath(
  new URL("../plop-templates/test/test.ts.hbs", import.meta.url),
);

export const normalizeTarget = (target) => {
  const normalized = target.trim().replaceAll("\\", "/");

  if (!normalized) {
    throw new Error("Test target is required");
  }
  if (path.posix.isAbsolute(normalized) || /^[a-zA-Z]:\//.test(normalized)) {
    throw new Error("Test target must be relative");
  }
  if (path.posix.extname(path.posix.basename(normalized))) {
    throw new Error("Test target must be provided without an extension");
  }

  return normalized;
};

const getPathDestination = (repoRoot, target) => {
  const destination = path.resolve(repoRoot, `${target}${GENERATED_TEST_SUFFIX}`);
  const relativeDestination = path.relative(repoRoot, destination);

  if (
    relativeDestination.startsWith(`..${path.sep}`) ||
    relativeDestination === ".."
  ) {
    throw new Error("Test destination must be inside the repository");
  }

  return destination;
};

const isSourceCandidate = (fileName, target) =>
  !/\.(?:test|spec)\./i.test(fileName) && path.parse(fileName).name === target;

export const findSourceMatches = async (repoRoot, target) => {
  const matches = [];

  const visit = async (directory) => {
    const entries = [];
    for await (const entry of await opendir(directory)) {
      entries.push(entry);
    }
    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRECTORIES.has(entry.name)) {
          await visit(entryPath);
        }
      } else if (entry.isFile() && isSourceCandidate(entry.name, target)) {
        matches.push(entryPath);
      }
    }
  };

  await visit(repoRoot);
  return matches;
};

export const resolveDestination = async ({
  target,
  repoRoot,
  cwd,
  findMatches = findSourceMatches,
  chooseMatch,
  confirmFallback,
}) => {
  const normalizedTarget = normalizeTarget(target);

  if (normalizedTarget.includes("/")) {
    return {
      mode: "path",
      destination: getPathDestination(repoRoot, normalizedTarget),
    };
  }

  const matches = await findMatches(repoRoot, normalizedTarget);
  if (matches.length === 1) {
    return {
      mode: "basename",
      destination: path.join(
        path.dirname(matches[0]),
        `${normalizedTarget}${GENERATED_TEST_SUFFIX}`,
      ),
    };
  }
  if (matches.length > 1) {
    if (!chooseMatch) {
      throw new Error("Multiple source matches require an interactive selection");
    }
    const selected = await chooseMatch(matches);
    if (!matches.includes(selected)) {
      throw new Error("Invalid source selection");
    }
    return {
      mode: "basename",
      destination: path.join(
        path.dirname(selected),
        `${normalizedTarget}${GENERATED_TEST_SUFFIX}`,
      ),
    };
  }

  if (!confirmFallback || !(await confirmFallback(normalizedTarget))) {
    return null;
  }

  return {
    mode: "basename",
    destination: path.resolve(cwd, `${normalizedTarget}${GENERATED_TEST_SUFFIX}`),
  };
};

const toImportPath = (fromDirectory, modulePath) => {
  const relativePath = path
    .relative(fromDirectory, modulePath)
    .split(path.sep)
    .join("/");
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
};

export const renderTest = async ({
  destination,
  repoRoot,
  templatePath = TEST_TEMPLATE_PATH,
}) => {
  const template = await readFile(templatePath, "utf8");
  const destinationDirectory = path.dirname(destination);
  const describeName = path.basename(destination, GENERATED_TEST_SUFFIX);
  const replacements = {
    describeName,
    gameImport: toImportPath(destinationDirectory, path.join(repoRoot, "src/game")),
    internalActionTypeImport: toImportPath(
      destinationDirectory,
      path.join(repoRoot, "src/game/systems/internal/type"),
    ),
    testHelpersImport: toImportPath(
      destinationDirectory,
      path.join(repoRoot, "src/tests"),
    ),
  };

  return template.replace(/{{(\w+)}}/g, (placeholder, key) => {
    if (!(key in replacements)) {
      throw new Error(`Unknown test template placeholder: ${placeholder}`);
    }
    return replacements[key];
  });
};

export const generateTest = async ({ destination, repoRoot, templatePath }) => {
  const contents = await renderTest({ destination, repoRoot, templatePath });

  try {
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, contents, { encoding: "utf8", flag: "wx" });
  } catch (error) {
    if (error?.code === "EEXIST") {
      throw new Error(`${path.basename(destination)} already exists`);
    }
    throw new Error(`Could not create ${destination}: ${error.message}`);
  }

  return destination;
};
