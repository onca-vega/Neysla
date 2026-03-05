import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { defineConfig } from "rollup";

const input = "src/index.ts";

// Los tipos se generan con `tsc --project tsconfig.build.json` (ver script build en package.json)
// Rollup solo genera los bundles JS

export default defineConfig([
  // ESM — tree-shakeable, para bundlers modernos
  {
    input,
    output: {
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.rollup.json",
        declaration: false,
        outDir: "dist/esm",
        sourceMap: true,
      }),
    ],
  },
  // CJS — para Node.js require()
  {
    input,
    output: {
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true,
      entryFileNames: "[name].cjs",
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.rollup.json",
        declaration: false,
        outDir: "dist/cjs",
        sourceMap: true,
      }),
    ],
  },
  // IIFE — para CDN / <script src="">
  {
    input,
    output: {
      file: "dist/cdn/neysla.min.js",
      format: "iife",
      name: "Neysla",
      sourcemap: false,
      exports: "named",
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.rollup.json",
        declaration: false,
        outDir: "dist/cdn",
        sourceMap: false,
      }),
      terser(),
    ],
  },
]);
