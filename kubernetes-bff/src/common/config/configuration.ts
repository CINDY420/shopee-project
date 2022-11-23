import { readFileSync, watchFile, unwatchFile } from 'fs'
import * as yaml from 'js-yaml'
import { join } from 'path'
import { IGlobalConfig, ISkeBffConfig } from 'common/interfaces'

const ENVIRONMENT_SPECIFIC_CONFIG_FILENAME = `${process.env.NODE_ENV}.yaml`
const GLOBAL_CONFIG_FILENAME = 'config.yaml'
const BFF_CONFIG_FILENAME = 'ske-bff-config.yaml'

const environmentConfigPath = join(process.cwd(), 'config', ENVIRONMENT_SPECIFIC_CONFIG_FILENAME)
const globalConfigPath =
  process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'ci'
    ? join(process.cwd(), 'config', GLOBAL_CONFIG_FILENAME)
    : join('/etc/ske-gateway-global/', GLOBAL_CONFIG_FILENAME)

const bffConfigPath =
  process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'ci'
    ? join(process.cwd(), 'config', BFF_CONFIG_FILENAME)
    : join('/etc/ske-bff-config/', BFF_CONFIG_FILENAME)

const config: { global: IGlobalConfig; skeBffConfig: ISkeBffConfig } = { global: undefined, skeBffConfig: undefined }
loadConfig()
const callbacks = []

const onConfigChange = () => {
  loadConfig()
  callbacks.forEach((callback) => callback(config))
}
unwatchFile(environmentConfigPath)
unwatchFile(globalConfigPath)
unwatchFile(bffConfigPath)
watchFile(environmentConfigPath, onConfigChange)
watchFile(globalConfigPath, onConfigChange)
watchFile(bffConfigPath, onConfigChange)

function loadConfig() {
  const globalConfig = yaml.load(readFileSync(globalConfigPath, 'utf-8'))
  if (!config.global) {
    config.global = globalConfig
  } else {
    updateObject(config.global, globalConfig)
  }
  // bbff config
  const skeBffConfig = yaml.load(readFileSync(bffConfigPath, 'utf-8'))
  if (!config.skeBffConfig) {
    config.skeBffConfig = skeBffConfig
  } else {
    updateObject(config.skeBffConfig, skeBffConfig)
  }

  const environmentConfig = yaml.load(readFileSync(environmentConfigPath, 'utf8'))
  updateObject(config, environmentConfig)
}

function updateObject(target, newObject) {
  if (!target || !newObject) return
  if (Array.isArray(target) && Array.isArray(newObject)) {
    target.splice(0, target.length)
    target.push(...newObject)
    return
  }
  if (typeof target === 'object') {
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(newObject, key)) {
        if (
          (typeof target[key] === 'boolean' && typeof newObject[key] === 'boolean') ||
          (typeof target[key] === 'number' && typeof newObject[key] === 'number') ||
          (typeof target[key] === 'string' && typeof newObject[key] === 'string')
        ) {
          target[key] = newObject[key]
        } else if (typeof target[key] === 'object') {
          updateObject(target[key], newObject[key])
        }
      }
    }
    for (const key in newObject) {
      if (!Object.prototype.hasOwnProperty.call(target, key)) {
        target[key] = newObject[key]
      }
    }
  }
}

/**
 * get config, option to be notified when the configuration is updated
 * @param onConfigUpdate Function, will be invoked when the configuration files changes
 * @returns
 */
export default (onConfigUpdate?: (newestConfig) => void) => {
  if (onConfigUpdate && callbacks.indexOf(onConfigUpdate) === -1) {
    callbacks.push(onConfigUpdate)
  }
  return config
}

/**
 * remove update listener
 * @param onConfigUpdate Function
 */
export function removeUpdateListener(onConfigUpdate: (newestConfig) => void) {
  const index = callbacks.indexOf(onConfigUpdate)
  if (index >= 0) {
    callbacks.splice(index, 1)
  }
}
