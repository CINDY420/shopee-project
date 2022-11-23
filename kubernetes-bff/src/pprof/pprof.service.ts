import { Injectable } from '@nestjs/common'
import * as moment from 'moment'

import {
  CONVERT_PROFILING_TYPE,
  CreatePprofDTO,
  GetPprofListQuery,
  IGetProfDescriptorsRequest,
  PROFILING_STATUS
} from 'pprof/dto/pprof.dto'
import { IProfDescriptor } from 'pprof/dto/pprof.entity'
import { ESService } from 'common/modules/es/es.service'
import { PROF_DESCRIPTOR_SUFFIX } from 'common/constants/apiServer.constants'
import { ESIndex, ES_DEFAULT_OFFSET, ES_DEFAULT_COUNT } from 'common/constants/es'
import { IEsBooleanQuery } from 'common/interfaces'
import { parseFiltersMap } from 'common/helpers/filter'
import { ClientManagerService } from 'common/modules/client-manager/client-manager.service'
import { ClustersService } from 'platform-management/clusters/clusters.service'
import { AgentService } from 'common/modules/agent/agent.service'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class PprofService {
  private logger: Logger = new Logger(PprofService.name)

  constructor(
    private readonly esService: ESService,
    private readonly clientManager: ClientManagerService,
    private readonly clusterService: ClustersService,
    private readonly agentService: AgentService
  ) {}

  async createPprofCrd(params: CreatePprofDTO, operator: string) {
    const day = moment().format('YYYYMMDDHHMMss')
    const cluster = await this.clusterService.findByName(params.cluster)
    const { config, name: clusterName } = cluster
    const labels = JSON.stringify({
      projectName: params.projectName,
      appName: params.appName,
      deployName: params.deployName,
      podName: params.podName,
      podIp: params.podIP,
      env: params.env,
      // a valid label must be consist of alphanumeric characters, '-', '_' or '.'
      // so replace '@' with '_'
      operator: operator.replace('@', '_')
    })
    const name = `${params.podName}-${day}-${PROF_DESCRIPTOR_SUFFIX}`
    const body = {
      name,
      labels,
      namespace: params.namespace,
      ip: params.podIP,
      port: params.port,
      duration: params.sampleTime,
      profileType: CONVERT_PROFILING_TYPE[params.object]
    }
    await this.agentService.request('createpprof', false, { config, clusterName }, body)
  }

  async getPprofList(request: IGetProfDescriptorsRequest, query: GetPprofListQuery) {
    const booleanQuery: IEsBooleanQuery = this.generateBooleanQuery(request, query.filterBy)
    const sort = query.orderBy ? query.orderBy.replace(' ', ':') : 'createdTime:desc'
    const result = await this.esService.booleanQueryAll<IProfDescriptor>(
      ESIndex.PROF_DESCRIPTOR,
      booleanQuery,
      query.limit || ES_DEFAULT_COUNT,
      query.offset || ES_DEFAULT_OFFSET,
      [sort]
    )
    // convert document.object
    if (result?.documents) {
      result.documents.forEach((document) => {
        const converts = Object.entries(CONVERT_PROFILING_TYPE)
        const obj = converts.find((c) => c[1] === document.object)
        if (obj) {
          document.object = obj[0]
        }
        document.status = document.status || PROFILING_STATUS.Running
      })
    }
    return result
  }

  async getPprof(request: IGetProfDescriptorsRequest) {
    const query: IEsBooleanQuery = this.generateBooleanQuery(request)
    const { documents } = await this.esService.booleanQueryAll<IProfDescriptor>(
      ESIndex.PROF_DESCRIPTOR,
      query,
      ES_DEFAULT_COUNT,
      ES_DEFAULT_OFFSET,
      ['createdTime']
    )
    if (documents) {
      return documents[0]
    }
  }

  private generateBooleanQuery(request: IGetProfDescriptorsRequest, filterBy?: string) {
    const booleanQuery: IEsBooleanQuery = {}
    const queryFiled = parseFiltersMap(filterBy)
    const matchList = Object.keys(request).map((k) => {
      return {
        match: {
          [k]: request[k]
        }
      }
    })

    const wildCardList = Object.keys(queryFiled).map((k) => {
      // convert profiling type
      if (k === 'object') {
        return {
          wildcard: {
            [k]: `*${CONVERT_PROFILING_TYPE[queryFiled[k].toString()]}*`
          }
        }
      }
      return {
        wildcard: {
          [k]: `*${queryFiled[k]}*`
        }
      }
    })
    booleanQuery.must = matchList.concat(wildCardList as any)
    return booleanQuery
  }
}
