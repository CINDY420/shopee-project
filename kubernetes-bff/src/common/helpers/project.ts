import { HttpException, HttpStatus } from '@nestjs/common'
import { parseClusterId, generateClusterId, parseClusterQuotaName } from 'common/helpers/cluster'
import {
  IESProjectDetailResponse,
  IPlayLoadInfo,
  IResourceQuotaInfo,
  IProjectQuotaInfo
} from 'applications-management/projects/dto/create-project.dto'
import { dedup } from 'common/helpers/array'
import configuration from 'common/config/configuration'

import { isEqual, sortBy } from 'lodash'
import { roundToTwo } from 'common/helpers/decimal'

const throwError = () => {
  throw new HttpException('Create Project param error!', HttpStatus.BAD_REQUEST)
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const route = require('path-match')({
  sensitive: false,
  strict: false,
  end: false
})
const projectMatch = route('/api/v3/groups/:groupName/projects/:projectName')

export interface IClusterNamespacesMap {
  [clusterName: string]: string[]
}

export interface IProjectNamespaceMap {
  [clusterName: string]: string
}

export const generateClusterProjectNamespaceMap = (esProject: IESProjectDetailResponse): IClusterNamespacesMap => {
  const relations = esProject.relations || []
  const projectName = esProject.project
  const map = {}

  relations.forEach((relation) => {
    const { env, cid, clusterName } = parseClusterId(relation)
    if (!map[clusterName]) {
      map[clusterName] = []
    }

    const namespace = generateProjectNamespace(projectName, env, cid)
    if (!map[clusterName].includes(namespace)) {
      map[clusterName].push(namespace)
    }
  })

  return map
}

export interface IEnvQuotasNameMap {
  [envName: string]: string
}

export const generateEnvQuotaNameMap = (clusterName: string, namespaces: string[]): IEnvQuotasNameMap => {
  const map = {}
  namespaces.forEach((namespace) => {
    const { env } = parseProjectNamespace(namespace)
    const quotaName = generateClusterId(env, '*', clusterName)
    if (!map[env]) {
      map[env] = quotaName
    }
  })

  return map
}

export const generateProjectNamespace = (projectName: string, env: string, cid: string): string =>
  `${projectName}-${env}-${cid}`

export interface IProjectNamespaceObj {
  projectName: string
  env: string
  cid: string
}

export const parseProjectNamespace = (namespace: string): IProjectNamespaceObj => {
  const [projectName, env, cid] = namespace.split('-')

  return {
    projectName,
    env,
    cid
  }
}

export const generateRelationsClustersEnvironments = (payload: IPlayLoadInfo) => {
  const quotas = payload.quotas || []
  const cids = payload.cids || []

  const relations = []
  const clusters = []
  const environments = []
  quotas.forEach((quota) => {
    const { name } = quota
    const { env, clusterName } = parseClusterQuotaName(name)
    if (!env || !clusterName) {
      throwError()
    }
    clusters.push(clusterName)
    environments.push(env)
    cids.forEach((cid) => {
      relations.push(`${env}-${cid}:${clusterName}`)
    })
  })

  return {
    relations: dedup<string>(relations),
    clusters: dedup<string>(clusters),
    environments: dedup<string>(environments)
  }
}

export const generateCrdQuotasInfo = (quotas: IResourceQuotaInfo[] = []) => {
  const crdQuotas = quotas.map((quota) => {
    const { name, cpuTotal, memoryTotal } = quota
    const { env, clusterName } = parseClusterQuotaName(name)
    const roundedCpuTotal = roundToTwo(cpuTotal)
    const roundedMemoryTotal = roundToTwo(memoryTotal)
    // if (roundedCpuTotal === 0 || roundedMemoryTotal === 0) {
    //   throw new HttpException(
    //     'Project quotas param is too small, should larger than or equal to 0.01!',
    //     HttpStatus.BAD_REQUEST
    //   )
    // }
    return {
      name: `${clusterName}:${env}`,
      cpu: roundedCpuTotal,
      memory: roundedMemoryTotal + 'Gi',
      env: env,
      cluster: clusterName
    }
  })

  return crdQuotas
}

export const buildNewProjectCrdAndResult = (tenantId: string, projectName: string, payload: IPlayLoadInfo) => {
  const { quotas, cids } = payload
  const { relations, clusters, environments } = generateRelationsClustersEnvironments(payload)
  const crdQuotas = generateCrdQuotasInfo(quotas)

  const newProject = {
    clusters,
    cids,
    environments,
    tenant: tenantId,
    project: projectName,
    relations,
    quotas: crdQuotas
  }

  const crdObject = {
    apiVersion: 'app.kubernetes.devops.i.sz.shopee.io/v1',
    kind: 'Project',
    metadata: {
      name: projectName
    },
    spec: {
      ...newProject
    }
  }

  const result = {
    cids: cids,
    clusters: clusters,
    environments: environments,
    tenant: tenantId,
    project: projectName,
    relations: relations,
    updatetime: '',
    createtime: ''
  }

  return { crdObject, result }
}

export const parseGroupProjectFromPath = (path: string): [string, string] | null => {
  const params = projectMatch(path) as any
  if (params === false) {
    return null
  }

  return [params.groupName, params.projectName]
}

export const isArraysItemsSame = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false

  const len = a.length
  for (let i = 0; i < len; i++) {
    const value = a[i]
    if (b.indexOf(value) < 0) return false
  }

  return true
}

