module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'node'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/lib/', '<rootDir>/example/'],
  transformIgnorePatterns: ['/node_modules/', '<rootDir>/lib/', '<rootDir>/example/'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
