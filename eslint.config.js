import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),

  {
    files: ["**/*.ts"],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    plugins: {
      "unused-imports": unusedImports,
    },

    rules: {
      "unused-imports/no-unused-imports": "error",
    },
  },
]);