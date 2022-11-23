import axios, { AxiosInstance } from 'axios'
import * as BPromise from 'bluebird'
import { ConfigService } from '@nestjs/config'
import { IPipelineConfig } from 'common/interfaces/pipelineService.interface'
import { AUTH_SERVICE_COOKIE_KEY } from 'common/constants/sessions'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'

import {
  ListPipelineRunsParamsDto,
  ListPipelineRunsQueryDto,
  ListPipelineRunsResponseDto,
  ListPipelinesQueryDto,
  ListPipelinesResponseDto,
  PipelineItem,
  GetPipelineRunDetailParamsDto,
  GetPipelineDetailParamsDto,
  GetGitBranchesParamsDto,
  CreatePipelineRunParamsDto,
  CreatePipelineRunBodyDto,
  PipelineRunDetail,
  GetPipelineRunLogParamsDto,
  PipelineRunLog,
  RebuildPipelineRunParamsDto,
  AbortPipelineRunParamsDto,
  ConfirmPipelineRunBodyDto,
  ConfirmPipelineRunParamsDto,
  CreatePipelinesParamsDto,
  CreatePipelinesBodyDto,
  UpdatePipelinesParamsDto,
  UpdatePipelinesBodyDto,
  PipelineConfig,
  PipelineRunItem,
  ImportPipelinesParamsDto,
  ImportPipelinesBodyDto,
  MovePipelineBodyDto,
  MovePipelineParamsDto,
  AbortPendingPipelineParamsDto,
  PipelineResponse,
  PipelineEngine,
  PipelineMigrationItem,
  BatchMigratePipelineResponseDto,
  GetPipelineRunResultParamsDto,
  PipelineRunResult,
  GetPipelineRunResultQueryDto
} from './dto/pipelines.dto'
import { DEFAULT_LIMIT, DEFAULT_OFFSET, DEFAULT_PIPELINE_CONFIG, MAX_LIMIT, TEMPLATE } from 'common/constants/pipeline'
import { parseFiltersMap } from 'common/helpers/filter'
import { FreezesService } from 'release-freezes-management/freezes.service'
import { envToLiveOrNonLive } from 'common/helpers/env'
import { RELEASE_FREEZE_ENV } from 'common/constants/env'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class PipelinesService {
  private readonly logger = new Logger(PipelinesService.name)

  constructor(private configService: ConfigService, private readonly freezeService: FreezesService) {}

  async getPipelineClient(token: string): Promise<AxiosInstance> {
    const pipelineConfig = this.configService.get<IPipelineConfig>('pipeline')
    if (!pipelineConfig) {
      throw new Error('Can not get pipeline service config!')
    }

    const { protocol, host, port, prefix } = pipelineConfig
    let baseURL = port ? `${protocol}://${host}:${port}` : `${protocol}://${host}`
    baseURL = prefix ? `${baseURL}/${prefix}` : baseURL

    const instance = axios.create({
      baseURL,
      timeout: 60 * 1000,
      headers: {
        'Content-Type': 'application/json',
        [AUTH_SERVICE_COOKIE_KEY]: `Bareer ${token}`
      }
    })

    instance.interceptors.response.use(
      (response) => {
        const result = response.data
        if (result.retcode !== 0) {
          this.logger.error(`pipeline handler failed: ${result}`)
          throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return result
      },
      (error) => {
        if (error.response && error.response.data) {
          const msg = 'failed from pipeline server'
          this.logger.error(`${msg},${error.response.data}`)
          throw new HttpException(error.response.data.message || msg, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        this.logger.error(`failed to get response from pipepline: ${error.toJSON()}`)
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    )
    return instance
  }

  async getPipelinesList(
    tenantId: number,
    query: ListPipelinesQueryDto,
    authToken: string
  ): Promise<ListPipelinesResponseDto> {
    const { offset, limit = DEFAULT_LIMIT, filterBy } = query
    const queryObject = parseFiltersMap(filterBy)
    const { pipelineName = [], projectName = [], env = [], engine = [] } = queryObject

    const piplineClient = await this.getPipelineClient(authToken)
    const opt = {
      url: `/v1/jenkins/tenants/${tenantId}/pipelines`,
      params: {
        limit: limit ? Number(limit) : DEFAULT_LIMIT,
        offset: offset ? Number(offset) : 0,
        q: pipelineName[0],
        'project[eq]': projectName[0],
        'env[eq]': env[0],
        'engine[eq]': engine[0]
      }
    }
    const result: any = await piplineClient.request(opt)

    const liveLastFreeze = await this.freezeService.getLastReleaseFreeze(authToken, RELEASE_FREEZE_ENV.LIVE)
    const nonLiveLastFreeze = await this.freezeService.getLastReleaseFreeze(authToken, RELEASE_FREEZE_ENV.NON_LIVE)

    const pipelines = await BPromise.resolve(result.data).map(async (item) => {
      const { name, project, module: pipelineModule, env, lastRun } = item
      const binaryEnv = envToLiveOrNonLive(env)
      const isFreezing =
        binaryEnv === RELEASE_FREEZE_ENV.LIVE ? liveLastFreeze.isFreezing : nonLiveLastFreeze.isFreezing
      const pipelineInfo = {
        id: item.id,
        engine: item.engine,
        pipelineName: name,
        project,
        module: pipelineModule,
        env,
        lastExecuteStatus: lastRun ? lastRun.status : '',
        lastExecutor: lastRun ? lastRun.executor : '',
        lastExecuteId: lastRun ? lastRun.id : '',
        lastExecuteTime: (lastRun && lastRun.executeTime) || '',
        isFreezing: isFreezing
      }
      return pipelineInfo
    })
    return {
      pipelines,
      totalSize: result.pagination.total,
      offset: result.pagination.offset,
      limit: result.pagination.limit
    }
  }

  generatePipelineConfig(env: string, pipelineConfig: PipelineConfig) {
    const configStr = `@Library(&quot;${pipelineConfig.pipelineTemplate}&quot;) _
import com.shopee.* 
env.DEPLOY_DEFINITION="${pipelineConfig.deployDefinition || DEFAULT_PIPELINE_CONFIG.DEPLOY_DEFINITION}"
env.ENVIRONMENT="${env}"
env.GIT_REPO="${pipelineConfig.gitRepo || ''}"
env.K8S_GROUP="${pipelineConfig.tenantName || ''}"
env.DEPLOY_TO_K8S_ONLY=${pipelineConfig.deployToK8sOnly || false}
env.DEPLOY_TO_K8S=${pipelineConfig.deployToK8s || false}
env.K8S_REPLICAS=${pipelineConfig.k8sReplicas || DEFAULT_PIPELINE_CONFIG.K8S_REPLICAS}
env.K8S_CANARY_REPLICAS=${pipelineConfig.k8sCanaryReplicas || DEFAULT_PIPELINE_CONFIG.K8S_CANARY_REPLICAS}
env.EXTRA_HOSTS=${pipelineConfig.extraHosts || ''}
env.K8S_USE_ACTUAL_IDC=${pipelineConfig.k8sUseActualIDC}
env.K8S_KEEP_SMB_SMOKE=${pipelineConfig.k8sKeepSMBSmoke}
env.K8S_MESOSZK=${pipelineConfig.k8sMesosZK}
env.K8S_MAX_SURGE="${pipelineConfig.k8sMaxSurge || DEFAULT_PIPELINE_CONFIG.K8S_MAX_SURGE}"
env.K8S_MAX_UNAVAILABLE="${pipelineConfig.k8sMaxUnavailable || DEFAULT_PIPELINE_CONFIG.K8S_MAX_UNAVALIABLE}"
env.K8S_CANARY_PERCENTAGE="${pipelineConfig.k8sCanaryPercentage || DEFAULT_PIPELINE_CONFIG.K8S_CANARY_PERCENTAGE}"
env.PLATFORMCLUSTER="${pipelineConfig.platformCluster[env]}"
env.TERMINATION_GRACE_PERIOD_SECONDS=${
      pipelineConfig.terminationGracePeriodSeconds || DEFAULT_PIPELINE_CONFIG.TERMINATION_GRACE_PERIOD_SECONDS
    }
new stdPipeline().execute()
`
    return configStr
  }

  parsePipelineConfig(str: string) {
    const arr = str.split('\n')

    const configObj: any = {}

    arr.map((item) => {
      if (!item || item.startsWith('//')) {
        return false
      }

      if (item.startsWith('@Library')) {
        const match = /@Library\(\"(.*)\"\)/.exec(item)
        if (!match) {
          return false
        }
        configObj.PipelineTemplate = match[1]
      }
      if (item.startsWith('env.')) {
        const match = /env\.(.*)\s*=\s*\"*(.*)\"*$/.exec(item)

        if (!match) {
          return false
        }
        const value = match[2]
        configObj[match[1].trim()] =
          value.charAt(value.length - 1) !== '"' ? value : value.substring(0, value.length - 1)
      }
      return false
    })
    configObj.DetailConfig = str
    return configObj
  }

  async createPipelines(params: CreatePipelinesParamsDto, body: CreatePipelinesBodyDto, token: string) {
    const { tenantId } = params
    const { project, module: pipelineModule, pipelineConfig, parameterDefinitions, envs, engines } = body
    const failedCases: string[] = []
    await BPromise.resolve(envs).map(async (env) => {
      try {
        const configStr =
          pipelineConfig.pipelineTemplate === TEMPLATE.K8S_TEMPLATE
            ? this.generatePipelineConfig(env, pipelineConfig)
            : pipelineConfig.detailConfig
        const payload = {
          project,
          module: pipelineModule || '',
          env: env,
          engine: engines[env],
          config: configStr,
          parameterDefinitions
        }

        const piplineClient = await this.getPipelineClient(token)
        const url = `/v1/jenkins/tenants/${tenantId}/pipelines`
        const result: any = await piplineClient.post(url, payload)

        return result.data || {}
      } catch (err) {
        failedCases.push(`${env}: ${err.message}`)
      }
    })

    if (failedCases.length > 0) {
      throw new HttpException(`failed to create pipeline: ${failedCases.join(',')}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return {}
  }

  async updatePipelines(
    params: UpdatePipelinesParamsDto,
    body: UpdatePipelinesBodyDto,
    token: string
  ): Promise<PipelineItem> {
    const { pipelineName, tenantId } = params

    const { env, module: pipelineModule, pipelineConfig, parameterDefinitions } = body
    const configStr =
      pipelineConfig.pipelineTemplate === TEMPLATE.K8S_TEMPLATE
        ? this.generatePipelineConfig(env, pipelineConfig)
        : pipelineConfig.detailConfig
    const payload = {
      module: pipelineModule || '',
      config: configStr,
      parameterDefinitions
    }
    const piplineClient = await this.getPipelineClient(token)
    const url = `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}`
    const result: any = await piplineClient.post(url, payload)
    return result.data || {}
  }

  async getPipelineDetail(params: GetPipelineDetailParamsDto, token: string) {
    const { pipelineName, tenantId } = params

    const piplineClient = await this.getPipelineClient(token)
    const opt = {
      url: `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}`
    }
    const result: PipelineResponse = await piplineClient.request(opt)
    if (!result.data) return {}

    const pipelineDetail = result.data
    const pipelineConfig = this.parsePipelineConfig(pipelineDetail.config)
    pipelineDetail.config = pipelineConfig

    if (!pipelineDetail.env) {
      const nameArray = pipelineDetail.name.split('-')
      const env = nameArray[nameArray.length - 1]
      pipelineDetail.env = env
    }
    const standardTemplates = [TEMPLATE.K8S_TEMPLATE, TEMPLATE.NON_K8S_TEMPLATE]
    pipelineDetail.isCustom = !standardTemplates.includes(pipelineDetail?.config?.PipelineTemplate)
    return pipelineDetail
  }

  async getGitBranches(params: GetGitBranchesParamsDto, token: string) {
    const { pipelineName, tenantId } = params

    const piplineClient = await this.getPipelineClient(token)
    const opt = {
      url: `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}/gitBranches`
    }
    const result: any = await piplineClient.request(opt)

    return result.data || []
  }

  async createPipelineRuns(params: CreatePipelineRunParamsDto, body: CreatePipelineRunBodyDto, token: string) {
    const { pipelineName, tenantId } = params

    const piplineClient = await this.getPipelineClient(token)
    const url = `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}/pipelineRuns`
    const result: any = await piplineClient.post(url, body)
    return result.data || {}
  }

  async getPipelineRunList(
    params: ListPipelineRunsParamsDto,
    query: ListPipelineRunsQueryDto,
    token: string
  ): Promise<ListPipelineRunsResponseDto> {
    const { pipelineName, tenantId } = params
    const { offset, limit = DEFAULT_LIMIT, filterBy } = query
    const queryObject = parseFiltersMap(filterBy)

    const { all = [] } = queryObject

    const piplineClient = await this.getPipelineClient(token)
    const opt = {
      url: `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}/pipelineRuns`,
      params: {
        limit: limit ? Number(limit) : DEFAULT_LIMIT,
        offset: offset ? Number(offset) : DEFAULT_OFFSET,
        q: all[0]
      }
    }
    const result: any = await piplineClient.request(opt)
    const runs = result.data
      ? result.data.map((item) => {
          const runInfo: PipelineRunItem = {
            id: item.id,
            queueItemID: item.queueItemID,
            status: item.status,
            executor: item.executor,
            executeTime: item.executeTime,
            displayName: item.displayName,
            parameters: item.parameters
          }
          return runInfo
        })
      : []
    return {
      items: runs,
      totalSize: result.pagination ? result.pagination.total : 0,
      offset: result.pagination ? result.pagination.offset : 0,
      limit: result.pagination ? result.pagination.limit : 0
    }
  }

  async getPipelineRunDetail(params: GetPipelineRunDetailParamsDto, token: string): Promise<PipelineRunDetail> {
    const { pipelineName, tenantId, runId } = params

    const piplineClient = await this.getPipelineClient(token)
    const opt = {
      url: `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}/pipelineRuns/${runId}`
    }
    const result: any = await piplineClient.request(opt)

    return result.data
  }

  async getPipelineRunResult(
    params: GetPipelineRunResultParamsDto,
    query: GetPipelineRunResultQueryDto,
    token: string
  ): Promise<PipelineRunResult> {
    const { pipelineName, tenantId, runId } = params
    const { engine } = query
    const piplineClient = await this.getPipelineClient(token)
    const opt = {
      url: `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}/pipelineRuns/${runId}/result`,
      params: {
        engine
      }
    }
    const result: PipelineResponse = await piplineClient.request(opt)

    return result.data || {}
  }

  async getPipelineRunLog(params: GetPipelineRunLogParamsDto, token: string): Promise<PipelineRunLog> {
    const { pipelineName, tenantId, runId, stepId } = params

    const piplineClient = await this.getPipelineClient(token)
    const opt = {
      url: `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}/pipelineRuns/${runId}/steps/${stepId}/log`
    }
    const result: any = await piplineClient.request(opt)

    return result.data
  }

  async abortPipelineRun(params: AbortPipelineRunParamsDto, token: string) {
    const { pipelineName, tenantId, runId } = params

    const piplineClient = await this.getPipelineClient(token)
    const url = `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}/pipelineRuns/${runId}/abort`
    const result: any = await piplineClient.post(url)
    return result.data || {}
  }

  async abortPendingPipeline(params: AbortPendingPipelineParamsDto, token: string) {
    const { pipelineName, tenantId, queueId } = params

    const piplineClient = await this.getPipelineClient(token)
    const url = `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}/queueItems/${queueId}/abort`
    const result: any = await piplineClient.post(url)
    return result.data || {}
  }

  async rebuildPipelineRun(params: RebuildPipelineRunParamsDto, token: string) {
    const { pipelineName, tenantId, runId } = params

    const piplineClient = await this.getPipelineClient(token)
    const url = `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}/pipelineRuns/${runId}/rerun`
    const result: any = await piplineClient.post(url)
    return result.data || {}
  }

  async confirmPipelineRun(params: ConfirmPipelineRunParamsDto, body: ConfirmPipelineRunBodyDto, token: string) {
    const { pipelineName, tenantId, runId } = params

    const piplineClient = await this.getPipelineClient(token)
    const url = `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}/pipelineRuns/${runId}/inputSubmit`
    const result: any = await piplineClient.post(url, body)
    return result.data || {}
  }

  async importPipelines(params: ImportPipelinesParamsDto, body: ImportPipelinesBodyDto, token: string) {
    const { tenantId } = params
    const { project, engine, names } = body

    try {
      const payload = {
        project,
        engine: engine.toLowerCase(),
        names
      }
      const piplineClient = await this.getPipelineClient(token)
      const url = `/v1/jenkins/tenants/${tenantId}/pipelines/batchImport`
      const result: any = await piplineClient.post(url, payload)

      return result.data || {}
    } catch (err) {
      throw new HttpException(`failed to import pipelines: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async movePipeline(params: MovePipelineParamsDto, body: MovePipelineBodyDto, token: string) {
    const { tenantId, pipelineName } = params
    const { targetTenantId } = body

    try {
      const payload = {
        tenantID: targetTenantId
      }
      const piplineClient = await this.getPipelineClient(token)
      const url = `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}`
      const result: any = await piplineClient.patch(url, payload)

      return result.data || {}
    } catch (err) {
      throw new HttpException(`failed to move pipeline: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getPipelineEngines(authToken: string): Promise<PipelineEngine[]> {
    const piplineClient = await this.getPipelineClient(authToken)
    const opt = { url: '/v1/engines' }
    const result: PipelineResponse = await piplineClient.request(opt)

    return result.data
  }

  async getAllPipelines(tenantId: number, filterBy: string, authToken: string): Promise<string[]> {
    const queryObject = parseFiltersMap(filterBy)
    const { pipelineName = [], projectName = [], engine = [] } = queryObject

    const piplineClient = await this.getPipelineClient(authToken)
    const opt = {
      url: `/v1/jenkins/tenants/${tenantId}/pipelines`,
      params: {
        q: pipelineName[0],
        'project[eq]': projectName[0],
        limit: MAX_LIMIT,
        'engine[eq]': engine[0]
      }
    }

    const result: PipelineResponse = await piplineClient.request(opt)
    if (!result || !result.data) {
      return []
    }
    return result.data.map((item) => item.id)
  }

  async migratePipeline(
    tenantId: number,
    pipelineName: string,
    destEngine: string,
    operator: string,
    authToken: string
  ): Promise<string[]> {
    const piplineClient = await this.getPipelineClient(authToken)
    const url = `/v1/jenkins/tenants/${tenantId}/pipelines/${pipelineName}/migrate`
    const payload = { dstEngine: destEngine, operator }
    const result: PipelineResponse = await piplineClient.post(url, payload)
    return result.data || {}
  }

  async getPipelineMigrations(tenantId: number, operator: string, authToken: string): Promise<PipelineMigrationItem[]> {
    const piplineClient = await this.getPipelineClient(authToken)
    const opt = {
      url: `/v1/jenkins/tenants/${tenantId}/migrations`,
      params: { operator }
    }
    const result: PipelineResponse = await piplineClient.request(opt)

    let migrations = result.data || []
    if (migrations.length > 1) {
      migrations = migrations.map((item) => {
        item.destEngine = item.dstEngine
        return item
      })
    }
    return migrations
  }

  async batchMigratePipelines(
    tenantId: number,
    pipelines: string[],
    operator: string,
    destEngine: string,
    authToken: string
  ): Promise<BatchMigratePipelineResponseDto> {
    const piplineClient = await this.getPipelineClient(authToken)
    const url = `/v1/jenkins/tenants/${tenantId}/migrations`
    const payload = {
      srcPipelineIDs: pipelines,
      dstEngine: destEngine,
      operator
    }
    const result: PipelineResponse = await piplineClient.post(url, payload)

    return result.data || {}
  }
}
