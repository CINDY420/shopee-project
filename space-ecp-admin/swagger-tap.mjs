import {
  swaggerTap, 
  typesPlugin, 
  fetchPlugin
} from '@tap/core'

import * as path from 'path'
import { fileURLToPath } from 'url'

const swaggerServerMap = {
  dev: 'localhost:3000',
  test: 'kube-dev.devops.dev.sz.shopee.io',
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const options = {
  input: `http://${ swaggerServerMap[process.env.NODE_ENV] || swaggerServerMap.dev}/ecpadmin/swagger-json`,
  output: path.resolve(dirname, './src/swagger-api'),
  plugins: [typesPlugin, fetchPlugin],
  formatNameFn: (name) => `I${name}`,
  fetchPlugin: {
    fetchPath: `import { HTTPFetch as fetch } from 'src/helpers/fetch'`,
    showFetchSecondArgument: true
  }
}

swaggerTap(options)