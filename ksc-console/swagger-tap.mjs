import swaggerTap, { typesPlugin, fetchPlugin } from '@tap/core'
import * as path from 'path'
import { fileURLToPath } from 'url'

const swaggerServerMap = {
  dev: 'localhost:3000',
  test: 'bigcompute.infra.test.shopee.io',
  live: 'bigcompute.infra.shopee.io',
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const options = {
  input: `http://${
    swaggerServerMap[process.env.NODE_ENV] || swaggerServerMap.dev
  }/node-gateway/api/swagger-json`,
  output: path.resolve(dirname, './src/swagger-api'),
  plugins: [typesPlugin, fetchPlugin],
  formatNameFn: (name) => `I${name}`,
  fetchPlugin: {
    fetchPath: `import fetch from 'helpers/fetch'`
  }
}
swaggerTap(options)
