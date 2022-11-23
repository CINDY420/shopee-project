import * as tsconfigPath from 'tsconfig-paths'
import * as fs from 'fs'
import * as path from 'path'
import * as k8s from '@kubernetes/client-node'

tsconfigPath.register({
  baseUrl: './',
  paths: {}
})

const configFile = fs.readFileSync(path.resolve(__dirname, '../fixtures/clusters/test.yaml'), { encoding: 'utf8' })

const kc = new k8s.KubeConfig()
kc.loadFromString(configFile)

export { kc }
