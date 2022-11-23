module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'UI', 'refactor', 'perf', 'test', 'build', 'chore', 'release']
    ]
  }
}
