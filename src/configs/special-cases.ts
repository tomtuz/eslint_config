import type { TypedFlatConfigItem } from "../types";
import { GLOB_MARKDOWN, GLOB_SRC, GLOB_SRC_EXT } from "../globs";
import { pluginImport } from "../plugins";

export async function specialCases(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: ["**/scripts/*", "**/cli.*"],
      name: "crux/special/cli",
      rules: {
        "no-console": "off",
      },
    },
    {
      files: [`**/*.{test,spec}.${GLOB_SRC_EXT}`],
      name: "crux/special/tests",
      rules: {
        "no-unused-expressions": "off",
        "unicorn/consistent-function-scoping": "off",
      },
    },
    {
      files: [
        `**/*config*.${GLOB_SRC_EXT}`,
        `**/{views,pages,routes,middleware,plugins,api,modules}/${GLOB_SRC}`,
        `**/{index,vite,esbuild,rollup,rolldown,webpack,rspack}.${GLOB_SRC_EXT}`,
        "**/*.d.ts",
        `${GLOB_MARKDOWN}/**`,
        "**/.prettierrc*",
      ],
      name: "crux/special/allow-default-export",
      plugins: {
        import: pluginImport as any,
      },
      rules: {
        "import/no-default-export": "off",
      },
    },
  ];
}
