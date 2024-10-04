import { crux } from "./src/index";

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
      "no-console": "off",
      "ts/ban-ts-comment": "off",
      "import/no-mutable-exports": "off",
      "no-unused-vars": "off",
    },
  },
);
