import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { groupBy, pick, uniq, uniqWith } from 'ramda'

import { RESPONSE_CODE } from 'common/helpers/response'
import { OpenApiService } from 'common/modules/openApi/openApi.service'
import {
  DeployConfigParam,
  UpdateDeployConfigRequestBody,
  DeployConfig,
  Templateoverwrite,
  TemplateConfig,
  StrategyConfig,
  DeployAz,
  StrategyOverwrite,
  CidAzs,
  DeployDetail,
  Resource,
  ResourceDesc,
  Resources
} from 'deploy-config/dto/deploy-config.dto'
import {
  ICidAzs,
  IDeployAz,
  IGetDeployConfigRequest,
  IGetDeployConfigResponse,
  IInstance,
  IResource,
  IStrategyConfig,
  IStrategyOverwrite,
  ITemplateConfig,
  ITemplateoverwrite,
  IUpdateDeployConfigRequest,
  IUpdateDeployConfigResponse
} from 'deploy-config/dto/deploy-config-openapi.dto'

@Injectable()
export class DeployConfigService {
  constructor(private readonly openAPI: OpenApiService) {}

  async getDeployConfig(param: DeployConfigParam, env: string, token: string): Promise<DeployConfig> {
    const getDeployConfig: IGetDeployConfigRequest = {
      env,
      ...param
    }
    const result = await this.openAPI.getDeployConfig(getDeployConfig, token)
    if (!result || result.code !== RESPONSE_CODE.SUCCESS) {
      throw new InternalServerErrorException(result ? result.message : 'get deploy config error')
    }

    return this.generateDeployConfigVO(result)
  }

  async updateDeployConfig(
    param: DeployConfigParam,
    body: UpdateDeployConfigRequestBody,
    email: string,
    token: string
  ): Promise<IUpdateDeployConfigResponse> {
    const result = await this.openAPI.updateDeployConfig(
      this.generateUpdateDeployConfigRequest(body, param, email),
      token
    )
    return result
  }

