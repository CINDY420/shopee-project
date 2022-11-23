import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common'
import { ESService } from 'common/modules/es/es.service'
import { ESIndex, ES_MAX_SEARCH_COUNT } from 'common/constants/es'
import {
  ClusterInfoDto,
  IAgentService,
  IServiceList,
  IAgentEndPointsListItem,
  IParsedAgentServiceInfo
} from './dto/list-services.dto'
import {
  IClusterServiceNamespace,
  SERVICE_TYPE,
  ICreateServicePlayLoad,
  ICreateServiceArguments,
  IPort,
  ISelector
} from './dto/creat-service.dto'
import { IServiceInfo, IUpdateServiceArgs, ICluster } from './dto/update-service.dto'
import { parseWildCard } from 'common/helpers/service'
import { parseClusterId, parseClusterNamespace, generateClusterId } from 'common/helpers/cluster'
import { AgentService } from 'common/modules/agent/agent.service'
import { generateProjectNamespace } from 'common/helpers/project'
import { V1Service } from '@kubernetes/client-node'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { uniq } from 'lodash'

interface IESClusterInfo {
  name: string
  config: string
}
interface IProjectRelation {
  clusterName: string
  env: string
  cid: string
}
interface IProjectRelationConfig extends IProjectRelation {
  config: string
}

@Injectable()
export class ServicesService {
  constructor(
    private esService: ESService,
    private agentService: AgentService,
    private projectsService: ProjectsService
  ) {}

  async getServiceList(tenantId: number, projectName: string, queryClusterNameList: string[]): Promise<IServiceList> {
    const projectDetail = await this.projectsService.getEsProject(projectName, tenantId)

    if (!projectDetail) {
      throw new NotFoundException(`Request project ${projectName} doesn't exit`)
    }

    const parsedRelationList = this.parseProjectRelations(projectDetail?.relations ?? [])
    const queriedRelationList = parsedRelationList.filter(
      (item) => queryClusterNameList.length === 0 || queryClusterNameList.includes(item.clusterName)
    )
    // Request cluster config from ES
    const clusterInfoMap = await this.getClusterInfoMap(queriedRelationList.map((item) => item.clusterName))

    const queriedRelationConfigList: IProjectRelationConfig[] = queriedRelationList
      .filter((item) => !!clusterInfoMap[item.clusterName])
      .map((item) => {
        const clusterInfo = clusterInfoMap[item.clusterName]
        const config = clusterInfo.config
        return { ...item, config }
      })

    // list all services
    const relationsServiceList: { svc: V1Service; clusterConfig: IProjectRelationConfig }[][] = await Promise.all(
      queriedRelationConfigList.map(async (clusterConfig) => {
        const { env, cid, config, clusterName } = clusterConfig
        const labelsSelect = {
          project: projectName,
          env,
          cid
        }
        try {
          const agentService = await this.agentService.request<IAgentService>(
            'getservicebylabelselect',
            true,
            { config, clusterName },
            {
              labesSelect: JSON.stringify(labelsSelect)
            }
          )
          const { items } = agentService
          const serviceList = items ?? []
          const relationServiceList = serviceList.map((svc) => ({ svc, clusterConfig }))
          return relationServiceList
        } catch (error) {
          // return empty data if request the agent server failed
          return []
        }
      })
    )
    const allServiceList = relationsServiceList.reduce((allList, currentList) => allList.concat(currentList), [])

    // request svc endpoints
    const allServiceWithEndpoints: {
      svc: V1Service
      clusterConfig: IProjectRelationConfig
      agentEndPoints: IAgentEndPointsListItem
    }[] = await Promise.all(
      allServiceList.map(async ({ svc, clusterConfig }) => {
        const { metadata } = svc
        const { config, clusterName } = clusterConfig
        try {
          const agentEndPoints = await this.agentService.request<IAgentEndPointsListItem>(
            'endpoints',
            true,
            { config, clusterName },
            {
              namespace: metadata?.namespace,
              name: metadata.name
            }
          )
          return { svc, clusterConfig, agentEndPoints }
        } catch (error) {
          // return empty agentEndPoints if request the agent server failed
          return { svc, clusterConfig, agentEndPoints: { items: [], metadata: {} } }
        }
      })
    )

    // format
    const formattedServiceList = allServiceWithEndpoints.map(({ svc, clusterConfig, agentEndPoints }) => {
      const { metadata, spec } = svc
      const { clusterName } = clusterConfig

      const env = metadata.labels?.env.toUpperCase()
      const cid = metadata.labels?.cid.toUpperCase()
      const { ipList, portList } = this.extractIpAndPortsList(agentEndPoints)
      // Combine ips and ports
      const endPoints = this.generateEndpointList(ipList, portList)

      const clusterIp = spec.type === 'ClusterIP' ? spec.clusterIP : ''
      const externalIp = spec.type === 'ExternalName' ? spec.externalName : ''
      const clusterId = generateClusterId(env, cid, clusterName)

      // transform ports
      const portInfos = []

      let { ports } = spec

      if (ports == null) {
        ports = []
      }

      const customPorts = ports.map((portObj) => {
        const { name, port, protocol, targetPort } = portObj
        const nodePort = portObj.nodePort ? String(portObj.nodePort) : '0'
        const portString = String(port)
        const portInfo = {
          name,
          port: portString,
          targetPort: String(targetPort),
          protocol,
          nodePort
        }
        portInfos.push(portInfo)
        return portString
      })

      const service = {
        name: metadata.name,
        type: spec.type,
        env,
        cid,
        ports: customPorts,
        clusterId,
        portInfos,
        externalIp,
        clusterIp,
        endPoints,
        clusterName,
        platform: String(metadata.labels.platform !== undefined)
      }
      return service
    })

    return {
      svcs: formattedServiceList,
      totalCount: formattedServiceList.length,
      groupName: tenantId.toString(),
      projectName
    }
  }

