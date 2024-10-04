import * as allConfigs from "./configs";
import { jsx } from "./configs/jsx";
import { perfectionist } from "./configs/perfectionist";
import { regexp } from "./configs/regexp";
import { sortPackageJson, sortTSConfig } from "./configs/sort";
import { typescript } from "./configs/typescript";

import { unicorn } from "./configs/unicorn";
// type AllKeys = keyof typeof allConfigs;

import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from "./types";

import { getOverrides, resolveSubOptions } from "./utils";

type AllKeys = {
  [K in keyof typeof allConfigs]: (typeof allConfigs)[K] extends (
    ...args: any[]
  ) => Promise<TypedFlatConfigItem[]>
    ? K
    : never;
}[keyof typeof allConfigs];

// Separate types
type ControlAll = boolean;
interface ControlSpecific {
  plugins?: boolean;
  config?: boolean;
}
export type DependencyGate = ControlAll | ControlSpecific;
export type ExtensionDependencies = {
  [Key in Partial<AllKeys>]: DependencyGate;
};

// // -- PRESETS --
// export interface ExtensionPresets {
//   presetAll: boolean;
//   presetBasic: boolean;
//   presetLangsExtensions: boolean;
//   presetJsonc: boolean;
//   presetJavaScript: boolean;
// }

// export const defaultPresets: ExtensionPresets = {
//   presetAll: false,
//   presetBasic: false,
//   presetLangsExtensions: false,
//   presetJsonc: false,
//   presetJavaScript: false,
// };

// specify what you want to enable/disable here
export const extensionControlDefaults: ExtensionDependencies = {
  astro: false,
  command: false,
  comments: false,
  yaml: false,
  ignores: false,
  imports: false,
  javascript: false,
  jsdoc: false,
  jsonc: false,
  jsx: false,
  markdown: false,
  node: false,
  perfectionist: false,
  prettier: false,
  react: false,
  regexp: false,
  solid: false,
  sortImports: false,
  sortPackageJson: false,
  sortTSConfig: false,
  specialCases: false,
  svelte: false,
  typescript: false,
  typescriptNew: false,
  toml: false,
  unicorn: false,
  vue: false,
};

export interface ExtensionSettings {
  // Assuming unicorn can be an object or empty
  [key: string]: any; // Replace with specific structure if known
}

export function extensionSettings(
  options: OptionsConfig & Omit<TypedFlatConfigItem, "files">,
  enabledOptions: string[],
): ExtensionSettings {
  const typescriptOptions = resolveSubOptions(options, "typescript");
  const tsconfigPath =
    "tsconfigPath" in typescriptOptions
      ? typescriptOptions.tsconfigPath
      : undefined;

  return {
    _astro: {
      overrides: getOverrides(options, "astro"),
    },
    _yaml: {
      overrides: getOverrides(options, "yaml"),
    },
    _jsonc: [
      {
        overrides: getOverrides(options, "jsonc"),
      },
      sortPackageJson(),
      sortTSConfig(),
    ],
    _jsx: jsx(),
    _react: {
      overrides: getOverrides(options, "react"),
      tsconfigPath,
    },
    _regexp: typeof regexp === "boolean" ? {} : regexp,
    _solid: {
      overrides: getOverrides(options, "solid"),
      typescript: !!typescript,
      tsconfigPath,
    },
    _svelte: {
      overrides: getOverrides(options, "svelte"),
      typescript: !!typescript,
    },
    _typescript: {
      ...typescriptOptions,
      componentExts: options.componentExts,
      overrides: getOverrides(options, "typescript"),
      type: options.type,
    },
    _typescriptNew: {
      ...typescriptOptions,
      componentExts: options.componentExts,
      overrides: getOverrides(options, "typescript"),
      type: options.type,
    },
    _toml: {
      overrides: getOverrides(options, "toml"),
    },
    _unicorn: enabledOptions.includes("unicorn") ? {} : unicorn,
    _vue: "vue",
    markdown: {
      componentExts: options.componentExts,
      overrides: getOverrides(options, "markdown"),
    },
    // disables: disables(),

    // command: false,
    // comments: false,
    // ignores: false,
    // imports: false,
    // javascript: false,
    // jsdoc: false,
    // node: false,
    // prettier: false,
    // sort: false,
    // special: false,
  };
}

