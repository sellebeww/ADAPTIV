import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    globalSetup: ['./src/test/global-setup.ts'],
  },
});
