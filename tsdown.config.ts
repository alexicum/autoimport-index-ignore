import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: './dist',
  platform: 'neutral',
  fixedExtension: true,
  // Transpile-only build.
  unbundle: true,
  deps: {
    neverBundle: 'react',
  },
  checks: { circularDependency: true },
})
