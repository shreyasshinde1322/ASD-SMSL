export default [
  {
    ignores: ["node_modules/", "coverage/"]
  },
  {
    files: ["**/*.js"],
    rules: {
      "no-debugger": "error",
      "no-unreachable": "error",
      "no-constant-condition": "error"
    }
  }
];
