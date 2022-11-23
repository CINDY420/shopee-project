import { watchFile, unwatchFile, readFileSync } from 'fs'
import { join } from 'path'

import yaml, { YAMLException } from 'js-yaml'
import type { ConfigObject } from '@nestjs/config/dist/types/config-object.type'

import { Logger } from '@/common/utils/logger'
import { K8S_CONFIG_MAP_PATH } from '@/common/constants/k8s'

const logger = new Logger()

const isProduction = !(process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'ci')
const localConfigFolderPath = join(process.cwd(), 'src', 'configs')
const globalConfigFolderPath = isProduction ? K8S_CONFIG_MAP_PATH.FOLDER_OF_GLOBAL_CONFIG_YAML : localConfigFolderPath
const globalConfigV3FolderPath = isProduction
  ? K8S_CONFIG_MAP_PATH.FOLDER_OF_GLOBAL_CONFIG_V3_YAML
  : localConfigFolderPath
const envConfigFolderPath = isProduction ? K8S_CONFIG_MAP_PATH.FOLDER_OF_ENV_CONFIG_YAML : localConfigFolderPath

const GLOBAL_CONFIG_FILENAME = 'config.yaml'
const LOCAL_GLOBAL_CONFIG_V3_FILENAME = 'config.v3.yaml'
const ENVIRONMENT_SPECIFIC_CONFIG_FILENAME = `${process.env.NODE_ENV}.yaml`

const globalConfigFilePath = join(globalConfigFolderPath, GLOBAL_CONFIG_FILENAME)
/**
 * v1指ske-kubernetes-node-gateway-config这个configmap下面的config.yaml
 * 此configmap将会挂载到/etc/global-config目录
 *
 * v3指ske-gateway-global-config这个configmap下面的config.yaml
 * 此configmap将会挂载到/etc/global-config-v3目录
 *
 * 但是在本地，最好配置文件都在同个目录，但是同个目录不能有两个config.yaml，所以本地v3的这个叫config.v3.yaml
 */
const globalConfigV3FilePath = isProduction
  ? join(globalConfigV3FolderPath, GLOBAL_CONFIG_FILENAME)
  : join(globalConfigV3FolderPath, LOCAL_GLOBAL_CONFIG_V3_FILENAME)
const environmentConfigFilePath = join(envConfigFolderPath, ENVIRONMENT_SPECIFIC_CONFIG_FILENAME)

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
    const globalConfigFile = readFileSync(globalConfigFilePath, 'utf-8')
    const globalConfig = yaml.load(globalConfigFile) as ConfigObject

    const globalConfigV3File = readFileSync(globalConfigV3FilePath, 'utf-8')
    const globalConfigV3 = yaml.load(globalConfigV3File) as ConfigObject

    if (!config.global) {
      config.global = globalConfig
    } else {
      deepMerge(config.global, globalConfig)
    }

    if (!config.globalV3) {
      /**
       * 为了防止v1 v3两个configmap的config.yaml不一致导致冲突，将global和globalV3分开
       */
      config.globalV3 = globalConfigV3
    } else {
      deepMerge(config.globalV3, globalConfigV3)
    }

    const environmentConfigFile = readFileSync(environmentConfigFilePath, 'utf-8')
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

unwatchFile(environmentConfigFilePath)
unwatchFile(globalConfigFilePath)
unwatchFile(globalConfigV3FilePath)

watchFile(environmentConfigFilePath, onConfigFileChange)
watchFile(globalConfigFilePath, onConfigFileChange)
watchFile(globalConfigV3FilePath, onConfigFileChange)

process.on('exit', () => {
  unwatchFile(environmentConfigFilePath)
  unwatchFile(globalConfigFilePath)
  unwatchFile(globalConfigV3FilePath)
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
