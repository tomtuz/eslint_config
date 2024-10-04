import type {
  OptionsFiles,
  OptionsOverrides,
  TypedFlatConfigItem,
} from "../types";
import { configPrettier } from "../plugins";

import { interopDefault } from "../utils";

const prettierConflictRules = { ...configPrettier.rules };
delete prettierConflictRules["vue/html-self-closing"];

export async function prettier(
  options: OptionsFiles & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

  const [pluginPrettier, prettierConflictRules] = await Promise.all([
    interopDefault(import("eslint-plugin-prettier")),
    interopDefault(import("eslint-config-prettier")),
  ] as const);

  return [
    {
      name: "crux/prettier",
      plugins: {
        prettier: pluginPrettier,
      },
      rules: {
        ...prettierConflictRules,
        ...pluginPrettier.configs.recommended,
        "prettier/prettier": "warn",

        ...overrides,
      },
    },
  ];
}