  generateUpdateDeployConfigRequest(
    body: UpdateDeployConfigRequestBody,
    param: DeployConfigParam,
    email: string
  ): IUpdateDeployConfigRequest {
    const { env, strategy, template, deployAz, resources, version } = body

    // generate templateReq
    const templateReq: ITemplateConfig = {
      type: '',
      templateOverwrite: []
    }
    if (template) {
      templateReq.type = template.type
      if (Array.isArray(template.templateOverwriteList)) {
        templateReq.templateOverwrite = template.templateOverwriteList
          .map((t) => {
            let result: ITemplateoverwrite[] = []
            result = result.concat(
              t.clusters.map((cluster) => {
                const overwrite: ITemplateoverwrite = {
                  cid: t.cid,
                  type: t.type,
                  cluster
                }
                return overwrite
              })
            )
            return result
          })
          .reduce((pre, cur) => cur.concat(pre), [])
      }
    }
    if (!this.overwriteIsUniq(templateReq.templateOverwrite)) {
      throw new BadRequestException('component type overwrite is duplicate, please check your component type overwrite')
    }

    // generate strategyReq
    const strategyReq: IStrategyConfig = {
      type: '',
      rollingUpdate: {
        maxUnavailable: null,
        maxSurge: null
      },
      strategyOverwrite: []
    }
    if (strategy) {
      strategyReq.type = strategy.type
      strategyReq.rollingUpdate = strategy.rollingUpdate
      if (Array.isArray(strategy.strategyOverwrite)) {
        strategyReq.strategyOverwrite = strategy.strategyOverwrite
          .map((s) => {
            let strategyOverwriteList: IStrategyOverwrite[] = []
            strategyOverwriteList = strategyOverwriteList.concat(
              s.clusters.map((cluster) => {
                return {
                  cid: s.cid,
                  type: s.type,
                  cluster,
                  rollingUpdate: s.rollingUpdate
                }
              })
            )
            return strategyOverwriteList
          })
          .reduce((pre, cur) => cur.concat(pre), [])
      }
    }
    if (!this.overwriteIsUniq(strategyReq.strategyOverwrite)) {
      throw new BadRequestException('strategy type overwrite is duplicate, please check your strategy type overwrite')
    }

    // generate deployAzReq
    const deployAzReq: IDeployAz = {
      cidAzs: [],
      instance: []
    }
    if (deployAz && Array.isArray(deployAz.cidAzs)) {
      deployAzReq.cidAzs = deployAz.cidAzs
        .map((d) => {
          let cidAzs: ICidAzs[] = []
          cidAzs = cidAzs.concat(
            d.cids.map((cid) => {
              return {
                cid,
                azs: d.azs
              }
            })
          )
          return cidAzs
        })
        .reduce((pre, cur) => cur.concat(pre), [])
    }
    if (deployAz && Array.isArray(deployAz.deployDetailList)) {
      deployAzReq.instance = deployAz.deployDetailList
        .map((d) => {
          let instancelist: IInstance[] = []
          instancelist = instancelist.concat(
            d.instances.map((instance) => {
              return {
                cid: d.cid,
                ...instance
              }
            })
          )
          return instancelist
        })
        .reduce((pre, cur) => cur.concat(pre), [])
    }
    if (!this.deployAzIsUniq(deployAzReq)) {
      throw new BadRequestException('deplayAz is duplicate, please check your deployAz')
    }

    // generate resourcesReq
    const resourcesReq: IResource = {
      resource: {} as ResourceDesc,
      cidResource: {}
    }
    if (!this.resourcesCidsIsUniq(resources.cidResourceList)) {
      throw new BadRequestException('resources cid is duplicate, please check your resources cid')
    }

    if (resources) {
      resourcesReq.resource = resources.resource
      if (Array.isArray(resources.cidResourceList)) {
        resources.cidResourceList.forEach((c) => {
          c.cids.forEach((cid) => {
            resourcesReq.cidResource[cid] = c.resourceDesc
          })
        })
      }
    }

    const updateRequest: IUpdateDeployConfigRequest = {
      email,
      env,
      version,
      ...param,
      template: templateReq,
      strategy: strategyReq,
      deployAz: deployAzReq,
      resources: resourcesReq
    }
    return updateRequest
  }

