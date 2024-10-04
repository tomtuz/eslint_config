import { crux } from "./src/run";

export default crux(
  {
    vue: false,
    react: true,
    solid: false,
    svelte: false,
    astro: false,
    typescript: true,
    formatters: true,
    type: "lib",
  },
  {
    name: "[MANUAL] 'ignores' selection",
    ignores: ["**/node_modules", "**/dist", "**/package-lock.json"],
  },
  {
    name: "[MANUAL] 'files' selection",
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": "error",
    },
  },
);