  private parseProjectRelations(relations: string[]): IProjectRelation[] {
    const uniqRelations = uniq(relations)
    const relationInfoList = uniqRelations.map((relation) => {
      const { env, cid, clusterName } = parseClusterId(relation)
      return { env: env.toLocaleLowerCase(), cid: cid.toLocaleLowerCase(), clusterName }
    })
    return relationInfoList
  }

  private async getClusterInfoMap(clusters: string[]): Promise<Record<string, IESClusterInfo>> {
    const uniqClusters = uniq(clusters)
    const shouldTerms = uniqClusters.map((cluster) => ({ term: { name: { value: cluster } } }))
    try {
      const { documents: clusterInfoList } = await this.esService.booleanQueryAll<IESClusterInfo>(
        ESIndex.CLUSTER,
        { should: shouldTerms },
        ES_MAX_SEARCH_COUNT
      )
      const clusterInfoMap: Record<string, IESClusterInfo> = {}
      clusterInfoList.forEach((clusterInfo) => {
        const { name } = clusterInfo
        clusterInfoMap[name] = clusterInfo
      })

      return clusterInfoMap
    } catch (err) {
      return {}
    }
  }

  private extractIpAndPortsList(agentEndPoint: IAgentEndPointsListItem) {
    const ipList: string[] = []
    const portList: number[] = []
    let { items } = agentEndPoint

    if (items == null) {
      items = []
    }

    items.forEach((item) => {
      let { subsets } = item

      if (subsets == null) {
        subsets = []
      }
      subsets.forEach((element) => {
        let { addresses = [], ports = [] } = element

        if (addresses == null) {
          addresses = []
        }

        if (ports == null) {
          ports = []
        }
        // get ips
        addresses.forEach((address) => {
          const { ip = '' } = address
          ip.length && ipList.push(ip)
        })

        // get ports
        ports.forEach((portObj) => {
          const { port = undefined } = portObj
          port !== undefined && portList.push(port)
        })
      })
    })

    return { ipList, portList }
  }

