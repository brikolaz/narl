import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import unusedImports from "eslint-plugin-unused-imports"
import { defineConfig, globalIgnores } from "eslint/config"

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
      "unused-imports": unusedImports,
    },

    rules: {
      eqeqeq: ["error", "always"],
      "no-debugger": "error",
      "no-duplicate-imports": "error",
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
    },
  },
])
