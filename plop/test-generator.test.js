import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  findSourceMatches,
  generateTest,
  renderTest,
  resolveDestination,
} from "./test-generator.js";

describe("test generator", () => {
  let repoRoot;
  let cwd;

  beforeEach(async () => {
    repoRoot = await mkdtemp(path.join(os.tmpdir(), "narl-test-generator-"));
    cwd = path.join(repoRoot, "working-directory");
    await mkdir(cwd);
  });

  afterEach(async () => {
    await rm(repoRoot, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it("resolves a path target directly without lookup or interaction", async () => {
    const findMatches = vi.fn();
    const chooseMatch = vi.fn();
    const confirmFallback = vi.fn();

    const result = await resolveDestination({
      target: "src/game/systems/poke/resolveWorldPokeAction",
      repoRoot,
      cwd,
      findMatches,
      chooseMatch,
      confirmFallback,
    });

    expect(result).toEqual({
      mode: "path",
      destination: path.join(
        repoRoot,
        "src/game/systems/poke/resolveWorldPokeAction.test.ts",
      ),
    });
    expect(findMatches).not.toHaveBeenCalled();
    expect(chooseMatch).not.toHaveBeenCalled();
    expect(confirmFallback).not.toHaveBeenCalled();
  });

  it("generates a path target when no matching source exists", async () => {
    const { destination } = await resolveDestination({
      target: "src/missing/MyCustomTest",
      repoRoot,
      cwd,
    });

    await generateTest({ destination, repoRoot });

    expect(await readFile(destination, "utf8")).toContain(
      'describe("MyCustomTest", () => {',
    );
  });

  it("automatically resolves one exact basename match", async () => {
    const source = path.join(repoRoot, "src/feature/foo.tsx");

    const result = await resolveDestination({
      target: "foo",
      repoRoot,
      cwd,
      findMatches: vi.fn().mockResolvedValue([source]),
    });

    expect(result.destination).toBe(
      path.join(repoRoot, "src/feature/foo.test.ts"),
    );
  });

  it("uses the selected source when a basename has multiple matches", async () => {
    const matches = [
      path.join(repoRoot, "src/a/foo.ts"),
      path.join(repoRoot, "src/b/foo.js"),
    ];
    const chooseMatch = vi.fn().mockResolvedValue(matches[1]);

    const result = await resolveDestination({
      target: "foo",
      repoRoot,
      cwd,
      findMatches: vi.fn().mockResolvedValue(matches),
      chooseMatch,
    });

    expect(chooseMatch).toHaveBeenCalledWith(matches);
    expect(result.destination).toBe(path.join(repoRoot, "src/b/foo.test.ts"));
  });

  it("falls back to the current directory after confirmation", async () => {
    const confirmFallback = vi.fn().mockResolvedValue(true);

    const result = await resolveDestination({
      target: "foo",
      repoRoot,
      cwd,
      findMatches: vi.fn().mockResolvedValue([]),
      confirmFallback,
    });

    expect(confirmFallback).toHaveBeenCalledWith("foo");
    expect(result.destination).toBe(path.join(cwd, "foo.test.ts"));
  });

  it("does nothing when the current-directory fallback is declined", async () => {
    const result = await resolveDestination({
      target: "foo",
      repoRoot,
      cwd,
      findMatches: vi.fn().mockResolvedValue([]),
      confirmFallback: vi.fn().mockResolvedValue(false),
    });

    expect(result).toBeNull();
  });

  it("finds exact basenames while ignoring tests and excluded directories", async () => {
    const files = [
      "src/foo.ts",
      "src/foo.test.ts",
      "src/foo.spec.js",
      "src/foobar.ts",
      "node_modules/package/foo.ts",
      "dist/foo.js",
      "build/foo.js",
      "coverage/foo.js",
      ".git/foo.ts",
      "vendor/foo.ts",
      "generated/foo.ts",
    ];
    for (const file of files) {
      const filePath = path.join(repoRoot, file);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, "");
    }

    const matches = await findSourceMatches(repoRoot, "foo");

    expect(matches).toEqual([path.join(repoRoot, "src/foo.ts")]);
  });

  it("never overwrites an existing test", async () => {
    const destination = path.join(repoRoot, "src/foo.test.ts");
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, "existing contents");

    await expect(generateTest({ destination, repoRoot })).rejects.toThrow(
      "foo.test.ts already exists",
    );
    expect(await readFile(destination, "utf8")).toBe("existing contents");
  });

  it("renders the standard lifecycle with destination-relative imports", async () => {
    const destination = path.join(repoRoot, "src/foo/MyCustomTest.test.ts");

    const contents = await renderTest({ destination, repoRoot });

    expect(contents).toContain('describe("MyCustomTest", () => {');
    expect(contents).toContain("beforeEach(() => {");
    expect(contents).toContain("afterEach(() => {");
    expect(contents).toContain(
      "game.dispatch({ type: InternalActionType.INIT });",
    );
    expect(contents).not.toContain("dispatchGameAction");
    expect(contents).toContain("clearMobs(game);");
    expect(contents).toContain("clearItems(game);");
    expect(contents).toContain(
      "if (integrityCheckEnabled()) {\n      expectGameStateConsistent(game);\n    }",
    );
    expect(contents).toContain("vi.restoreAllMocks();");
    expect(contents).toContain('from "../tests/clear";');
    expect(contents).toContain('from "../tests/integrity";');
  });

  it("rejects targets that include an extension", async () => {
    await expect(
      resolveDestination({ target: "foo.ts", repoRoot, cwd }),
    ).rejects.toThrow("without an extension");
  });
});
