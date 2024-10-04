import type {
  OptionsComponentExts,
  OptionsFiles,
  OptionsOverrides,
  OptionsProjectType,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
  Rules,
  TypedFlatConfigItem,
} from "../types";
import process from "node:process";
import {
  GLOB_ASTRO_TS,
  GLOB_JS,
  GLOB_MARKDOWN,
  GLOB_TS,
  GLOB_TSX,
} from "../globs";
import { interopDefault } from "../utils";
import { restrictedSyntaxJs } from "./javascript";

export async function typescriptNew(
  options: OptionsFiles &
    OptionsComponentExts &
    OptionsOverrides &
    OptionsTypeScriptWithTypes &
    OptionsTypeScriptParserOptions &
    OptionsProjectType = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    componentExts = [],
    // overrides = {},
    overridesTypeAware = {},
    parserOptions = {},
    type = "app",
    tsconfigPath,
  } = options;

  const files = [
    GLOB_TS,
    GLOB_TSX,
    ...componentExts.map((ext) => `**/*.${ext}`),
  ];

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
  const ignoresTypeAware = options.ignoresTypeAware ?? [
    `${GLOB_MARKDOWN}/**`,
    GLOB_ASTRO_TS,
  ];
  const isTypeAware = !!tsconfigPath;

  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import("@typescript-eslint/eslint-plugin")),
    interopDefault(import("@typescript-eslint/parser")),
  ] as const);

  const typeAwareRules: Rules = {
    "ts/await-thenable": "error",
    "ts/no-floating-promises": "error",
    "ts/no-misused-promises": "error",
    "ts/no-unsafe-argument": "error",
    "ts/no-unsafe-assignment": "error",
    "ts/no-unsafe-call": "error",
    "ts/no-unsafe-member-access": "error",
    "ts/no-unsafe-return": "error",
    "ts/strict-boolean-expressions": [
      "error",
      { allowNullableBoolean: true, allowNullableObject: true },
    ],
    "ts/unbound-method": "error",
  };

  // const setupConfig = {
  //   // Install the plugins without globs, so they can be configured separately.
  //   name: "crux/typescript/setup",
  //   plugins: {
  //     ts: pluginTs as any,
  //   },
  // };

  const baseConfig: TypedFlatConfigItem = {
    files,
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        extraFileExtensions: componentExts.map((ext) => `.${ext}`),
        sourceType: "module",
        ...(isTypeAware
          ? {
              project: tsconfigPath,
              tsconfigRootDir: process.cwd(),
            }
          : {}),
        ...parserOptions,
      },
    },
    name: "crux/typescript/base",
    plugins: {
      ts: pluginTs as any,
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        "TSEnumDeclaration[const=true]",
        "TSExportAssignment",
        ...restrictedSyntaxJs,
      ],
      "ts/ban-ts-comment": "off",
      "ts/consistent-type-assertions": [
        "error",
        {
          assertionStyle: "as",
          objectLiteralTypeAssertions: "allow-as-parameter",
        },
      ],
      "ts/consistent-type-imports": [
        "error",
        { disallowTypeAnnotations: false, fixStyle: "inline-type-imports" },
      ],
      "ts/method-signature-style": ["error", "property"],
      "ts/no-empty-object-type": ["error", { allowInterfaces: "always" }],
      "ts/no-explicit-any": "off",
      "ts/no-import-type-side-effects": "error",
      "ts/no-non-null-assertion": "off",
      "ts/no-redeclare": ["error", { builtinGlobals: false }],
      "ts/no-unsafe-function-type": "off",
      "ts/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true,
        },
      ],
      "ts/no-unused-vars": "off",
      "ts/prefer-as-const": "warn",
      "ts/prefer-literal-enum-member": [
        "error",
        { allowBitwiseExpressions: true },
      ],
      ...(type === "lib"
        ? {
            "ts/explicit-function-return-type": [
              "error",
              {
                allowExpressions: true,
                allowHigherOrderFunctions: true,
                allowIIFEs: true,
              },
            ],
          }
        : {}),
    },
  };

  const typeAwareConfig: TypedFlatConfigItem = isTypeAware
    ? {
        files: filesTypeAware,
        ignores: ignoresTypeAware,
        name: "typescript/type-aware",
        rules: {
          ...typeAwareRules,
          ...overridesTypeAware,
        },
      }
    : null;

  const dtsConfig: TypedFlatConfigItem = {
    files: ["**/*.d.ts"],
    name: "typescript/dts-rules",
    rules: {
      "eslint-comments/no-unlimited-disable": "off",
      "import/no-duplicates": "off",
      "no-restricted-syntax": "off",
      "unused-imports/no-unused-vars": "off",
    },
  };

  const cjsConfig: TypedFlatConfigItem = {
    files: [GLOB_JS, "**/*.cjs"],
    name: "typescript/cjs-rules",
    rules: {
      "ts/no-require-imports": "off",
    },
  };

  return [baseConfig, typeAwareConfig, dtsConfig, cjsConfig].filter(Boolean);
}
