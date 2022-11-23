import nodeResolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import deleteDist from 'rollup-plugin-delete'
import ttypescript from 'ttypescript'
import copy from 'rollup-plugin-copy'
import svgr from '@svgr/rollup'
import alias from '@rollup/plugin-alias'
import path from 'path'

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    external: ['infrad', 'react', 'react-dom', 'infra-design-icons', 'react-router-dom', 'ahooks'],
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      deleteDist({ targets: 'dist/*' }),
      typescript({ 
        tsconfig: "./tsconfig.json",
        typescript: ttypescript,
      }),
      // For svg import
      nodeResolve(),
      commonjs(),
      alias({
        entries: {
          "@": path.resolve(__dirname, "./src")
        }
      }),
      svgr({ exportType: 'named', jsxRuntime: 'automatic' }),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts(), copy({targets: [{ src: 'README.md', dest: 'dist' }]})],
  }
];
