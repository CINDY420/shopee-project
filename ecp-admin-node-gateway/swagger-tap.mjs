import core, {
  dtosPlugin,  // bff dtos
  servicePlugin // bff openapi
} from '@tap/core'
import * as path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serviceOptions = [
  {
    input: 'http://eks-dev.shopee.io/swagger/doc.json',
    serviceName: 'eks-apis'
  },
  {
    input: 'https://shopee.git-pages.garena.com/sz-devops/kubernetes/ecpapis/ecpapis.swagger.json',
    serviceName: 'ecp-apis'
  },
  {
    input: 'https://shopee.git-pages.garena.com/sz-devops/kubernetes/ecpapis/adminapis.swagger.json',
    serviceName: 'ecp-admin-apis'
  }
]
const swaggerTap = core.default

const selectedService = process.env.serviceName
const selectedUpdatingService = selectedService ? serviceOptions.filter(({ serviceName }) => serviceName === selectedService) : serviceOptions

const swaggerTapOptions = selectedUpdatingService.map(({ input, serviceName }) => ({
  input,
  output: path.resolve(dirname, './src/backend-services', serviceName),
  plugins: [dtosPlugin, servicePlugin],
  formatNameFn: (name) => `I${name}`,
}))

swaggerTapOptions.forEach((option) => swaggerTap(option))