export function getEnabledConfigs(
  options: Partial<OptionsConfig & Omit<TypedFlatConfigItem, "files">>,
  enabledOptions: string[],
  configModules: ExtensionDependencies,
): any[] {
  const settings = extensionSettings(options, enabledOptions);
  const allConfigs: any[] = [];

  for (const optionName of enabledOptions) {
    console.log("Enabled option:", optionName);
    const selectedConfig = configModules[optionName as keyof AllKeys];
    if (!selectedConfig) {
      console.warn(`No configuration found for flag: ${optionName}`);
      continue;
    }

    console.log("found config!");
    const mappedSetting = settings[`_${optionName}`];
    console.log("mappedSetting: ", mappedSetting);

    if (typeof selectedConfig === "object") {
      if (selectedConfig.config) {
        const configFunction =
          allConfigs[optionName as keyof typeof allConfigs];
        if (typeof configFunction === "function") {
          const readyConfig = configFunction(mappedSetting);
          console.log("readyConfig: ", readyConfig);
          allConfigs.push(
            ...(Array.isArray(readyConfig) ? readyConfig : [readyConfig]),
          );
        }
      }
    } else if (typeof selectedConfig === "function") {
      const readyConfig = selectedConfig(mappedSetting);
      console.log("readyConfig: ", readyConfig);
      allConfigs.push(
        ...(Array.isArray(readyConfig) ? readyConfig : [readyConfig]),
      );
    }
  }
  return allConfigs;
}
export function getBaseConfigs(
  options: OptionsConfig & Omit<TypedFlatConfigItem, "files">,
): Awaitable<TypedFlatConfigItem[]>[] {
  const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

  const {
    command,
    comments,
    ignores: gitIgnore,
    imports,
    javascript,
    jsdoc,
    node,
  } = allConfigs;

  const { ignores, isInEditor } = options;

  configs.push(
    gitIgnore(ignores),
    javascript({
      isInEditor,
      overrides: getOverrides(options, "javascript"),
    }),
    comments(),
    node(),
    jsdoc(),
    imports(),
    command(),

    // Optional plugins (installed but not enabled by default)
    perfectionist(),
  );
  return configs;
}

function getEnabledOptions(
  options: OptionsConfig & Omit<TypedFlatConfigItem, "files">,
): string[] {
  console.log("options: ", options);
  const arr = [];

  for (const [keyName, value] of Object.entries(options)) {
    if (value) {
      arr.push(keyName);
    }
  }

  console.log("result: ", arr);
  return arr;
}

export function runMain(
  options: OptionsConfig & Omit<TypedFlatConfigItem, "files">,
): Awaitable<TypedFlatConfigItem[]>[] {
  // const {} = options;
  const localConfigArr: Awaitable<TypedFlatConfigItem[]>[] = [];

  // 1. load base
  localConfigArr.push(...getBaseConfigs(options));

  // 2. get enabled options
  const enabledOptions = getEnabledOptions(options);

  const configModules: ExtensionDependencies = Object.fromEntries(
    Object.entries(allConfigs).map(([key, value]) => [
      key,
      typeof value === "function" ? { config: true, plugins: true } : value,
    ]),
  ) as ExtensionDependencies;

  // 3. load override
  localConfigArr.push(
    ...getEnabledConfigs(options, enabledOptions, configModules),
  );

  console.log("localConfigArr.length: ", localConfigArr.length);

  // 4. fuse config
  return localConfigArr;
}
