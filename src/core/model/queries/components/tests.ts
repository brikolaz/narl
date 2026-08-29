import { expect } from "vitest";
import type { GameState } from "../../../../game/state/state";
import type { Component } from "../../Component";
import type { Entity } from "../../Entity";

const expectComponentRegistryParity = (state: GameState) => {
    for (const [id, record] of Object.entries(state.componentRegistryById)) {
        const { component, parent } = record;
        expect(component.id).toBe(Number(id));
        expect(parent.componentById.get(component.id)).toBe(component);
        expect(parent.componentByType.get(component.type)?.get(component.id)).toBe(
            component,
        );
    }
}

const expectComponentRegistryRecordConsistent = (state: GameState, entity: Entity) => {
    for (const component of entity.componentById.values()) {
        expect(state.componentRegistryById[component.id]?.component).toBe(
            component,
        );
        expect(state.componentRegistryById[component.id]?.parent).toBe(entity);
        expect(
            entity.componentByType.get(component.type)?.get(component.id),
        ).toBe(component);
    }
}

const expectComponentTypesConsistent = (entity: Entity) => {
    for (const [type, components] of entity.componentByType) {
        for (const component of components.values()) {
            expect(component.type).toBe(type);
            expect(entity.componentById.get(component.id)).toBe(component);
        }
    }
}

export const expectComponentStateConsistent = (state: GameState) => {
    expectComponentRegistryParity(state)

    for (const { entity } of Object.values(state.entityRegistryById)) {
        expectComponentRegistryRecordConsistent(state, entity)
        expectComponentTypesConsistent(entity)
    }
};

export const expectComponentAttached = (
    state: GameState,
    entity: Entity,
    component: Component,
) => {
    expect(entity.componentById.get(component.id)).toBe(component);
    expect(entity.componentByType.get(component.type)?.get(component.id)).toBe(
        component,
    );
    expect(state.componentRegistryById[component.id]?.component).toBe(component);
    expect(state.componentRegistryById[component.id]?.parent).toBe(entity);
};

export const expectComponentsAttached = (
    state: GameState,
    entity: Entity,
    ...components: Component[]
) => {
    for (const component of components) {
        expectComponentAttached(state, entity, component);
    }
};

export const expectComponentNotAttached = (
    entity: Entity,
    component: Component,
) => {
    expect(entity.componentById.get(component.id)).not.toBe(component);
    expect(
        entity.componentByType.get(component.type)?.get(component.id),
    ).not.toBe(component);
};

export const expectComponentsNotAttached = (
    entity: Entity,
    ...components: Component[]
) => {
    for (const component of components) {
        expectComponentNotAttached(entity, component);
    }
};

export const expectComponentDetached = (
    state: GameState,
    entity: Entity,
    component: Component,
) => {
    expectComponentNotAttached(entity, component);
    expect(state.componentRegistryById[component.id]).toBeUndefined();
};

export const expectComponentsDetached = (
    state: GameState,
    entity: Entity,
    ...components: Component[]
) => {
    for (const component of components) {
        expectComponentDetached(state, entity, component);
    }
};
