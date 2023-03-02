module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  extends: ["airbnb", "airbnb-typescript", "next/core-web-vitals", "prettier"],
};
