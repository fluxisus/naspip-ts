const eslint = require("@eslint/js")
const parser = require("@typescript-eslint/parser");
const typescriptPlugin = require("@typescript-eslint/eslint-plugin");
const simpleImportSortPlugin = require("eslint-plugin-simple-import-sort");
const sonarjsPlugin = require("eslint-plugin-sonarjs");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");


const plugins = {
  "@typescript-eslint": typescriptPlugin,
  "simple-import-sort": simpleImportSortPlugin,
};

module.exports = [
  eslint.configs.recommended,
  {rules: typescriptPlugin.configs.recommended.rules},
  {rules: typescriptPlugin?.configs["recommended-type-checked"].rules },
  eslintPluginPrettierRecommended,
  sonarjsPlugin.configs.recommended,
  {
    "files": ["test/**/*"],
    "plugins": ["jest"],
    "env": {
      "jest/globals": true
    }
  },
  {
    files: ["**/*.js", "**/*.ts"],
    plugins,
    rules: {
      "no-return-await": "off",
      "@typescript-eslint/return-await": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-implied-eval": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/require-await": "off",
      "sonarjs/no-duplicate-string": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
    languageOptions: {
      parser,
      parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
        createDefaultProgram: false,
      }
    },
    ignores: [
      "eslint.config.js",
      "tsup.config.ts",
      "jest.config.ts",
      "script/**/*",
      "commitlint.config.js",
    ],
  }
];
