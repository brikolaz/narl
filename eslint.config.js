import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import unusedImports from "eslint-plugin-unused-imports"
import { defineConfig, globalIgnores } from "eslint/config"
import localRules from "./scripts/eslint/index.js"

export default defineConfig([
  globalIgnores(["dist"]),

  {
    files: ["**/*.ts"],

    extends: [js.configs.recommended, tseslint.configs.recommended],
    ignores: [".vite/**", "dist/**", "coverage/**"],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      local: localRules,
      "unused-imports": unusedImports,
    },

    rules: {
      eqeqeq: ["error", "always"],
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message:
            "Use `createEnum(...)` and access its values as `FooEnum.FOO_VALUE` instead of a TypeScript enum.",
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "typeLike",
          format: ["StrictPascalCase"],
          custom: { regex: "^(?:I|T)[A-Z]", match: false },
        },
        {
          selector: "typeParameter",
          format: ["StrictPascalCase"],
          custom: { regex: "^(?:.|[IT][A-Z].*)$", match: false },
        },
        {
          selector: "function",
          modifiers: ["exported"],
          format: ["strictCamelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "function",
          format: ["strictCamelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "variable",
          modifiers: ["exported"],
          format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "variable",
          modifiers: ["global"],
          format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        {
          selector: "variable",
          types: ["function"],
          format: ["strictCamelCase", "StrictPascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "variable",
          format: ["strictCamelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "parameter",
          modifiers: ["unused"],
          format: ["strictCamelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "parameter",
          format: ["strictCamelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "method",
          format: ["strictCamelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "typeProperty",
          format: ["strictCamelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "classProperty",
          format: ["strictCamelCase"],
          leadingUnderscore: "forbid",
        },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "unused-imports/no-unused-imports": "error",
      "local/action-contract": "error",
      "local/ecs-component-contract": "error",
      "local/ecs-entity-contract": "error",
      "local/entity-creator-inference-contract": "error",
      "local/enum-like-contract": "error",
      "local/module-constant-contract": "error",
      "local/predicate-contract": [
        "error",
        { allowedBooleanNames: ["chance"] },
      ],
      "local/property-contract": "error",
      "local/underscore-contract": "error",
    },
  },
])