  private generateEndpointList(ipList, portList) {
    const endPoints = []
    ipList.forEach((ip) => {
      portList.forEach((port) => {
        const endPoint = `${ip}:${port}`
        endPoints.push(endPoint)
      })
    })

    return endPoints
  }

  validateServiceType(type: SERVICE_TYPE, externalName: string, ports: IPort[], selector: ISelector[]) {
    if (type === SERVICE_TYPE.EXTERNAL_NAME) {
      if (!externalName) {
        throw new BadRequestException('Request externalName must be provided')
      }
    } else if (type === SERVICE_TYPE.CLUSTER_IP) {
      // ports are must
      if (!ports) {
        throw new BadRequestException('Request ports must be provided')
      } else {
        this.validatePorts(ports)
      }

      this.validateSelector(selector)
    } else {
      throw new BadRequestException('Request service type is invalid')
    }
  }

  private validatePorts(ports: IPort[]) {
    const portNameRegexp = /[a-z0-9]([-a-z0-9]*[a-z0-9])?/

    ports.forEach((port) => {
      const { name } = port

      if (!portNameRegexp.test(name)) {
        throw new BadRequestException('Request service port name is invalid')
      }

      if (name.length < 2 || name.length > 64) {
        throw new BadRequestException('Request service port name character must > 2 and < 64')
      }
    })
  }

  private validateSelector(selectorList: ISelector[]) {
    selectorList.forEach((selector) => {
      const { key, value } = selector

      if (key.length < 2 || key.length > 63) {
        throw new BadRequestException('service selector key character must > 2 and < 63 ')
      }

      const selectorValueRegexp = /^@cid|^@env|^@domain_env_flag|^@domain_cid_suffix|^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/
      if (!selectorValueRegexp.test(value)) {
        throw new BadRequestException(`Selector value must match ${selectorValueRegexp}`)
      }
    })
  }

  // Create serval services in serval clusters
  async createServices(tenantId: number, projectName: string, payload: ICreateServicePlayLoad) {
    const { env: envList, cid: cidList, cluster: clusterList, prefix } = payload

    const projectDetail = await this.projectsService.getEsProject(projectName, tenantId)
    if (!projectDetail) {
      throw new NotFoundException(`Request tenant ${tenantId} project ${projectName} doesn't exit`)
    }

    const clusterEnvCidListMap = this.parseClusterToEnvCidMap(envList, cidList, clusterList)

    const clusterServiceNamespaceList = this.generateClusterServiceNamespaceList(
      clusterEnvCidListMap,
      prefix,
      projectName
    )

    await this.verifyService(clusterServiceNamespaceList)

    await this.createServicesOfClusters(tenantId, clusterServiceNamespaceList, payload)

    return {
      result: `services with prefix ${prefix} have been created successfully!`
    }
  }

  private parseClusterToEnvCidMap(
    envList: string[],
    cidList: string[],
    clusterList: string[]
  ): Record<string, string[]> {
    const clusterEnvCidListMap = {}

    const envCidList = this.joinEnvCidToList(envList, cidList)

    clusterList.forEach((cluster) => {
      // cluster example: ENV-CID:clusterName
      const clusterItems = cluster.split(':')

      if (!envCidList.includes(clusterItems[0])) {
        throw new BadRequestException('cluster can not match env and cid')
      }

      if (!clusterEnvCidListMap[clusterItems[1]]) {
        clusterEnvCidListMap[clusterItems[1]] = []
      }
      const currentClusterValue = clusterEnvCidListMap[clusterItems[1]]

      !currentClusterValue.includes(clusterItems[0]) && currentClusterValue.push(clusterItems[0])
    })

    return clusterEnvCidListMap
  }

  private joinEnvCidToList(envList: string[], cidList: string[]): string[] {
    const envCidList = []
    envList.forEach((env) => {
      cidList.forEach((cid) => {
        const envCid = `${env.toUpperCase()}-${cid.toUpperCase()}`
        envCidList.push(envCid)
      })
    })

    return envCidList
  }

