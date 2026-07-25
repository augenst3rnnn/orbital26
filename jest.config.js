module.exports = {
  preset: "jest-expo",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  testMatch: [
    "<rootDir>/tests/IntegrationTests/**/*.test.js",
    "<rootDir>/tests/IntegrationTests/**/*.test.jsx",
  ],

  clearMocks: true,
};
