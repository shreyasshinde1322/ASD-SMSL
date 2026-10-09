export default [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      "no-debugger": "error",
      "no-unreachable": "error",
      "no-constant-condition": "error"
    }
  }
];
