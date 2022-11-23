import { watchFile, unwatchFile, readFileSync } from 'fs'
import { join } from 'path'

import yaml, { YAMLException } from 'js-yaml'
import type { ConfigObject } from '@nestjs/config/dist/types/config-object.type'

import { Logger } from '@/common/utils/logger'
import { CELL_CONFIG_MAP_PATH } from '@/common/constants/cell'

const isProduction = !(process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'ci')
const rootConfigPath = isProduction
  ? CELL_CONFIG_MAP_PATH.FOLDER_OF_GLOBAL_CONFIG_YAML
  : join(process.cwd(), 'src', 'configs')
const envConfigPath = isProduction
  ? CELL_CONFIG_MAP_PATH.FOLDER_OF_ENV_CONFIG_YAML
  : join(process.cwd(), 'src', 'configs')
const GLOBAL_CONFIG_FILENAME = 'config.yaml'
const ENVIRONMENT_SPECIFIC_CONFIG_FILENAME = `${process.env.NODE_ENV}.yaml`
const globalConfigPath = join(rootConfigPath, GLOBAL_CONFIG_FILENAME)
const environmentConfigPath = join(envConfigPath, ENVIRONMENT_SPECIFIC_CONFIG_FILENAME)
const logger = new Logger()

const configUpdateCallbacks: ((newestConfig: ConfigObject) => void)[] = []
const config: {
  global?: ConfigObject
} & ConfigObject = {
  global: undefined,
}

function isPrimitive(value: unknown) {
  if (typeof value === 'object') {
    return value === null
  }
  return typeof value !== 'function'
}
function isSameTypePrimitives(...values: unknown[]) {
  const typeOfFirst = typeof values[0]
  return values.every((value) => isPrimitive(value) && typeof value === typeOfFirst)
}
function deepMerge(oldValue: ConfigObject, newValue: ConfigObject) {
  if (!oldValue || !newValue) {
    return
  }
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    oldValue.splice(0, oldValue.length)
    oldValue.push(...newValue)
    return
  }
  for (const key in oldValue) {
    if (Object.prototype.hasOwnProperty.call(newValue, key)) {
      if (isSameTypePrimitives(oldValue[key], newValue[key])) {
        oldValue[key] = newValue[key]
      } else if (typeof oldValue[key] === 'object') {
        deepMerge(oldValue[key], newValue[key])
      }
    }
  }
  for (const key in newValue) {
    if (!Object.prototype.hasOwnProperty.call(oldValue, key)) {
      oldValue[key] = newValue[key]
    }
  }
}

function loadConfigFromFile() {
  try {
    const globalConfigFile = readFileSync(globalConfigPath, 'utf-8')
    const globalConfig = yaml.load(globalConfigFile) as ConfigObject

    if (!config.global) {
      config.global = globalConfig
    } else {
      deepMerge(config.global, globalConfig)
    }

    const environmentConfigFile = readFileSync(environmentConfigPath, 'utf-8')
    const environmentConfig = yaml.load(environmentConfigFile) as ConfigObject
    deepMerge(config, environmentConfig)
    logger.log(`yaml config loaded => ${JSON.stringify(config)}`)
  } catch (e) {
    // yaml
    if (e instanceof YAMLException) {
      logger.error(`yaml parse error: \n${e.stack}`)
      return
    }
    // file not exist
    if (e instanceof Error) {
      logger.error(e.message)
    }
  }
}

loadConfigFromFile()
const onConfigFileChange = () => {
  loadConfigFromFile()
  configUpdateCallbacks.forEach((callback) => callback(config))
}

unwatchFile(environmentConfigPath)
unwatchFile(globalConfigPath)
watchFile(environmentConfigPath, onConfigFileChange)
watchFile(globalConfigPath, onConfigFileChange)

process.on('exit', () => {
  unwatchFile(environmentConfigPath)
  unwatchFile(globalConfigPath)
})

/**
 * get config
 * @param onConfigUpdate Function, will be invoked when the configuration files changes
 * @returns
 */
export default function loadConfig(onConfigUpdate?: (newestConfig: ConfigObject) => void) {
  if (onConfigUpdate && configUpdateCallbacks.indexOf(onConfigUpdate) === -1) {
    configUpdateCallbacks.push(onConfigUpdate)
  }
  return config
}
