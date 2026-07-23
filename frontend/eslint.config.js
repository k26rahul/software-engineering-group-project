import js from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  { ignores: ["dist", "public/mockServiceWorker.js", "src/components/ui"] },
  {
    files: ["**/*.{js,jsx}"],
    ...js.configs.recommended,
  },
  {
    files: ["**/*.{js,jsx}"],
    ...eslintReact.configs.recommended,
  },
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
];
