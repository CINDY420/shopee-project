import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  globals: {
    'process.env.__SERVER_ENV__': 'dev',
    'process.env.__RELEASE__': 'platform',
    'process.env.__IS_LOCAL__': false,
    'ts-jest': {}
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['node_modules', 'cypress'],
  injectGlobals: true
}
export default config
