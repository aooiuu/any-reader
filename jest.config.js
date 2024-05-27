/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',

  projects: [
    {
      displayName: 'core',
      roots: ['<rootDir>/packages/core'],
      transform: {
        '.+\\.(j|t)sx?$': 'ts-jest',
      },
      globals: {
        'ts-jest': {
          tsconfig: '<rootDir>/packages/core/tsconfig.json',
        },
      },
    },
  ],
}
