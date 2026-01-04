import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import localRules from "./eslint-rules/index.js";

export default tseslint.config([
  globalIgnores(["dist", "dev-dist", "src/common/components/RichEditor/**"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    plugins: {
      local: localRules,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "react-refresh/only-export-components": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "local/no-hardcoded-ui-text": "off",
    },
  },
  // i18n adoption guardrail (incremental): detect hardcoded UI copy in JSX for high-signal surfaces first.
  {
    files: ["src/landing/**/*.{ts,tsx}", "src/common/features/auth/**/*.{ts,tsx}"],
    rules: {
      "local/no-hardcoded-ui-text": "warn",
    },
  },
]);
