import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import storybook from "eslint-plugin-storybook";
import reactCompiler from "eslint-plugin-react-compiler";
import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";
import drizzle from "eslint-plugin-drizzle";
import importPlugin from "eslint-plugin-import";
import js from "@eslint/js";

const eslintConfig = defineConfig([
  // 先頭のconfigオブジェクトでignoresのみを指定することでglobal ignoreになる
  {
    ignores: [
      "node_modules/",
      ".next/",
      "public/",
      ".storybook/",
      "playwright-report/",
      "next-env.d.ts",
    ],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  reactCompiler.configs.recommended,
  ...storybook.configs["flat/recommended"],
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        document: "readonly",
        Image: "readonly",
        React: "readonly",
      },
    },
    plugins: {
      "prefer-arrow-functions": preferArrowFunctions,
      import: importPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern:
                "{react,react-dom/**,react-router-dom,next,next/**,hono,hono/**,@hono/**}",
              group: "builtin",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
          },
          "newlines-between": "always",
        },
      ],
      "max-lines": [
        "error",
        { max: 500, skipBlankLines: false, skipComments: false },
      ],
      "no-restricted-globals": [
        "error",
        {
          // `process.env`の利用を`env.ts`以外で禁止
          name: "process",
          message:
            "`process.env`の利用は禁止されています。代わりに`#/clients/env`から環境変数をインポートしてください。",
        },
      ],
    },
  },
  {
    name: "env.ts exception",
    files: ["src/clients/env.ts"],
    rules: {
      // `env.ts`ファイルでは`process.env`の利用を許可
      "no-restricted-globals": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      drizzle,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/no-unsafe-type-assertion": "error",
      "drizzle/enforce-delete-with-where": [
        "error",
        {
          drizzleObjectName: ["db"],
        },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        {
          drizzleObjectName: ["db"],
        },
      ],
    },
  },
  {
    name: "Next.js App Router",
    files: [
      "src/app/**/page.tsx",
      "src/app/**/layout.tsx",
      "src/app/**/loading.tsx",
      "src/app/**/error.tsx",
      "src/app/**/not-found.tsx",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          // ファイル先頭のディレクティブ（'use client'）を検出
          selector: "Program > ExpressionStatement[directive='use client']",
          message:
            "App Router の page.tsx や layout.tsx では 'use client' を使用しないでください。",
        },
      ],
    },
  },
]);

export default eslintConfig;
