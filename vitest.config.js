

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/tests/UnitTests/**/*.test.js'],
    globals: true,
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest'
    }
  }
});