import { writeFile } from "node:fs/promises";
import { builtinRules } from "eslint/use-at-your-own-risk";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import pico from "picocolors";
import { getPackageSettings } from "../src/config";
import {
  command,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  perfectionist,
  prettier,
  regexp,
  sortImports,
  sortPackageJson,
  sortTSConfig,
  specialCases,
  typescript,
  typescriptNew,
  unicorn,
  vue,
  yaml,
} from "../src/configs";

import { combine } from "../src/utils";

// Set feature flags for typegen
const packageSettings = getPackageSettings({
  filePath: "src/typegen.ts",
  flags: {
    javascript: true,
    typescript: true,
  },
  lintPresets: { presetJavaScript: true },
  files: [],
  isInEditor: false,
  autoRenamePlugins: false,
  componentExts: [],
  gitignore: true,
});

const configs = await combine(
  // base settings
  {
    plugins: {
      "": {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  // lang extensions
  javascript(),
  typescript(),
  typescriptNew(),
  command(),
  comments(),
  ignores(),
  imports(),
  jsdoc(),
  jsonc(),
  markdown(),
  node(),
  perfectionist(),
  prettier(),
  regexp(),
  sortImports(),
  sortPackageJson(),
  sortTSConfig(),
  specialCases(),
  unicorn(),
  vue(),
  yaml(),
);

// exporting '.d.ts' files in single file
let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
});

const configNames = configs.map((i) => i.name).filter(Boolean) as string[];

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(" | ")}
`;

await writeFile(packageSettings.filePath, dts);
console.log(pico.green("Type definitions generated!"));
