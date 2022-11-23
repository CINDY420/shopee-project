import type { ConfigObject } from '@nestjs/config/dist/types/config-object.type'

const configUpdateCallbacks: ((newestConfig: ConfigObject) => void)[] = []
const config: {
  global?: ConfigObject
} & ConfigObject = {
  global: undefined,
}

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
