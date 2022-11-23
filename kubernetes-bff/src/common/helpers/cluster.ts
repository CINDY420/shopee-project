import { ICluster } from 'platform-management/clusters/entities/cluster.entity'

interface IParseClusterIdResponse {
  env?: string
  cid?: string
  clusterName?: string
  fteName?: string
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

  throw new Error(`Invalid clusterId: ${clusterId}`)
}

export const generateClusterId = (env: string, cid: string, clusterName: string) => `${env}-${cid}:${clusterName}`

export const generateClusterIdWithFteName = (
  env: string,
  cid: string,
  clusterName: string,
  fteName: string
): string => {
  const clusterId = generateClusterId(env, cid, clusterName)
  return fteName ? `${fteName}:${clusterId}` : clusterId
}

export const generateQuotaName = (clusterId: string) => {
  const { env, clusterName } = parseClusterId(clusterId)
  return `${clusterName}:${env}`
}

export const parseClusterQuotaName = (quotaName: string) => {
  if (!quotaName || !quotaName.includes(':')) {
    return {}
  }

  const [clusterName, env] = quotaName.split(':')

  return {
    env,
    clusterName
  }
}

export const generateClusterMap = (relations: string[]) => {
  const res = {}
  relations.forEach((relation) => {
    const { env, clusterName } = parseClusterId(relation)
    if (!res[env]) {
      res[env] = []
    }
    if (res[env].indexOf(clusterName) < 0) {
      res[env].push(clusterName)
    }
  })
  return res
}

export const generateCluster = (environments: string[], relations: string[]) => {
  const res = []
  environments.forEach((environment) => {
    const cluster = { environment: '', cids: [] }
    cluster.environment = environment

    relations.forEach((relation) => {
      const { env, cid } = parseClusterId(relation)
      if (environment === env) {
        const cidItem = { cid: cid, clusterIds: [relation] }
        cluster.cids.push(cidItem)
      }
    })

    res.push(cluster)
  })
  return res
}

export const hitClusterConfigInfo = (
  groupName: string,
  env: string,
  cid: string,
  esClusterList: ICluster[]
): string[] => {
  const clusterNameList = []
  esClusterList.forEach((esCluster) => {
    const { name, tenants, envs, cids } = esCluster
    if (tenants && tenants.includes(groupName) && envs && envs.includes(env) && cids && cids.includes(cid)) {
      clusterNameList.push(name)
    }
  })
  return clusterNameList
}

export const generateClusterEnvsMap = (
  groupName: string,
  envs: string[],
  cids: string[],
  esClusterList: ICluster[]
): { [clusterName: string]: string[] } => {
  const clusterEnvsMap = {}

  envs.forEach((env) => {
    cids.forEach((cid) => {
      const clusterNameList = hitClusterConfigInfo(groupName, env, cid, esClusterList)

      clusterNameList.forEach((clusterName) => {
        clusterEnvsMap[clusterName] = clusterEnvsMap[clusterName] || []
        if (!clusterEnvsMap[clusterName].includes(env)) {
          clusterEnvsMap[clusterName].push(env)
        }
      })
    })
  })
  return clusterEnvsMap
}

// namespace: cluster-env-cid
export const parseClusterNamespace = (namespace: string) => {
  const array = namespace.split('-')
  if (array.length < 3) {
    throw new Error('Invalid namespace')
  }

  return { env: array[1].toUpperCase(), cid: array[2].toUpperCase() }
}
