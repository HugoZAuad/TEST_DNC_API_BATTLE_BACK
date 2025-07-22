module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testMatch: [
    '**/services/**/*.spec.ts',
    '**/controllers/**/*.spec.ts'
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'modules/**/services/**/*.(t|j)s',
    'modules/**/controllers/**/*.(t|j)s'
  ],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: {
      branches: 97,
      functions: 97,
      lines: 97,
      statements: 97,
    },
  },
};