  generateDeployConfigVO(res: IGetDeployConfigResponse): DeployConfig {
    const { template, strategy, deployAz, resources, version } = res
    // generate templateConfig
    const templateConfig: TemplateConfig = {
      type: '',
      templateOverwriteList: []
    }
    if (template) {
      templateConfig.type = template.type
      if (Array.isArray(template.templateOverwrite)) {
        const group = (t: ITemplateoverwrite) => t.cid + '_' + t.type
        const grouped = groupBy(group, template.templateOverwrite)
        templateConfig.templateOverwriteList = Object.keys(grouped).map((key) => {
          const overwrite: Templateoverwrite = {
            cid: grouped[key][0].cid,
            type: grouped[key][0].type,
            clusters: grouped[key].map((item) => item.cluster)
          }
          return overwrite
        })
      }
    }

    // generate strategyConfig
    const strategyConfig: StrategyConfig = {
      type: '',
      rollingUpdate: {
        maxSurge: null,
        maxUnavailable: null
      },
      strategyOverwrite: []
    }
    if (strategy) {
      strategyConfig.type = strategy.type
      strategyConfig.rollingUpdate = strategy.rollingUpdate
      if (Array.isArray(strategy.strategyOverwrite)) {
        const group = (t: IStrategyOverwrite) => {
          if (t.rollingUpdate) return `${t.cid}_${t.type}_${t.rollingUpdate.maxSurge}_${t.rollingUpdate.maxUnavailable}`
          return `${t.cid}_${t.type}`
        }
        const grouped = groupBy(group, strategy.strategyOverwrite)
        strategyConfig.strategyOverwrite = Object.keys(grouped).map((key) => {
          const overwrite: StrategyOverwrite = {
            cid: grouped[key][0].cid,
            type: grouped[key][0].type,
            clusters: grouped[key].map((item) => item.cluster),
            rollingUpdate: grouped[key][0].rollingUpdate
          }
          return overwrite
        })
      }
    }

    // generate deployAzConfig
    const deployAzConfig: DeployAz = {
      cidAzs: [],
      deployDetailList: []
    }
    if (deployAz) {
      if (Array.isArray(deployAz.cidAzs)) {
        const group = (t: ICidAzs) => t.azs.toString()
        const grouped = groupBy(group, deployAz.cidAzs)
        deployAzConfig.cidAzs = Object.keys(grouped).map((key) => {
          const cidAzs: CidAzs = {
            cids: grouped[key].map((item) => item.cid),
            azs: grouped[key][0].azs
          }
          return cidAzs
        })
      }
      if (Array.isArray(deployAz.instance)) {
        const group = (t: IInstance) => t.cid
        const grouped = groupBy(group, deployAz.instance)
        deployAzConfig.deployDetailList = Object.keys(grouped).map((key) => {
          const deployDetail: DeployDetail = {
            cid: key,
            instances: grouped[key].map((item) => {
              const instance = pick(['cluster', 'podCount', 'canaryInitCount', 'enableCanary'], item)
              return instance
            })
          }
          return deployDetail
        })
      }
    }

    // generate resources
    const resourcesList: Resources = {
      resource: {} as ResourceDesc,
      cidResourceList: []
    }
    if (resources) {
      resourcesList.resource = resources.resource
      if (resources.cidResource) {
        const instancelist = []
        Object.entries(resources.cidResource).forEach((item) => {
          instancelist.push({ cid: item[0], resourceDesc: item[1] })
        })
        const group = (t: any) => `instance_${t.resourceDesc.cpu}_${t.resourceDesc.memory}_${t.resourceDesc.gpu}`
        const grouped = groupBy(group, instancelist)
        resourcesList.cidResourceList = Object.keys(grouped).map((key) => {
          const resource: Resource = {
            cids: grouped[key].map((item) => item.cid),
            resourceDesc: grouped[key][0].resourceDesc
          }
          return resource
        })
      }
    }

    const deploy: DeployConfig = {
      enable: res.enable,
      syncWithLeap: res.syncWithLeap,
      template: templateConfig,
      strategy: strategyConfig,
      deployAz: deployAzConfig,
      resources: resourcesList,
      version
    }
    return deploy
  }

  private overwriteIsUniq(overwriteList: ITemplateoverwrite[] | IStrategyOverwrite[]): boolean {
    const uniqRes = uniqWith(
      (a: ITemplateoverwrite, b: ITemplateoverwrite) => a.cid === b.cid && a.cluster === b.cluster,
      overwriteList
    )
    return uniqRes.length === overwriteList.length
  }

  private deployAzIsUniq(deployAz: IDeployAz): boolean {
    type cidAz = {
      cid: string
      az: string
    }
    const cidAzList: cidAz[] = deployAz.cidAzs
      .map((c) => {
        let temp: cidAz[] = []
        temp = temp.concat(
          c.azs.map((az) => {
            return {
              cid: c.cid,
              az
            }
          })
        )
        return temp
      })
      .reduce((pre, cur) => cur.concat(pre), [])
    const uniqCidAzList = uniqWith((a: cidAz, b: cidAz) => a.cid === b.cid && a.az === b.az, cidAzList)

    const uniqInstance = uniqWith(
      (a: IInstance, b: IInstance) => a.cid === b.cid && a.cluster === b.cluster,
      deployAz.instance
    )
    return uniqInstance.length === deployAz.instance.length && cidAzList.length === uniqCidAzList.length
  }

  // cid must be uniq
  private resourcesCidsIsUniq(cidResourceList: Resource[]): boolean {
    const cids = cidResourceList.map((r) => r.cids).reduce((pre, cur) => cur.concat(pre), [])
    const uniqCids = uniq(cids)
    return uniqCids.length === cids.length
  }
}
