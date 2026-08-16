---
name: narl-generate-entity
description: Generate and implement a NARL entity creator and Factory with the repository Plop generator. Use when adding an entity under src/game/model/entities, including nested paths, or when repairing the generated entity factory, naming, and relative imports.
---

# Generate a NARL entity

1. Inspect `plopfile.js`, `plop-templates/entity/Entity.ts.hbs`, `src/game/model/Factory.ts`, and the nearest entities at the target path.
2. Run `npm run generate:entity -- <path/name>`. Pass a path relative to `src/game/model/entities`; allow the optional `Entity` suffix. Never hand-write the initial scaffold.
3. Preserve the generated contract:
   - create `<Name>Entity` with `getEntityCreator("<CONSTANT_NAME>")`;
   - export `<Name>EntityFactory: Factory`;
   - create a named local entity inside `getDefault()` and explicitly return it.
4. Add components or factory behavior only when required by the requested entity. Follow nearby factories and keep entities as plain objects created by functions.
5. Do not invent registry wiring: the generic entity generator creates one entity module only. Reject `.` and `..` path segments and preserve calculated import depth.

## Verify

- Confirm the output path, creator value, factory type, local variable name, explicit return, and imports.
- Run focused tests for changed behavior, ESLint on changed TypeScript files, and `git diff --check`.
- Report unrelated repo-wide build failures separately.
