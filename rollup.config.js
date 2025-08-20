import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import replace from "@rollup/plugin-replace";

export default [
  // CJS and ESM builds
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      replace({
        preventAssignment: true,
        delimiters: ["", ""],
        values: {
          "process.env.NODE_ENV": '"production"',
          "process.env": "{}",
          "use client": "",
          '"use client"': "",
          "'use client'": "",
        },
      }),
      resolve({
        preferBuiltins: false,
      }),
      commonjs({
        ignoreDynamicRequires: true,
      }),
      typescript({
        tsconfig: "./tsconfig.build.json",
        jsx: "react-jsx",
        declaration: true,
        declarationDir: "./dist",
        sourceMap: true,
        inlineSources: true,
      }),
    ],
    external: ["react", "react-dom"],
  },
  // UMD build with bundled JSX runtime
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: "ConversationalFormWidget",
      sourcemap: true,
      exports: "named",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
      },
    },
    plugins: [
      peerDepsExternal(),
      replace({
        preventAssignment: true,
        delimiters: ["", ""],
        values: {
          "process.env.NODE_ENV": '"production"',
          "process.env": "{}",
          "use client": "",
          '"use client"': "",
          "'use client'": "",
        },
      }),
      resolve({
        preferBuiltins: false,
      }),
      commonjs({
        ignoreDynamicRequires: true,
      }),
      typescript({
        tsconfig: "./tsconfig.build.json",
        jsx: "react-jsx",
        declaration: false,
        sourceMap: true,
        inlineSources: true,
      }),
    ],
    external: (id) => {
      // For UMD build, bundle react/jsx-runtime
      if (id === "react/jsx-runtime") {
        return false;
      }
      return ["react", "react-dom"].includes(id);
    },
  },
];
