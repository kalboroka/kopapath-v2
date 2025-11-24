// eslint.config.js
import globals from 'globals';
import js from "@eslint/js";
import inferno from "eslint-plugin-inferno";

export default [
  js.configs.recommended,   // base ESLint rules
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      inferno
    },
    rules: {
      ...inferno.configs.recommended.rules,
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off"
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [
            ["@", "./src"],
            ["@components", "./src/components"],
            ["@layouts", "./src/layouts"],
            ["@pages", "./src/pages"],
            ["@utils", "./src/utils"],
            ["@styles", "./src/styles"],
            ["@assets", "./src/assets"]
          ],
          extensions: [".js", ".jsx", ".json"]
        }
      }
    }
  }
];