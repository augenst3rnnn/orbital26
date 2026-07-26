import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",

    include: ["**/UnitTests/**/*.test.{js,jsx}"],

    exclude: ["tests/IntegrationTests/**", "node_modules/**"],

    /*transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },*/
  },
});
