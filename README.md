# @crux/eslint-config

#### Building

- `unbuild@rc` or `tsup`
- Package type: `ESM`
- Target: `ESNext`

#### Debugging

- Disable barrel file generation:
  - remove settings in in settings.json
  - disable extension, id: `@installed exportall`

#### Info

1. typegen.ts -> generate dts for plugins
2. run.ts -> generate flat config from multiple configs and user overrides
3. index.ts -> build from entry-point

Almost everything is disabled by default

```
1. pnpm run build
2. change config in './eslint-inspector.config.ts'
3. pnpm run dev
```
