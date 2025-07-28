// eslint.config.js
import tseslint from "typescript-eslint";
import js from "@eslint/js";
import globals from "globals";
import path from "path";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.node,
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: path.resolve("./tsconfig.json"),
        },
      },
    },
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "n/no-missing-import": "off", // if using 'eslint-plugin-n'
    },
  },
];
