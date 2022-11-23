interface IParseClusterIdResponse {
  env?: string
  cid?: string
  clusterName?: string
  fteName?: string
}

export const getClusterNameById = (clusterId: string): string => {
  if (!clusterId) {
    return ''
  }

  const arr = clusterId.split(':')
  return arr[arr.length - 1]
}

export const parseEventName = (ESEventName: string): string => {
  if (!ESEventName.length) return ESEventName
  const nameItems = ESEventName.split('.')
  return nameItems[0]
}

export const parseClusterId = (clusterId: string): IParseClusterIdResponse => {
  if (!clusterId.includes(':') || !clusterId.includes('-')) {
    throw new Error(`Invalid clusterId: ${clusterId}`)
  }

  const [envWrap, clusterName] = clusterId.split(':')
  const [env, cid] = envWrap.split('-')

  return {
    env,
    cid,
    clusterName
  }
}

export const parseClusterIdWithFte = (clusterId: string): IParseClusterIdResponse => {
  const items = clusterId.split(':')
  if (items.length === 2) {
    return parseClusterId(clusterId)
  }

  if (items.length === 3) {
    const [fteName, envWrap, clusterName] = clusterId.split(':')
    return {
      ...parseClusterId(`${envWrap}:${clusterName}`),
      fteName
    }
  }

  return {}
}
