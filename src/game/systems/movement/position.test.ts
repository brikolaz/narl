import { beforeEach, describe, expect, it } from "vitest";
import { getEntityCreator } from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { PositionComponent } from "../../model/components/PositionComponent";
import { initState } from "../../state/state";
import { Direction } from "../turn/types";
import { getDirection } from "./position";

const PositionedEntity = getEntityCreator("TEST_DIRECTION_ENTITY");

const createAt = (position: number) => {
  const entity = PositionedEntity();
  upsertComponents(entity, PositionComponent({ position }));
  return entity;
};

describe("getDirection", () => {
  beforeEach(() => {
    initState();
  });

  it("returns LEFT when target position is lower", () => {
    expect(getDirection(createAt(10), createAt(9))).toBe(Direction.LEFT);
  });

  it("returns RIGHT when target position is higher", () => {
    expect(getDirection(createAt(10), createAt(11))).toBe(Direction.RIGHT);
  });

  it("returns undefined when positions are equal", () => {
    expect(getDirection(createAt(10), createAt(10))).toBeUndefined();
  });
});
