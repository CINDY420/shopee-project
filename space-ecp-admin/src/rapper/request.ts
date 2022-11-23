/* md5: 74ab22afd40801ccec83c2dce4c9a154 */
/* Rap repository id: 211 */
/* Rapper version: 2.1.13 */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

/**
 * This file is automatically generated by Rapper to synchronize the Rap platform interface, please do not modify
 * Rap repository url: https://rap.shopee.io/repository/editor?id=211
 */

import * as commonLib from '@infra/rapper/runtime/commonLib'
import {IReqType} from './extra'

export interface IModels {
  /**
   * Interface name：PrometheusController_getMetrics
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1412&itf=8865
   */
  'GET/metrics': {
    Req: {
      type: string
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {}
  }

  /**
   * Interface name：ClusterController_addCluster
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1413&itf=8866
   */
  'POST/ecpadmin/clusters': {
    Req: {
      clusterId: string
      displayName: string
      monitoringUrl: string
      platform: string
      azKey: string
      segmentKey?: string
      kubeConfig: string
      clusterType?: string
      labels?: string[]
      description?: string
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {}
  }

  /**
   * Interface name：ClusterController_listClusters
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1413&itf=8867
   */
  'GET/ecpadmin/clusters': {
    Req: {
      offset?: string
      limit?: string
      orderBy?: string
      filterBy?: string
      searchBy?: string
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: {
        displayName: string
        clusterId: string
        clusterType: string
        azKey: string
        segmentKey: string
        segmentName?: string
        labels: string[]
        nodeCount: number
        podCount: number
        status: string
        healthyStatus: string
        createTime: string
        observabilityLink: string
        metrics: {}
      }[]
      filterOptions: {
        type: string[]
        status: string[]
        healthyStatus: string[]
      }
      totalCount: number
    }
  }

  /**
   * Interface name：ClusterController_listClusterMetas
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1413&itf=8868
   */
  'GET/ecpadmin/clusters/metas': {
    Req: {
      pageNum: string
      pageSize: string
      filterBy: string
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      total: number
      items: {
        labels?: string[]
        monitoringUrl?: string
        kubeApiserverType?: string
        azV1?: string
        regionKey?: string
        ecpVersion?: string
        descriptions?: string
        platform?: string
        uuid?: string
        kubeConfig?: string
        clusterType?: string
        azV2?: string
        karmadaKubeConfig?: string
        handleByGalio?: boolean
        displayName?: string
        azForDepconf?: string
        segmentKey?: string
        createTs?: string
      }[]
    }
  }

  /**
   * Interface name：ClusterController_getClusterDetail
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1413&itf=8869
   */
  'GET/ecpadmin/clusters/{clusterId}': {
    Req: {
      clusterId: string
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      displayName: string
      clusterId: string
      clusterType: string
      azKey: string
      segmentKey: string
      segmentName?: string
      labels: unknown[]
      nodeCount: number
      podCount: number
      status: string
      healthyStatus: string
      createTime: string
      observabilityLink: string
      metrics: {}
    }
  }

  /**
   * Interface name：GlobalController_listAllAZProperties
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=9864
   */
  'GET/ecpadmin/enums/azProperties': {
    Req: {
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: unknown[]
    }
  }

  /**
   * Interface name：GlobalController_listAllAZTypes
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=9865
   */
  'GET/ecpadmin/enums/azTypes': {
    Req: {
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: unknown[]
    }
  }

  /**
   * Interface name：GlobalController_listAllPlatforms
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8870
   */
  'GET/ecpadmin/enums/platform': {
    Req: {
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: string[]
    }
  }

  /**
   * Interface name：GlobalController_listAllClusterTypes
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8871
   */
  'GET/ecpadmin/enums/clusterType': {
    Req: {
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: string[]
    }
  }

  /**
   * Interface name：GlobalController_listAllAzs
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8872
   */
  'GET/ecpadmin/azs': {
    Req: {
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: {
        azKey: string
        complianceType?: string
        statefulness?: string
        region?: string
        labels: string[]
        segments: {
          segmentKey: string
          segmentName: string
        }[]
        azName: string
      }[]
    }
  }

  /**
   * Interface name：GlobalController_listAllSegmentNames
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8873
   */
  'GET/ecpadmin/segmentNames': {
    Req: {
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: {
        segmentKeys: string[]
        name: string
      }[]
    }
  }

  /**
   * Interface name：GlobalController_listAzSegments
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8874
   */
  'GET/ecpadmin/azSegments': {
    Req: {
      env?: string
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: {
        azKey: string
        segmentKey: string
        name: string
      }[]
    }
  }

  /**
   * Interface name：GlobalController_listEnvs
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8875
   */
  'GET/ecpadmin/envs': {
    Req: {
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: {
        alias: string
        name: string
        value: number
      }[]
    }
  }

  /**
   * Interface name：GlobalController_listCIDs
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8876
   */
  'GET/ecpadmin/cids': {
    Req: {
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: {
        name: string
        alias: string
        value: number
        visible: boolean
      }[]
    }
  }

  /**
   * Interface name：RbacController_accessControl
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1415&itf=8877
   */
  'GET/ecpadmin/rbac/accessControl': {
    Req: {
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      hasAccessPermission: boolean
    }
  }

  /**
   * Interface name：NodeController_listNodes
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1416&itf=8878
   */
  'GET/ecpadmin/clusters/{clusterId}/nodes': {
    Req: {
      clusterId: string
      offset?: string
      limit?: string
      orderBy?: string
      filterBy?: string
      searchBy?: string
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: {
        privateIP: string
        name: string
        status: string
        roles: string[]
        taints: {
          value: string
          effect: string
          key: string
        }[]
        labels: {
          key: string
          value: string
        }[]
        metrics: {
          memory: {
            total: number
            used: number
          }
          cpu: {
            total: number
            used: number
          }
          disk: {
            used: number
            total: number
          }
          gpu: {
            used: number
            total: number
          }
        }
        podSummary: {
          count: number
          capacity: number
        }
      }[]
      filterOptions: {
        roles: string[]
        status: {
          option: string
          totalCount: number
        }[]
      }
      totalCount: number
    }
  }

  /**
   * Interface name：SegmentController_listSegments
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1417&itf=8879
   */
  'GET/ecpadmin/segments': {
    Req: {
      offset?: string
      limit?: string
      orderBy?: string
      filterBy?: string
      searchBy?: string
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: {
        segmentId: string
        azName: string
        azKey?: string
        /**
         * 枚举值: High,Normal,Low
         */
        status: string
        property?: string
        cpu: {
          used: number
          applied: number
          total: number
        }
        name: string
        region?: string
        labels: string[]
        type?: string
        usedCPUPercentage: number
        memory: {
          applied: number
          used: number
          total: number
        }
        usedMemoryPercentage: number
        appliedMemoryPercentage: number
        appliedCPUPercentage: number
        segmentKey?: string
      }[]
      total?: number
    }
  }

  /**
   * Interface name：SegmentController_GetSegmentDetail
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1417&itf=8880
   */
  'GET/ecpadmin/segments/{segmentId}': {
    Req: {
      segmentId: string
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      azName: string
      azKey?: string
      segmentKey?: string
      segmentId: string
      name: string
      labels: string[]
      region?: string
      /**
       * 枚举值: High,Normal,Low
       */
      status: string
      property?: string
      type?: string
      cpu: {
        applied: number
        used: number
        total: number
      }
      memory: {
        used: number
        applied: number
        total: number
      }
      usedCPUPercentage: number
      appliedCPUPercentage: number
      usedMemoryPercentage: number
      appliedMemoryPercentage: number
    }
  }

  /**
   * Interface name：TenantController_listTenants
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1418&itf=8881
   */
  'GET/ecpadmin/tenants': {
    Req: {
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: {
        id: number
        managers?: {
          id: number
          email: string
          teamIds: number[]
        }[]
        name: string
      }[]
    }
  }

  /**
   * Interface name：ProjectController_listProjects
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1419&itf=8882
   */
  'GET/ecpadmin/projects': {
    Req: {
      tenantId: string
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: string[]
    }
  }

  /**
   * Interface name：ApplicationController_listApplications
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1420&itf=8883
   */
  'GET/ecpadmin/applications': {
    Req: {
      id: string
      /**
       * 枚举值: tenant,project
       */
      scope: string
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      items: string[]
    }
  }

  /**
   * Interface name：AppClusterConfigController_listAppClusterConfigs
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1568&itf=9731
   */
  'GET/ecpadmin/appClusterConfigs': {
    Req: {
      cmdbTenantId?: string
      pageNum?: string
      pageSize?: string
      filterBy?: string
      /**
       * scene key
       */
      __scene?: string
    }
    Res: {
      total: number
      items: {
        cmdbTenantId?: string
        clusterName?: string
        segmentKey?: string
        segment?: {
          azName: string
          azKey?: string
          segmentKey?: string
          segmentId: string
          name: string
          labels: string[]
          property?: string
          region?: string
          /**
           * 枚举值: High,Normal,Low
           */
          status: string
          type?: string
          cpu: {
            used: number
            applied: number
            total: number
          }
          memory: {
            used: number
            applied: number
            total: number
          }
          usedCPUPercentage: number
          usedMemoryPercentage: number
          appliedMemoryPercentage: number
          appliedCPUPercentage: number
        }
        scope?: string
        id?: string
        azKey?: string
        env?: string
        key?: string
        az?: {
          version?: string
          capability?: unknown[]
          name?: string
          clusters?: string[]
          env?: string
        }
        cid?: string
        clusterUuid?: string
      }[]
    }
  }

  /**
   * Interface name：AppClusterConfigController_addAppClusterConfigs
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1568&itf=9732
   */
  'POST/ecpadmin/appClusterConfigs:batchAdd': {
    Req: {
      configs: {
        env?: string
        segmentKey?: string
        clusterUuid?: string
        scope?: string
        key?: string
        cmdbTenantId?: string
        azKey?: string
      }[]
      /**
       * scene key
       */
      __scene?: string
      batchAdd?: string
    }
    Res: {
      ids: unknown[]
    }
  }

  /**
   * Interface name：AppClusterConfigController_removeAppClusterConfig
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1568&itf=9733
   */
  'DELETE/ecpadmin/appClusterConfigs/{id}': {
    Req: {
      /**
       * scene key
       */
      __scene?: string
      id?: string
    }
    Res: {}
  }

  /**
   * Interface name：AppClusterConfigController_removeAppClusterConfigs
   * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1568&itf=9734
   */
  'POST/ecpadmin/appClusterConfigs:batchRemove': {
    Req: {
      idList: string[]
      /**
       * scene key
       */
      __scene?: string
      batchRemove?: string
    }
    Res: {}
  }
}

type ResSelector<T> = T

export interface IResponseTypes {
  'GET/metrics': ResSelector<IModels['GET/metrics']['Res']>
  'POST/ecpadmin/clusters': ResSelector<IModels['POST/ecpadmin/clusters']['Res']>
  'GET/ecpadmin/clusters': ResSelector<IModels['GET/ecpadmin/clusters']['Res']>
  'GET/ecpadmin/clusters/metas': ResSelector<IModels['GET/ecpadmin/clusters/metas']['Res']>
  'GET/ecpadmin/clusters/{clusterId}': ResSelector<IModels['GET/ecpadmin/clusters/{clusterId}']['Res']>
  'GET/ecpadmin/enums/azProperties': ResSelector<IModels['GET/ecpadmin/enums/azProperties']['Res']>
  'GET/ecpadmin/enums/azTypes': ResSelector<IModels['GET/ecpadmin/enums/azTypes']['Res']>
  'GET/ecpadmin/enums/platform': ResSelector<IModels['GET/ecpadmin/enums/platform']['Res']>
  'GET/ecpadmin/enums/clusterType': ResSelector<IModels['GET/ecpadmin/enums/clusterType']['Res']>
  'GET/ecpadmin/azs': ResSelector<IModels['GET/ecpadmin/azs']['Res']>
  'GET/ecpadmin/segmentNames': ResSelector<IModels['GET/ecpadmin/segmentNames']['Res']>
  'GET/ecpadmin/azSegments': ResSelector<IModels['GET/ecpadmin/azSegments']['Res']>
  'GET/ecpadmin/envs': ResSelector<IModels['GET/ecpadmin/envs']['Res']>
  'GET/ecpadmin/cids': ResSelector<IModels['GET/ecpadmin/cids']['Res']>
  'GET/ecpadmin/rbac/accessControl': ResSelector<IModels['GET/ecpadmin/rbac/accessControl']['Res']>
  'GET/ecpadmin/clusters/{clusterId}/nodes': ResSelector<IModels['GET/ecpadmin/clusters/{clusterId}/nodes']['Res']>
  'GET/ecpadmin/segments': ResSelector<IModels['GET/ecpadmin/segments']['Res']>
  'GET/ecpadmin/segments/{segmentId}': ResSelector<IModels['GET/ecpadmin/segments/{segmentId}']['Res']>
  'GET/ecpadmin/tenants': ResSelector<IModels['GET/ecpadmin/tenants']['Res']>
  'GET/ecpadmin/projects': ResSelector<IModels['GET/ecpadmin/projects']['Res']>
  'GET/ecpadmin/applications': ResSelector<IModels['GET/ecpadmin/applications']['Res']>
  'GET/ecpadmin/appClusterConfigs': ResSelector<IModels['GET/ecpadmin/appClusterConfigs']['Res']>
  'POST/ecpadmin/appClusterConfigs:batchAdd': ResSelector<IModels['POST/ecpadmin/appClusterConfigs:batchAdd']['Res']>
  'DELETE/ecpadmin/appClusterConfigs/{id}': ResSelector<IModels['DELETE/ecpadmin/appClusterConfigs/{id}']['Res']>
  'POST/ecpadmin/appClusterConfigs:batchRemove': ResSelector<
    IModels['POST/ecpadmin/appClusterConfigs:batchRemove']['Res']
  >
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | 'HEAD'

export function createFetch(fetchConfig: commonLib.RequesterOption, extraConfig?: {fetchType?: commonLib.FetchType}) {
  if (!extraConfig || !extraConfig.fetchType) {
    console.warn(
      'Rapper Warning: createFetch API will be deprecated, if you want to customize fetch, please use overrideFetch instead, since new API guarantees better type consistency during frontend lifespan. See detail https://www.yuque.com/rap/rapper/overridefetch'
    )
  }
  const rapperFetch = commonLib.getRapperRequest(fetchConfig)

  function fetchMethod<T extends keyof IModels>(name: T) {
    type Method = T extends `${infer U}/${string}` ? U : never
    type URL = T extends `${RequestMethod}${infer U}` ? U : never
    const idx = name.indexOf('/')
    const method: Method = name.substring(0, idx)
    const url: URL = name.substring(idx)

    return (req?: IModels[T]['Req'], extra?: commonLib.IExtra) => {
      extra = extra || {}
      extra.reqType = {...(extra.reqType || {}), ...IReqType[name]}
      return rapperFetch({
        url,
        method,
        params: req,
        extra,
      }) as Promise<IResponseTypes[T]>
    }
  }

  return {
    /**
     * Interface name：PrometheusController_getMetrics
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1412&itf=8865
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/metrics': fetchMethod('GET/metrics'),

    /**
     * Interface name：ClusterController_addCluster
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1413&itf=8866
     * @param req request parameters
     * @param extra request config parameters
     */
    'POST/ecpadmin/clusters': fetchMethod('POST/ecpadmin/clusters'),

    /**
     * Interface name：ClusterController_listClusters
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1413&itf=8867
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/clusters': fetchMethod('GET/ecpadmin/clusters'),

    /**
     * Interface name：ClusterController_listClusterMetas
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1413&itf=8868
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/clusters/metas': fetchMethod('GET/ecpadmin/clusters/metas'),

    /**
     * Interface name：ClusterController_getClusterDetail
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1413&itf=8869
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/clusters/{clusterId}': fetchMethod('GET/ecpadmin/clusters/{clusterId}'),

    /**
     * Interface name：GlobalController_listAllAZProperties
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=9864
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/enums/azProperties': fetchMethod('GET/ecpadmin/enums/azProperties'),

    /**
     * Interface name：GlobalController_listAllAZTypes
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=9865
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/enums/azTypes': fetchMethod('GET/ecpadmin/enums/azTypes'),

    /**
     * Interface name：GlobalController_listAllPlatforms
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8870
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/enums/platform': fetchMethod('GET/ecpadmin/enums/platform'),

    /**
     * Interface name：GlobalController_listAllClusterTypes
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8871
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/enums/clusterType': fetchMethod('GET/ecpadmin/enums/clusterType'),

    /**
     * Interface name：GlobalController_listAllAzs
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8872
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/azs': fetchMethod('GET/ecpadmin/azs'),

    /**
     * Interface name：GlobalController_listAllSegmentNames
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8873
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/segmentNames': fetchMethod('GET/ecpadmin/segmentNames'),

    /**
     * Interface name：GlobalController_listAzSegments
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8874
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/azSegments': fetchMethod('GET/ecpadmin/azSegments'),

    /**
     * Interface name：GlobalController_listEnvs
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8875
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/envs': fetchMethod('GET/ecpadmin/envs'),

    /**
     * Interface name：GlobalController_listCIDs
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1414&itf=8876
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/cids': fetchMethod('GET/ecpadmin/cids'),

    /**
     * Interface name：RbacController_accessControl
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1415&itf=8877
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/rbac/accessControl': fetchMethod('GET/ecpadmin/rbac/accessControl'),

    /**
     * Interface name：NodeController_listNodes
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1416&itf=8878
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/clusters/{clusterId}/nodes': fetchMethod('GET/ecpadmin/clusters/{clusterId}/nodes'),

    /**
     * Interface name：SegmentController_listSegments
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1417&itf=8879
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/segments': fetchMethod('GET/ecpadmin/segments'),

    /**
     * Interface name：SegmentController_GetSegmentDetail
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1417&itf=8880
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/segments/{segmentId}': fetchMethod('GET/ecpadmin/segments/{segmentId}'),

    /**
     * Interface name：TenantController_listTenants
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1418&itf=8881
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/tenants': fetchMethod('GET/ecpadmin/tenants'),

    /**
     * Interface name：ProjectController_listProjects
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1419&itf=8882
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/projects': fetchMethod('GET/ecpadmin/projects'),

    /**
     * Interface name：ApplicationController_listApplications
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1420&itf=8883
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/applications': fetchMethod('GET/ecpadmin/applications'),

    /**
     * Interface name：AppClusterConfigController_listAppClusterConfigs
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1568&itf=9731
     * @param req request parameters
     * @param extra request config parameters
     */
    'GET/ecpadmin/appClusterConfigs': fetchMethod('GET/ecpadmin/appClusterConfigs'),

    /**
     * Interface name：AppClusterConfigController_addAppClusterConfigs
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1568&itf=9732
     * @param req request parameters
     * @param extra request config parameters
     */
    'POST/ecpadmin/appClusterConfigs:batchAdd': fetchMethod('POST/ecpadmin/appClusterConfigs:batchAdd'),

    /**
     * Interface name：AppClusterConfigController_removeAppClusterConfig
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1568&itf=9733
     * @param req request parameters
     * @param extra request config parameters
     */
    'DELETE/ecpadmin/appClusterConfigs/{id}': fetchMethod('DELETE/ecpadmin/appClusterConfigs/{id}'),

    /**
     * Interface name：AppClusterConfigController_removeAppClusterConfigs
     * Rap url: https://rap.shopee.io/repository/editor?id=211&mod=1568&itf=9734
     * @param req request parameters
     * @param extra request config parameters
     */
    'POST/ecpadmin/appClusterConfigs:batchRemove': fetchMethod('POST/ecpadmin/appClusterConfigs:batchRemove'),
  }
}