  private generateClusterServiceNamespaceList(
    clusterEnvCidMap: Record<string, string[]>,
    prefix: string,
    projectName: string
  ): IClusterServiceNamespace[] {
    const clusterEnvCidArray = Object.entries(clusterEnvCidMap)
    const clusterServiceNamespaceList = clusterEnvCidArray.map(([clusterName, envCidList]) => {
      const serviceNamespaceMap = {}

      envCidList.forEach((envCid) => {
        const [env, cid] = envCid.toLowerCase().split('-')

        const serviceName = `${prefix}-${env}-${cid}`
        const namespace = generateProjectNamespace(projectName, env, cid)

        serviceNamespaceMap[serviceName] = namespace
      })

      return { clusterName, serviceNamespaceMap }
    })

    return clusterServiceNamespaceList
  }

  private async verifyService(clusterServiceNamespaceList: IClusterServiceNamespace[]) {
    // make sure request clusters are existed
    const clusterServicesList = await Promise.all(
      clusterServiceNamespaceList.map(async (clusterServiceNamespace) => {
        const { clusterName, serviceNamespaceMap } = clusterServiceNamespace

        try {
          const clusterInfo = await this.esService.termQueryFirst<ClusterInfoDto>(ESIndex.CLUSTER, 'name', clusterName)
          if (clusterInfo == null) {
            throw new NotFoundException('request cluster does not exit')
          }
          return { clusterInfo, serviceNamespaceMap }
        } catch (err) {
          if (err?.status?.status === 404) {
            throw new NotFoundException(err)
          } else {
            throw new InternalServerErrorException(`failed to get cluster from es: ${err?.stack}`)
          }
        }
      })
    )

    // make sure services will be created are not existed
    await Promise.all(
      clusterServicesList.map(async (clusterServices) => {
        const { clusterInfo, serviceNamespaceMap } = clusterServices
        const { config, name } = clusterInfo
        const serviceDetailApi = 'servicedetail'

        await Promise.all(
          Object.entries(serviceNamespaceMap).map(async ([serviceName, namespace]) => {
            try {
              await this.agentService.request(
                serviceDetailApi,
                true,
                { config: config.kubeconfig, clusterName: name },
                {
                  name: serviceName,
                  namespace
                }
              )

              // service can't be created if it's name is existed
              throw new Error('existed')
            } catch (err) {
              if (err.message && err.message === 'existed') {
                throw new BadRequestException(`request service ${name} / ${namespace} / ${serviceName} already exists`)
              } else {
                // ignore error that service is not found
                if (err.status !== 404) {
                  throw new InternalServerErrorException(
                    `Request ${name} cluster agent aip: /${serviceDetailApi} err: ${err}`
                  )
                }
              }
            }
          })
        )
      })
    )
  }

  private async createServicesOfClusters(
    tenantId: number,
    clusterServiceNamespaceList: IClusterServiceNamespace[],
    serviceArgs: ICreateServicePlayLoad
  ) {
    const { type, externalName, ports, selector, clusterIp = false } = serviceArgs

    await Promise.all(
      clusterServiceNamespaceList.map(async (clusterServiceNamespace) => {
        const { clusterName, serviceNamespaceMap } = clusterServiceNamespace

        const clusterConfigInfo = await this.esService.termQueryFirst<ICluster>(ESIndex.CLUSTER, 'name', clusterName)
        const { config } = clusterConfigInfo

        // create different namespaced services one by one
        await Promise.all(
          Object.entries(serviceNamespaceMap).map(async ([serviceName, namespace]) => {
            const { env, cid } = parseClusterNamespace(namespace as string)

            let transformedPorts = ''
            let transformedSelectors = ''
            let transformedClusterIp = ''

            if (type === SERVICE_TYPE.CLUSTER_IP) {
              transformedPorts = JSON.stringify(ports)
              transformedSelectors = JSON.stringify(this.parseSelectors(selector, env, cid))
              transformedClusterIp = String(clusterIp)
            }

            let transformedExternalName = ''
            if (type === SERVICE_TYPE.EXTERNAL_NAME) {
              transformedExternalName = parseWildCard(externalName, env, cid)
            }

            await this.createOneService({
              clusterConfig: config as any,
              clusterName,
              tenant: tenantId,
              serviceName,
              namespace,
              serviceType: type,
              ports: transformedPorts,
              selectors: transformedSelectors,
              externalName: transformedExternalName,
              clusterIP: transformedClusterIp
            })
          })
        )
      })
    )
  }

