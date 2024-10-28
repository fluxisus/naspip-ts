module.exports = {
  transform: {
    "^.+\\.ts$": ["ts-jest", {}],
  },
  testEnvironment: "node",
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/**/*.d.ts"],
  coverageReporters: ["text", "text-summary"],
  silent: false,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  passWithNoTests: true,
};
