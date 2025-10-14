import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react"
  },
  test: {
    environment: "happy-dom",
    setupFiles: "./test/setup.js",
    include: ["test/**/*.test.{js,jsx,ts,tsx}"]
  }
});
