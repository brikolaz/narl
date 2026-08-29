import { beforeEach, describe, expect, it } from "vitest";

import {
  initState,
  type GameState,
} from "../../../../game/state/state";
import { getComponentCreator } from "../../Component";
import { getEntityCreator, type Entity } from "../../Entity";
import type { Id } from "../../Id";
import { upsertComponents } from "./add";
import { expectComponentAttached, expectComponentDetached, expectComponentsAttached, expectComponentsDetached } from "./tests";

const TestEntity = getEntityCreator("TEST_ENTITY");
const TestComponent = getComponentCreator("TEST_COMPONENT");
const AnotherTestComponent = getComponentCreator("ANOTHER_TEST_COMPONENT");

describe("upsertComponents", () => {
  let state: GameState;

  beforeEach(() => {
    state = initState();
  });

  describe.each([
    {
      name: "single component in empty entity",
      createInitialComponents: () => [],
      createNewComponents: () => [TestComponent()],
    },
    {
      name: "single component of the same type",
      createInitialComponents: () => [TestComponent()],
      createNewComponents: () => [TestComponent()],
    },
    {
      name: "single component of different type",
      createInitialComponents: () => [TestComponent()],
      createNewComponents: () => [AnotherTestComponent()],
    },
    {
      name: "multiple components of the same type in empty entity",
      createInitialComponents: () => [],
      createNewComponents: () => [TestComponent(), TestComponent()],
    },
    {
      name: "multiple components of the same type in non-empty entity",
      createInitialComponents: () => [TestComponent(), TestComponent()],
      createNewComponents: () => [TestComponent(), TestComponent()],
    },
    {
      name: "multiple components of different types in non-empty entity",
      createInitialComponents: () => [TestComponent(), AnotherTestComponent()],
      createNewComponents: () => [TestComponent(), AnotherTestComponent()],
    },
    {
      name: "multiple components of different types in empty entity",
      createInitialComponents: () => [],
      createNewComponents: () => [TestComponent(), AnotherTestComponent()],
    },
  ])("$name", ({ createInitialComponents, createNewComponents }) => {
    describe.each([
      {
        name: "with entity object",
        getEntityInput: (entity: Entity) => entity,
      },
      {
        name: "with entity id",
        getEntityInput: (entity: Entity): Id => entity.id,
      },
    ])("$name", ({ getEntityInput }) => {
      it("adds", () => {
        const entity = TestEntity();
        const components = createNewComponents();

        upsertComponents(getEntityInput(entity), ...components);

        for (const component of components) {
          expectComponentAttached(state, entity, component);
        }
      });

      it("preserves existing", () => {
        const entity = TestEntity();
        const initialComponents = createInitialComponents();
        const newComponents = createNewComponents();

        upsertComponents(getEntityInput(entity), ...initialComponents);
        upsertComponents(getEntityInput(entity), ...newComponents);

        for (const component of [...initialComponents, ...newComponents]) {
          expectComponentAttached(state, entity, component);
        }
      });

      it("overwrites", () => {
        const entity = TestEntity();
        const initialComponents = createInitialComponents();
        const newComponents = createNewComponents();
        const updatedComponents = createNewComponents();
        for (let i = 0; i < newComponents.length; i++) {
          updatedComponents[i].id = newComponents[i].id;
        }

        upsertComponents(getEntityInput(entity), ...initialComponents);
        upsertComponents(getEntityInput(entity), ...newComponents);
        upsertComponents(getEntityInput(entity), ...updatedComponents);

        for (const component of newComponents) {
          expectComponentDetached(state, entity, component);
        }
        for (const component of [...initialComponents, ...updatedComponents]) {
          expectComponentAttached(state, entity, component);
        }
        expectComponentsAttached(
          state,
          entity,
          ...initialComponents,
          ...updatedComponents,
        );
      });

      it("attaches to a new parent", () => {
        const firstEntity = TestEntity();
        const secondEntity = TestEntity();
        const initialComponents = createInitialComponents();
        const newComponents = createNewComponents();

        upsertComponents(firstEntity, ...initialComponents, ...newComponents);
        upsertComponents(secondEntity, ...initialComponents, ...newComponents);

        expectComponentsDetached(
          state,
          firstEntity,
          ...initialComponents,
          ...newComponents,
        );
        expectComponentsAttached(
          state,
          secondEntity,
          ...initialComponents,
          ...newComponents,
        );
      });
    });
  });

  it("handles the same component provided multiple times", () => {
    const entity = TestEntity();
    const component = TestComponent();

    upsertComponents(entity, component, component);

    expectComponentAttached(state, entity, component);
    expect(entity.componentById.size).toBe(1);
    expect(entity.componentByType.get(component.type)?.size).toBe(1);
  });

  it("does nothing when entity is undefined", () => {
    const component = TestComponent();

    upsertComponents(undefined);

    expect(state.componentRegistryById[component.id]).toBeUndefined();
  });

  it("does nothing when entity is undefined and no components are provided", () => {
    const component = TestComponent();

    upsertComponents(undefined);

    expect(state.componentRegistryById[component.id]).toBeUndefined();
  });

  it("does nothing when entity id cannot be resolved", () => {
    const component = TestComponent();

    upsertComponents(Infinity, component);

    expect(state.componentRegistryById[component.id]).toBeUndefined();
  });

  it("does nothing when no components are provided", () => {
    const entity = TestEntity();

    upsertComponents(entity);

    expect(entity.componentById.size).toBe(0);
    expect(entity.componentByType.size).toBe(0);
  });
});
