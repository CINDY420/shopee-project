import { Location } from 'history'
import { generatePath } from 'react-router-dom'
import { matchPath } from 'react-router'
import { MonitoringPlatformUrl, LOG_PLATFORM_ENV_URL_MAP } from 'constants/routes/external'

import history from 'helpers/history'
import { stringify } from 'query-string'
import { parseClusterIdWithFte } from 'helpers/cluster'

export const getMatchResourceHandler = (handler: (matches: any, path: string, location: Location) => void) => ({
  handler
})

const LIVE_ENVS = ['live', 'liveish']

interface INameObject {
  name: string
}

interface IGenerateLogPlatformLink {
  clusterId?: string
  env?: string
  cid?: string
  projectName: string
  appName: string
  nodeIP?: string
  podIP?: string
}
interface IGenerateTracingLink {
  tracingUrl: string
  traceId: string
}
interface IGenerateMonitoringPlatformLink {
  tenantName: string
  env: string
  cid: string
  projectName: string
  appName: string
  monitoringClusterName: string
  clusterName: string
}
/**
 * Get pod container route (for the sake of backend hardcode shit)
 */
export const getPodContainerRoute = (
  tenantId: number,
  project: INameObject,
  application: INameObject,
  pod: INameObject,
  containerName: string
) =>
  `tenants/${tenantId}/projects/${project.name}/apps/${application.name}/pods/${pod.name}/containers/${containerName}`

interface IOptions {
  replace?: boolean
  state?: any
}

/**
 * change route
 * @param pattern string  A pattern provided as a path attribute to the Route component.
 * @param params object  Object with corresponding params for the pattern to use. If provided params and path don’t match, an error will be thrown.
 * @param options object  Object containing replace and state.
 */
export const changeRouteWithParams = (
  pattern: string,
  params: { [paramName: string]: string | number | boolean | undefined } = {},
  options: IOptions = {}
) => {
  const { replace = false, state } = options
  const targetPath = generatePath(pattern, params)
  if (replace) {
    history.replace(targetPath, state)
  } else {
    history.push(targetPath, state)
  }
}

/**
 * destruct object from source with route
 * @param source source
 * @param path path
 * @example source: a/1/b/2 , path: a/:aName/b/:bName => {a:1, b:2}
 */
export const destructFromRoute = (source: string, path: string) => {
  const match = matchPath(source, {
    path,
    exact: true,
    strict: false
  })
  const { params }: any = match
  return params
}

/**
 * check if route match path
 * @param route route to match
 * @param path path
 * @returns [match, isExact]
 */
export const checkIfRouteMatchPath = (route: string, path: string): [boolean, boolean] => {
  const match = matchPath(path, { path: route })
  if (match == null) {
    return [false, false]
  }
  return [true, match.isExact]
}

export const generateLogPlatformLink = ({
  clusterId,
  env: passedEnv,
  cid: passedCid,
  projectName,
  appName,
  nodeIP
}: IGenerateLogPlatformLink): string => {
  let env = passedEnv
  let cid = passedCid
  if (clusterId) {
    const { env: parsedEnv, cid: parsedCid } = parseClusterIdWithFte(clusterId)
    env = parsedEnv
    cid = parsedCid
  }

  const lowerCaseEnv = env.toLowerCase()
  const lowerCaseCid = cid.toLowerCase()

  const applicationItems = appName.split('-')
  const logModule = applicationItems.length > 1 ? applicationItems.slice(1).join('-') : undefined

  const logQs = stringify({
    payload: JSON.stringify({
      project: projectName,
      module: logModule,
      env: lowerCaseEnv,
      cid: lowerCaseCid,
      platform: 'PLATFORM_K8S_SZ',
      keyword: nodeIP && `@ip:"${nodeIP}"`
    })
  })
  let logPlatformUrl = LOG_PLATFORM_ENV_URL_MAP[__SERVER_ENV__]
  if (__SERVER_ENV__ === 'live') {
    if (LIVE_ENVS.indexOf(lowerCaseEnv) === -1) {
      logPlatformUrl = LOG_PLATFORM_ENV_URL_MAP.nonlive
    }
  }
  const logPlatformLink = `${logPlatformUrl}?${logQs}`
  return logPlatformLink
}

export const generateTracingPlatformLink = ({ tracingUrl, traceId }: IGenerateTracingLink): string => {
  const tracingPlatformLink = `${tracingUrl}/${traceId}`
  return tracingPlatformLink
}

export const addProtocol = (url: string) => {
  const hasProtocol = /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  const protocol = location.protocol
  return hasProtocol ? url : `${protocol}//${url}`
}

export const generateMonitoringPlatformLink = ({
  tenantName,
  env,
  cid,
  projectName,
  appName,
  monitoringClusterName,
  clusterName
}: IGenerateMonitoringPlatformLink): string => {
  const lowerCaseEnv = env.toLowerCase()
  const lowerCaseCid = cid.toLowerCase()

  const tenantItems = tenantName.split(' ')
  const parsedClusterName = monitoringClusterName || clusterName.replace(/^kube/, 'k8s')
  const parsedGroup = tenantItems.length ? tenantItems.join('-') : undefined
  const monitorQs = stringify({
    'var-cluster': parsedClusterName,
    'var-group': parsedGroup,
    'var-project': projectName,
    'var-env': lowerCaseEnv,
    'var-module': appName,
    'var-cid': lowerCaseCid,
    orgId: '1' // Specify monitor organization
  })
  const monitoringHref = `${MonitoringPlatformUrl}?${monitorQs}`
  return monitoringHref
}
