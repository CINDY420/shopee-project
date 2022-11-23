import { readFileSync } from 'fs'
import yaml from 'js-yaml'
import path from 'path'

const configFolder = path.resolve(process.cwd(), 'configs')
const configFilePath = path.resolve(configFolder, 'config.yaml')
const envFilePath = path.resolve(configFolder, `${process.env.NODE_ENV}.yaml`)

const config: Record<string, unknown> = {}

const loadConfig = (filePathList: string[]) => {
  filePathList
    .map((filePath) => {
      const config = readFileSync(filePath, 'utf-8')
      return yaml.load(config) as Record<string, unknown>
    })
    .forEach((configObject) => {
      Object.entries(configObject).forEach(([key, value]) => {
        config[key] = value
      })
    })
}
loadConfig([configFilePath, envFilePath])

export default () => config
