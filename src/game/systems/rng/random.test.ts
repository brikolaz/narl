import { describe, expect, it, vi } from "vitest";
import { Random } from "./random";

const createRandom = (): Random =>
  new Random({ seed: "test-seed", namespace: "test" });

describe("Random.pick", () => {
  it("picks an item from the array", () => {
    const random = createRandom();
    vi.spyOn(random, "random").mockReturnValue(0.5);

    expect(random.pick("first", "second", "third")).toBe("second");
  });

  it("returns undefined for an empty array without rolling", () => {
    const random = createRandom();
    const randomSpy = vi.spyOn(random, "random");

    expect(random.pick()).toBeUndefined();
    expect(randomSpy).not.toHaveBeenCalled();
  });
});
