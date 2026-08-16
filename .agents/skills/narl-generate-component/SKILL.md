---
name: narl-generate-component
description: Generate and implement a NARL ECS component creator with the repository Plop generator. Use when adding a component under src/game/model/components, including nested targets such as display/Foo or eq/slots/Foo, or when repairing component scaffold shape and import depth.
---

# Generate a NARL component

1. Inspect `plopfile.js`, `plop-templates/component/Component.ts.hbs`, the destination folder, and its nearest components before changing code.
2. Run `npm run generate:component -- <path/name>`. Pass a path relative to `src/game/model/components`; allow the optional `Component` suffix. Never create the initial scaffold by hand.
3. Keep the generated root contract: export `<Name>Component` from `getComponentCreator("<CONSTANT_NAME>")`. Preserve the calculated relative import and the plain-object ECS model.
4. Add fields or defaults only when the requested component contract requires them. Infer their shape from nearby components and avoid unrelated registry or architecture changes.
5. Reject `.` and `..` path segments. If a file already exists, inspect it instead of bypassing Plop's collision guard.

## Verify

- Confirm the filename, export, component type value, and relative import for the requested target and its nesting depth.
- Run focused tests for changed behavior, ESLint on changed TypeScript files, and `git diff --check`.
- Treat a repo-wide build failure as separate when it is unrelated to the generated component.
