import { defineBuildConfig } from "unbuild";
// import { fileURLToPath } from "node:url";

export default defineBuildConfig({
  entries: ["./src/index.ts"],
  outDir: "dist",
  clean: true,
  failOnWarn: false,
  // Add *.d.ts files
  declaration: true,
  // stub: true,
  // alias: {
  //   "@": fileURLToPath(new URL("./", import.meta.url)),
  // },
  // externals: ["eslint", "eslint-plugin-command", "@typescript-eslint/utils"],
});
