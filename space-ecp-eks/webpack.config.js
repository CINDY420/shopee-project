/* eslint-disable */
const builder = require('@space/builder')
const config = require('./config')

const proxyConfig = {
  endpoint: {
    live: 'https://space.shopee.io',
    dev: 'https://space.test.shopee.io',
    mock: 'https://space.test.shopee.io',
    local: 'https://space.test.shopee.io',
  },
  rules: [
    // Your own project's proxies here.
    // {
    //   path: '/apis/'
    // },
    // Proxy for common services APIs
    {
      path: '/api/object_types/',
      pathRewrite: {
        '^/api/': '/v1/',
      },
    },
    {
      path: '/api/',
      pathRewrite: {
        '^/api/': '/v1/',
      },
    },
    {
      path: '/v1/',
    },
    {
      path: '/apis/',
    },
  ],
}

module.exports = builder(
  () => {
    return {
      microspace: {
        ...config,
      },
      standalone: true,
      baseWebpackConfig: {
        experiments: {
          topLevelAwait: true,
        },
      },
    }
  },
  {
    proxyConfig,
    useRoutergen: false,
  },
)
