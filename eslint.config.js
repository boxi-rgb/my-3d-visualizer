import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


export default [
  { 
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], 
    ignores: ["dist/**/*", "node_modules/**/*", "build/**/*"] 
  },
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
      "react/no-unknown-property": ["error", { 
        ignore: [
          // R3F common props
          "attach", "args", "intensity", "position",
          "position-x", "position-y", "position-z", 
          "rotation", "rotation-x", "rotation-y", "rotation-z", 
          "scale", "scale-x", "scale-y", "scale-z",
          "visible", "castShadow", "receiveShadow",
          // Material props
          "vertexShader", "fragmentShader", "uniforms", "transparent", 
          "depthWrite", "blending", "toneMapped", "sizeAttenuation", "side",
          // Buffer geometry props
          "count", "array", "itemSize",
          // Three.js object props
          "geometry", "material", "dispose", "clone", "userData", "map"
        ] 
      }], // Allow R3F specific props
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }], // Allow unused vars prefixed with _
    }
  }
];
