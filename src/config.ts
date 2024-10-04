import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";
import type { ExtensionDependencies } from "./mapConfigs";
import { extensionControlDefaults } from "./mapConfigs";
import { isInEditorEnv } from "./utils";

// -- PRESETS --
export interface ExtensionPresets {
  presetAll: boolean;
  presetBasic: boolean;
  presetLangsExtensions: boolean;
  presetJsonc: boolean;
  presetJavaScript: boolean;
}

export const defaultPresets: ExtensionPresets = {
  presetAll: false,
  presetBasic: false,
  presetJavaScript: false,
  presetJsonc: false,
  presetLangsExtensions: false,
};

export interface ExtensionSettings {
  [Key: string]: any;
}

// GLOBAL and single source of configuration control
export let currentFlags: ExtensionDependencies = {
  ...extensionControlDefaults,
};

export function setExtFlags(
  flags: Partial<ExtensionDependencies>,
): ExtensionDependencies {
  currentFlags = { ...extensionControlDefaults, ...flags };
  return currentFlags;
}

export function getExtFlags(): ExtensionDependencies {
  return currentFlags;
}

export const configurationSettings = {};

export interface PackageSettings {
  filePath: string;
  flags: Partial<ExtensionDependencies>;
  lintPresets: Partial<ExtensionPresets>;
  files?: string[];
  isInEditor?: boolean;
  autoRenamePlugins: boolean;
  componentExts: string[];
  gitignore?: boolean | FlatGitignoreOptions;
}

export const getPackageSettings = (
  settings: PackageSettings,
): PackageSettings => {
  const { filePath, flags } = settings;

  return {
    autoRenamePlugins: false,
    componentExts: [],
    filePath: filePath || "src/typegen.ts",
    files: [],
    flags: flags ? setExtFlags(flags) : getExtFlags(), // default
    gitignore: true,
    isInEditor: isInEditorEnv(),
    lintPresets: defaultPresets,
  };
};

export const ignores = {
  ignores: ["fixtures", "_fixtures"],
};
