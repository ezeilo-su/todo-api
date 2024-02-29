import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./__tests__/setup.ts'],
  testPathIgnorePatterns: [
    '/node_modules/', // Ignore files in node_modules directory
    '/__tests__/setup' // Ignore setup files within __tests__ directory
  ]
};

export default config;