  private parseSelectors(selectorList: any[], env: string, cid: string) {
    return selectorList.map((selector) => {
      const { key: iKey, value: iValue } = selector
      return {
        key: parseWildCard(iKey, env, cid),
        value: parseWildCard(iValue, env, cid)
      }
    })
  }

  private async createOneService(args: ICreateServiceArguments) {
    const {
      clusterConfig,
      clusterName,
      tenant,
      serviceName,
      namespace,
      serviceType,
      ports,
      selectors,
      externalName,
      clusterIP
    } = args

    const body = {
      tenant: tenant.toString(),
      name: serviceName,
      namespace,
      type: serviceType,
      ports,
      selectors,
      externalName,
      clusterIP
    }

    try {
      await this.agentService.request('createservice', false, { config: clusterConfig, clusterName }, body)
    } catch (err) {
      throw new InternalServerErrorException(`create service error: ${err}`)
    }
  }

  async updateService(tenantId: number, projectName: string, serviceInfo: IServiceInfo) {
    const projectDetail = await this.projectsService.getEsProject(projectName, tenantId)
    if (!projectDetail) {
      throw new NotFoundException(`Request tenant '${tenantId}' project '${projectName}' doesn't exit`)
    }

    const {
      serviceName,
      prefix,
      env,
      cid,
      clusterName,
      serviceType,
      externalName,
      ports,
      selectorList,
      clusterIp: requestClusterIp
    } = serviceInfo
    const parsedServiceName = `${prefix}-${env}-${cid}`.toLowerCase()
    if (parsedServiceName !== serviceName) {
      throw new BadRequestException(
        `request service name '${serviceName}' does not match parsed service name '${parsedServiceName}'`
      )
    }

    // verify if request service exist
    const clusterInfo = await this.getClusterInfoByName(clusterName)
    const { config } = clusterInfo
    const namespace = generateProjectNamespace(projectName, env, cid)
    const serviceDetail = await this.getServiceDetail(config, clusterName, namespace, serviceName)

    // special conditions that service can't be updated
    const { spec } = serviceDetail
    const { type, clusterIP } = spec || {}
    if (type === SERVICE_TYPE.CLUSTER_IP) {
      if (clusterIP === 'None' && requestClusterIp === true) {
        throw new BadRequestException('Unable to update the clusterIP of the service from None to ip')
      }
    }

    const updateServiceArgs = {
      env,
      cid,
      serviceName,
      serviceType,
      externalName,
      ports,
      selectorList,
      namespace,
      clusterIp: requestClusterIp
    }
    await this.updateOneService(config as any, clusterName, updateServiceArgs)

    return {
      result: `service ${serviceName} has been updated successfully!`
    }
  }

  async getClusterInfoByName(clusterName: string): Promise<ICluster> {
    try {
      const clusterInfo = await this.esService.termQueryFirst<ICluster>(ESIndex.CLUSTER, 'name', clusterName)
      if (clusterInfo == null) {
        throw new NotFoundException(`request cluster '${clusterName}' does not exit`)
      }
      return clusterInfo
    } catch (err) {
      if (err.status && err.status === 404) {
        throw new NotFoundException(err)
      } else {
        throw new InternalServerErrorException(`failed to get cluster from es: ${err}`)
      }
    }
  }