const globalEnvs = configuration().global.envs || []
const cidsLen = globalEnvs.length

export const checkEnv = (env: string) => {
  for (let i = 0; i < cidsLen; i++) {
    if (globalEnvs[i] === env) return true
  }
  return false
}

interface IParseEsQuotasMap {
  [quotasName: string]: IResourceQuotaInfo
}

export const parseEsQuotasMap = (esQuotasMap: IParseEsQuotasMap): IResourceQuotaInfo[] => {
  const result = []
  for (const key in esQuotasMap) {
    const value = esQuotasMap[key]
    const name = value.name.split('-*:').reverse().join(':')
    const { cpuTotal, memoryTotal } = value
    result.push({
      name,
      cpuTotal,
      memoryTotal
    })
  }

  return result
}

export const compareEsQuota = (a: IResourceQuotaInfo[], b: IResourceQuotaInfo[]): boolean => {
  return isEqual(sortBy(a, 'name'), sortBy(b, 'name'))
}

export const validateProjectQuotas = (
  updateData: IESProjectDetailResponse,
  esData: IESProjectDetailResponse,
  esDataSecond: IProjectQuotaInfo
): boolean => {
  const { quotas: updateQuotas } = updateData
  const { quotas } = esDataSecond
  const { Quotas: esQuotasMap } = JSON.parse((quotas as unknown) as string)
  const esQuotas = parseEsQuotasMap(esQuotasMap)

  if (!compareEsQuota(roundQuotasNumber(updateQuotas), roundQuotasNumber(esQuotas))) {
    return false
  }

  if (updateData.tenant !== esData.tenant || updateData.project !== esData.project) {
    return false
  }

  const {
    cids: updateCids,
    clusters: updateClusters,
    environments: updateEnvironments,
    relations: updateRelations
  } = updateData
  const { cids: esCids, clusters: esClusters, environments: esEnvironments, relations: esRelations } = esData

  if (
    isArraysItemsSame(updateCids, esCids) &&
    isArraysItemsSame(updateClusters, esClusters) &&
    isArraysItemsSame(updateEnvironments, esEnvironments) &&
    isArraysItemsSame(updateRelations, esRelations)
  )
    return true

  return false
}

export const roundQuotasNumber = (quotas: IResourceQuotaInfo[]): IResourceQuotaInfo[] => {
  const len = quotas.length
  const result = []
  for (let i = 0; i < len; i++) {
    const { cpuTotal, memoryTotal, name } = quotas[i]
    result.push({
      name,
      cpuTotal: roundToTwo(cpuTotal),
      memoryTotal: roundToTwo(memoryTotal)
    })
  }
  return result
}
