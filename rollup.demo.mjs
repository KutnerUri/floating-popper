import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

// Build a standalone demo bundle for GitHub Pages into docs/demo.js
// React and ReactDOM are provided via CDN in docs/index.html
export default defineConfig({
  input: "demo/main.tsx",
  external: ["react", "react/jsx-runtime", "react-dom", "react-dom/client"],
  output: {
    file: "docs/demo.js",
    format: "iife",
    name: "Demo",
    globals: {
      react: "React",
      "react/jsx-runtime": "jsxRuntime",
      "react-dom": "ReactDOM",
      "react-dom/client": "ReactDOM",
    },
    sourcemap: true,
  },
  plugins: [
    nodeResolve({ extensions: [".js", ".jsx", ".ts", ".tsx"] }),
    commonjs(),
    // Compile TSX to classic React.createElement to avoid jsx-runtime globals
    typescript({ tsconfig: "./tsconfig.demo.json" }),
    replace({
      preventAssignment: true,
      values: { "process.env.NODE_ENV": JSON.stringify("production") },
    }),
  ],
});
