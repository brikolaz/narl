---
name: narl-generate-mob
description: Generate a NARL mob entity and empty manual, then AST-wire both mob registries with the repository Plop generator. Use when adding a mob, repairing MOB_FACTORIES or MOB_MANUALS wiring, or checking the required mob scaffold contract.
---

# Generate a NARL mob

1. Inspect `plopfile.js`, both entity templates, `src/game/model/entities/mobs/AGENTS.md`, and the nearest working mob.
2. Run `npm run generate:mob -- <name>`. Pass a mob name, not a nested path. Let Plop normalize the entity name, folder, type value, and registry imports.
3. Preserve the generated scaffold:
   - `<Name>Entity` uses `getEntityCreator("<CONSTANT_NAME>")`;
   - `<Name>EntityFactory: MobFactory` creates a local entity and returns it;
   - `<Name>EntityManual: Manual = {}` remains empty unless the request explicitly defines manual data.
4. Keep default factory components empty unless the requested mob behavior requires concrete components. Keep any rendered mob glyph uppercase.
5. Preserve AST-backed wiring in `MOB_FACTORIES` and `MOB_MANUALS`. Never replace it with string or regex edits; never append structurally duplicate entries.

## Verify

- Confirm both generated files, both imports, and both `[Entity.type, value]` map entries.
- Exercise creation through `MOB_FACTORIES` and lookup through `MOB_MANUALS` when behavior changed.
- Run focused tests, ESLint on changed files and `plopfile.js` when touched, then `git diff --check`.