  async getServiceDetail(
    clusterConfig: string,
    clusterName: string,
    namespace: string,
    serviceName: string
  ): Promise<V1Service> {
    const body = { namespace, name: serviceName }
    try {
      const detail = await this.agentService.request<V1Service>(
        'servicedetail',
        false,
        { config: clusterConfig, clusterName },
        body
      )
      return detail
    } catch (err) {
      if (err.status && err.status === 404) {
        throw new NotFoundException(err)
      } else {
        throw new InternalServerErrorException(`get agent service detail error: ${err}`)
      }
    }
  }

  async updateOneService(clusterConfig: string, clusterName: string, args: IUpdateServiceArgs) {
    const { serviceName, env, cid, serviceType, externalName, ports, selectorList, namespace, clusterIp } = args

    let transformedPorts = ''
    let transformedSelectors = ''
    let transformedClusterIp = ''
    let transformedExternalName = ''

    if (serviceType === SERVICE_TYPE.CLUSTER_IP) {
      transformedPorts = JSON.stringify(ports)
      transformedSelectors = JSON.stringify(this.parseSelectors(selectorList, env, cid))
      transformedClusterIp = String(clusterIp)
    }
    if (serviceType === SERVICE_TYPE.EXTERNAL_NAME) {
      transformedExternalName = parseWildCard(externalName, env, cid)
    }

    const body = {
      name: serviceName,
      namespace,
      type: serviceType,
      ports: transformedPorts,
      selectors: transformedSelectors,
      externalName: transformedExternalName,
      clusterIP: transformedClusterIp
    }
    try {
      await this.agentService.request('updateservice', false, { config: clusterConfig, clusterName }, body)
    } catch (err) {
      throw new InternalServerErrorException(`agent update service ${serviceName} error: ${err}`)
    }
  }

  async deleteService(tenantId: number, projectName: string, serviceName: string, clusterName: string) {
    const projectDetail = await this.projectsService.getEsProject(projectName, tenantId)
    if (!projectDetail) {
      throw new NotFoundException(`Request tenant '${tenantId}' project '${projectName}' doesn't exit`)
    }

    // parse service name to env and cid
    const serviceNameItems = serviceName.split('-')
    if (serviceNameItems.length !== 3) {
      throw new BadRequestException(`Invalid service name ${serviceName}`)
    }
    const namespace = generateProjectNamespace(projectName, serviceNameItems[1], serviceNameItems[2])

    const clusterInfo = await this.getClusterInfoByName(clusterName)
    const { config } = clusterInfo

    const body = { namespace, name: serviceName }
    try {
      await this.agentService.request('deleteservice', false, { config, clusterName }, body)
      return {
        result: `delete service ${serviceName} successfully!`
      }
    } catch (err) {
      if (err.status && err.status === 404) {
        throw new NotFoundException(`service ${serviceName} not found`)
      } else {
        throw new InternalServerErrorException(`agent delete service ${serviceName} error: ${err}`)
      }
    }
  }

  parseAgentServiceInfo(agentServiceDetail: V1Service): IParsedAgentServiceInfo {
    const {
      spec: { type, ports = [], externalName, selector = [], clusterIP }
    } = agentServiceDetail

    let parsedPorts = []
    let parsedClusterIp = false
    if (type === 'ClusterIP') {
      parsedPorts = ports.map((portObj) => {
        const { name, port, protocol, targetPort } = portObj
        const { type, strVal } = targetPort as any

        return {
          name,
          port: String(port),
          targetPort: type === 0 ? String(strVal) : strVal,
          protocol
        }
      })
      parsedClusterIp = clusterIP !== 'None'
    }
    const parsedSelector = Object.entries(selector).map(([key, value]) => ({ key, value }))
    const parsedExternalName = type === 'ExternalName' ? externalName : ''

    return {
      clusterIp: parsedClusterIp,
      ports: parsedPorts,
      selector: parsedSelector,
      externalName: parsedExternalName
    }
  }
}
