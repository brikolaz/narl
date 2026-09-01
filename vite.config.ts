import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  // itch.io serves uploaded HTML games from a generated URL, so their assets
  // need to be relative to index.html. Keep the existing /play/ base elsewhere.
  base: mode === "itch" ? "./" : "/play/",
}));
