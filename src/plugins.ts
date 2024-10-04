// @ts-nocheck

import { interopDefault } from "./utils";

const [
  configJs,
  // pluginComments, // This is a direct export and doesn't need interopDefault
  pluginMarkdown,
  tseslint,
  // pluginUnicorn,
  pluginVue,
  // pluginNode,
  // pluginPerfectionist,
  pluginPrettier,
  configPrettier,
  // pluginUnusedImports,
  pluginJsdoc,
  pluginIgnore,
  // pluginImport,
  pluginJsonc,
  pluginYml,
  parserVue,
  parserYml,
  parserJsonc,
  configCommand,
] = await Promise.all([
  interopDefault(import("@eslint/js")),
  // interopDefault(
  //   import("@eslint-community/eslint-plugin-eslint-comments/configs"),
  // ),
  interopDefault(import("@eslint/markdown")),
  interopDefault(import("typescript-eslint")),
  interopDefault(import("eslint-plugin-unicorn")),
  interopDefault(import("eslint-plugin-vue")),
  // interopDefault(import("eslint-plugin-n")),
  // interopDefault(import("eslint-plugin-perfectionist")),
  interopDefault(import("eslint-plugin-prettier")),
  interopDefault(import("eslint-config-prettier")),
  // interopDefault(import("eslint-plugin-unused-imports")),
  interopDefault(import("eslint-plugin-jsdoc")),
  interopDefault(import("eslint-config-flat-gitignore")),
  // interopDefault(import("eslint-plugin-import-x")),
  interopDefault(import("eslint-plugin-jsonc")),
  interopDefault(import("eslint-plugin-yml")),
  interopDefault(import("vue-eslint-parser")),
  interopDefault(import("yaml-eslint-parser")),
  interopDefault(import("jsonc-eslint-parser")),
  interopDefault(import("eslint-plugin-command/config")),
] as const);

export { default as pluginComments } from "@eslint-community/eslint-plugin-eslint-comments";
export { default as pluginAntfu } from "eslint-plugin-antfu";
export * as pluginImport from "eslint-plugin-import-x";
export { default as pluginNode } from "eslint-plugin-n";
export { default as pluginPerfectionist } from "eslint-plugin-perfectionist";
export { default as pluginUnicorn } from "eslint-plugin-unicorn";
export { default as pluginUnusedImports } from "eslint-plugin-unused-imports";

export {
  configCommand,
  configJs,
  configPrettier,
  parserJsonc,
  parserVue,
  parserYml,
  pluginIgnore,
  // pluginUnusedImports,
  pluginJsdoc,
  // pluginImport,
  pluginJsonc,
  // pluginComments,
  pluginMarkdown,
  // pluginNode,
  // pluginPerfectionist,
  pluginPrettier,
  // pluginUnicorn,
  pluginVue,
  pluginYml,
  tseslint,
};
