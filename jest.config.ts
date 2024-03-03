import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./__tests__/setup.ts'],
  testRegex: '/__tests__/(.*\\.(test|spec)\\.ts$)'
};

export default config;
