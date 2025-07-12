import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    }
  },
  ...tseslint.configs.recommended,
  {
    ...pluginReactConfig,
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    rules: {
      ...pluginReactConfig.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/no-unknown-property": ["error", { ignore: ["attach", "args", "intensity", "position"] }], // Allow R3F specific props
      // You might need to add other rules or configurations here
      // For example, if you are using React Hooks plugin:
      // "eslint-plugin-react-hooks/rules-of-hooks": "error",
      // "eslint-plugin-react-hooks/exhaustive-deps": "warn"
    }
  }
];
