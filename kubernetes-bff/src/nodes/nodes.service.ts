import { V1NodeList } from '@kubernetes/client-node'
import { Injectable, HttpStatus, HttpException } from '@nestjs/common'

import { AgentService } from 'common/modules/agent/agent.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { ESService } from 'common/modules/es/es.service'
import { MetricsService } from 'common/modules/metrics/metrics.service'

import { getRestartMessage, parsePodContainers, parsePodStatus, sortPodsByName } from 'common/helpers/pod'
import { calculateMetricsList } from 'common/helpers/metrics'

import { ESIndex, ES_MAX_SEARCH_COUNT } from 'common/constants/es'
import {
  NodeActionBasePayload,
  NodeLabelPayload,
  NodeTaintPayload,
  NODE_ACTION_TYPE,
  NodeActionResponse,
  NodeListResponse,
  INodePodListResponse
} from './dto/node.dto'
import { INode } from './entities/node.entity'
import { IMetricListResponse } from 'applications-management/projects/entities/project.entity'
import { generateClusterId } from 'common/helpers/cluster'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class NodesService {
  private readonly logger = new Logger(NodesService.name)

  constructor(
    private agentService: AgentService,
    private clustersService: ClustersService,
    private eSService: ESService,
    private metricsService: MetricsService
  ) {}

  // apis
  async listNodes(clusterName: string): Promise<NodeListResponse> {
    await this.clustersService.findByName(clusterName)

    const { documents, total } = await this.eSService.termQueryAll<INode>(
      ESIndex.NODE,
      'cluster',
      clusterName,
      ES_MAX_SEARCH_COUNT
    )

    return {
      nodes: documents,
      totalCount: total
    }
  }

  async getDetail(clusterName: string, nodeName: string): Promise<INode> {
    const esNode = await this.eSService.booleanQueryFirst<INode>(ESIndex.NODE, {
      must: [
        {
          term: { cluster: clusterName }
        },
        {
          term: { name: nodeName }
        }
      ]
    })

    if (!esNode) {
      throw new HttpException(`Can not find node: ${nodeName} in cluster: ${clusterName}`, HttpStatus.NOT_FOUND)
    }

    return esNode
  }

  async doNodeActions(
    clusterName: string,
    payload: NodeActionBasePayload | NodeLabelPayload | NodeTaintPayload,
    actionType: NODE_ACTION_TYPE
  ): Promise<NodeActionResponse> {
    const { config } = await this.clustersService.findByName(clusterName)
    const { nodes = [] } = payload
    const clusterConfig = { config, clusterName }

    const response = {
      success: [],
      fail: []
    }

    await Promise.all(
      nodes.map(async (nodeName) => {
        try {
          if (actionType === NODE_ACTION_TYPE.LABEL) {
            const { labels } = payload as NodeLabelPayload
            await this.agentService.request(
              actionType,
              false,
              clusterConfig,
              {
                name: nodeName,
                labels
              },
              {},
              false
            )
          } else if (actionType === NODE_ACTION_TYPE.TAINT) {
            const { action, taint } = payload as NodeTaintPayload
            await this.agentService.request(
              actionType,
              false,
              clusterConfig,
              {
                name: nodeName,
                action,
                taint
              },
              {},
              false
            )
          } else {
            await this.agentService.request(actionType, false, clusterConfig, {
              name: nodeName
            })
          }
          response.success.push(nodeName)
        } catch (e) {
          this.logger.error(`fail to ${actionType} node ${nodeName} in cluster ${clusterName} for error: ${e}`)
          response.fail.push(nodeName)
        }
      })
    )

    return response
  }

  async getNodePodList(clusterName: string, nodeName: string): Promise<INodePodListResponse> {
    const { config: token } = await this.clustersService.findByName(clusterName)
    const podList: any = await this.agentService.request(
      'getpodsbynodename',
      true,
      { config: token, clusterName },
      {
        nodeName
      }
    )

    const normalPodList = []
    const abnormalPodList = []
    const statusMap = {}

    if (podList.items && podList.items.length) {
      for (const k8sPod of podList.items) {
        const { name, namespace, creationTimestamp, labels = {} } = k8sPod.metadata || {}
        const { hostIP, podIP, containerStatuses = [] } = k8sPod.status || {}
        const { nodeName, containers = [] } = k8sPod.spec || {}
        const { application, cid, env, group, project } = labels

        // 过滤非业务相关的pod
        if (!group || !application || !project) {
          continue
        }

        const status = parsePodStatus(k8sPod)
        const pod = {
          name,
          nodeName,
          clusterId: generateClusterId(env, cid, clusterName),

          projectName: project,
          appName: application,
          groupName: group ? group.replace(/-/g, ' ') : undefined,
          namespace,
          cid,
          environment: env,

          nodeIP: hostIP,
          podIP,
          status,
          creationTimestamp,
          containers: parsePodContainers(containers),
          restart: getRestartMessage(containerStatuses)
        }

        statusMap[status] = true
        if (pod.status === 'Running') {
          normalPodList.push(pod)
        } else {
          abnormalPodList.push(pod)
        }
      }
    }

    const pods = [...sortPodsByName(abnormalPodList), ...sortPodsByName(normalPodList)]
    const simplePods = pods.map((pod) => {
      return {
        name: pod.name,
        namespace: pod.namespace
      }
    })
    const metricList = await this.metricsService.getPodsMetrics<IMetricListResponse[]>(token, simplePods, [
      'cpu_usage',
      'memory_usage',
      'limit'
    ])
    pods.forEach((pod) => {
      const metric = metricList.find((metric) => metric.podName === pod.name)
      if (metric) {
        const { cpu, memory } = calculateMetricsList([metric.metrics])
        pod.cpu = cpu
        pod.memory = memory
      }
    })

    return {
      pods,
      totalCount: pods.length,
      statusList: Object.keys(statusMap)
    }
  }

  // helpers
  async getNodeListWithClusterConfig(
    clusterConfig: string,
    clusterName: string,
    isFromCache = true
  ): Promise<V1NodeList> {
    return await this.agentService.request<V1NodeList>('node', isFromCache, {
      config: clusterConfig,
      clusterName
    })
  }
}
