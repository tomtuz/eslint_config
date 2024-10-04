import type {
  Awaitable,
  TypedFlatConfigItem,
} from "./types";
import { comments } from "./configs/comments";
import { ignores } from "./configs/ignores";
import { imports } from "./configs/imports";
import { javascript } from "./configs/javascript";
import { jsdoc } from "./configs/jsdoc";
import { jsonc } from "./configs/jsonc";
import { markdown } from "./configs/markdown";
import { node } from "./configs/node";
import { prettier } from "./configs/prettier";
import { regexp } from "./configs/regexp";
import { sortImports, sortPackageJson, sortTSConfig } from "./configs/sort";
import { typescript } from "./configs/typescript";
import { unicorn } from "./configs/unicorn";
import { vue } from "./configs/vue";

import { yaml } from "./configs/yaml";

/** Ignore common files and include javascript support */
const presetJavaScript: readonly Awaitable<TypedFlatConfigItem[]>[] = [
  ignores(),
  javascript(),
  comments(),
  imports(),
  unicorn(),
  node(),
  jsdoc(),
  regexp(),
] as const;

/** Includes basic json(c) file support and sorting json keys */
const presetJsonc: readonly Awaitable<TypedFlatConfigItem[]>[] = [
  jsonc(),
  sortPackageJson(),
  sortTSConfig(),
] as const;

/** Includes markdown, yaml + `presetJsonc` support */
const presetLangsExtensions: Awaitable<TypedFlatConfigItem[]>[] = [
  markdown(),
  yaml(),
  ...presetJsonc,
] as const;

/** Includes `presetJavaScript` and typescript support */
const presetBasic: readonly Awaitable<TypedFlatConfigItem[]>[] = [
  ...presetJavaScript,
  typescript(),
  sortImports(),
] as const;

/**
 * Includes
 * - `presetBasic` (JS+TS) support
 * - `presetLangsExtensions` (markdown, yaml, jsonc) support
 * - Vue support
 * - Prettier support
 */
const presetAll: readonly Awaitable<TypedFlatConfigItem[]>[] = [
  ...presetBasic,
  ...presetLangsExtensions,
  vue(),
  prettier(),
];

export interface PresetItem {
  readonly [Key: string]: readonly Awaitable<TypedFlatConfigItem[]>[];
}

export {
  presetAll,
  presetBasic,
  presetJavaScript,
  presetJsonc,
  presetLangsExtensions,
};

// Export a const object with all presets for easier access
export const presets = {
  all: presetAll,
  basic: presetBasic,
  javascript: presetJavaScript,
  jsonc: presetJsonc,
  langsExtensions: presetLangsExtensions,
} as const;
