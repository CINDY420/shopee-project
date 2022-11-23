module.exports = {
  root: true,
  extends: [
    '@infra-web-kit/eslint-config-infra-typescript',
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  overrides: [
    {
      files: ['*.controller.ts', '*.module.ts', '*.service.ts', '*.interceptor.ts'],
      rules: {
        'class-methods-use-this': 'off'
      }
    },
    {
      files: ['*.entity.ts', '*.dto.ts'],
      rules: {
        '@typescript-eslint/naming-convention': 'off'
      }
    }
  ]
};
