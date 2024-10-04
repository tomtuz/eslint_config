import type { Linter } from "eslint";

import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from "./types";

import { FlatConfigComposer } from "eslint-flat-config-utils";

import { runMain } from "./mapConfigs";

import { interopDefault, isInEditorEnv } from "./utils";
// import { formatters } from './configs/formatters'

const flatConfigProps = [
  "name",
  "languageOptions",
  "linterOptions",
  "processor",
  "plugins",
  "rules",
  "settings",
] satisfies (keyof TypedFlatConfigItem)[];

// const VuePackages = ["vue", "nuxt", "vitepress", "@slidev/cli"];

export const defaultPluginRenaming = {
  "@eslint-react": "react",
  "@eslint-react/dom": "react-dom",
  "@eslint-react/hooks-extra": "react-hooks-extra",
  "@eslint-react/naming-convention": "react-naming-convention",

  "@typescript-eslint": "ts",
  yaml: "yaml",
  "import-x": "import",
  n: "node",
  vitest: "test",
};

export function crux(
  options: OptionsConfig & Omit<TypedFlatConfigItem, "files"> = {},
  ...userConfigs: Awaitable<
    | TypedFlatConfigItem
    | TypedFlatConfigItem[]
    | FlatConfigComposer<any, any>
    | Linter.Config[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  // settings
  const {
    autoRenamePlugins = true,
    componentExts = [],
    gitignore = true,
  } = options;

  let isInEditor = options.isInEditor;
  if (isInEditor == null) {
    isInEditor = isInEditorEnv();
    if (isInEditor)
      console.log("Detected running in editor, some rules are disabled.");
  }

  console.log("crux()");
  console.log("----------------");
  console.log("autoRenamePlugins: ", autoRenamePlugins);
  console.log("componentExts: ", componentExts);
  console.log("gitignore: ", gitignore);
  console.log("isInEditor: ", isInEditor);

  // -- Update config

  const defaultConfigs: Awaitable<TypedFlatConfigItem[]>[] = [];

  // handle .gitignore file
  if (gitignore) {
    if (typeof gitignore !== "boolean") {
      defaultConfigs.push(
        interopDefault(import("eslint-config-flat-gitignore")).then((r) => [
          r({
            name: "crux/gitignore",
            ...gitignore,
          }),
        ]),
      );
    } else {
      defaultConfigs.push(
        interopDefault(import("eslint-config-flat-gitignore")).then((r) => [
          r({
            name: "crux/gitignore",
            strict: false,
          }),
        ]),
      );
    }
  }

  defaultConfigs.push(...runMain(options));
  console.log("defaultConfigs.length: ", defaultConfigs.length);

  // -- ENABLE EXTENSIONS

  if ("files" in options) {
    throw new Error(
      'The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.',
    );
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) acc[key] = options[key] as any;
    return acc;
  }, {} as TypedFlatConfigItem);
  if (Object.keys(fusedConfig).length) defaultConfigs.push([fusedConfig]);

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

  composer = composer.append(...defaultConfigs, ...(userConfigs as any));

  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming);
  }

  return composer;
}
