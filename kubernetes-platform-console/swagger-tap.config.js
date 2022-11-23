const { CodeGenPlugin } = require('@swagger-tap/core/plugins/CodeGenPlugins')

const swaggerServerMap = {
  dev: 'localhost:3000',
  test: 'kube-test.devops.test.sz.shopee.io',
  live: 'kubernetes.devops.i.sz.shopee.io',
  staging: 'kubernetes.devops.i.staging.sz.shopee.io',
  'plat-test': 'kube-test-plat.devops.test.sz.shopee.io',
  'banking-test': 'opsnonlive-k8s.bke.shopee.io',
  'banking-live': 'ops-k8s.bke.shopee.io'
}

module.exports = {
  input: (env) => `http://${swaggerServerMap[env] || swaggerServerMap.dev}/api/${process.env.NODE_ENV_API_VERSION}/api-json`,
  output: `./src/swagger-api/${process.env.NODE_ENV_API_VERSION}`,
  loader: '@swagger-tap/openapi-3.0-loader',
  watch: false,
  plugins: [new CodeGenPlugin({
    formatName: (name) => `I${name}`
  })]
}
