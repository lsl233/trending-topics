import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts', 'test/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', 'src/static'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/static/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/types/',
      ],
    },
  },
})
