import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/shared/open-api/open-api.service'
import {
  ListSdusParams,
  ListSdusQuery,
  Sdu,
  SduAZ,
  ListAllAzSdusParams,
  SduItem,
  AzSdu,
  GetSduAzsParams,
} from '@/features/sdu/dto/sdu.dto'
import { IOpenApiSdu, AZ_TYPE, IOpenApiListAllSdusResponse } from '@/shared/open-api/interfaces/sdu'
import { ConfigService } from '@nestjs/config'
import { IDeleteDeploymentConfig } from '@/common/interfaces/config'
import { ListQuery } from '@/common/models/dtos/list-query.dto'
import { HPAWithId } from '@/features/hpa/entities/hpa.entity'
import { splitFEEnvsToCommonAndPhaseEnvs } from '@/common/helpers/deployment'
import { allPhaseEnvs } from '@/common/constants/deployment'
import { formatOpenApiHpa } from '@/common/helpers/hpa'
import { liveEnvs } from '@/common/constants/sdu'
import { throwError } from '@/common/utils/throw-error'
import { ERROR } from '@/common/constants/error'
interface IAzSduListMap {
  [azName: string]: SduItem[]
}

interface ISduAzListMap {
  [sduName: string]: { azList: SduAZ[]; instancesCount: number }
}

interface IFilterSdusFilters {
  filterEnvs: string[]
  filterCids: string[]
  filterAzs: string[]
  filterComponentTypes: string[]
}

@Injectable()
export class SduService {
  constructor(private readonly openApiService: OpenApiService, private configService: ConfigService) {}

  async listSdus(listSdusParams: ListSdusParams, listSdusQuery: ListSdusQuery) {
    const { orderBy, filterBy } = listSdusQuery
    const { sdus: allSdus, componentTypes } = await this.openApiService.listAllSdus(listSdusParams)
    const filters = ListQuery.parseMustFiltersToKeyValuesMap(filterBy)

    const {
      envs: filterEnvs = [],
      cids: filterCids = [],
      azs: filterAzs = [],
      componentTypes: filterComponentTypes = [],
    } = filters

    const filteredSdus = this.filterSdus(allSdus, { filterEnvs, filterCids, filterAzs, filterComponentTypes })
    const sduAzListMap = this.collectSameSduAzs(filteredSdus, listSdusParams.projectName)
    const formattedSduList = this.transformSduAzListMapToSduList(sduAzListMap)
    const sortedSduList = this.sortSduList(formattedSduList, orderBy)
    return {
      items: sortedSduList,
      allComponentTypeDisplays: componentTypes,
    }
  }

  private filterSdus(sdus: IOpenApiSdu[], filters: IFilterSdusFilters): IOpenApiSdu[] {
    const { filterEnvs = [], filterCids = [], filterAzs = [], filterComponentTypes = [] } = filters
    // env filter should consider deployment phase, because fte and pfb deployments are recognized by phase
    const { commonEnvs: commonFilterEnvs, phaseEnvs: phaseFilterEnvs } = splitFEEnvsToCommonAndPhaseEnvs(filterEnvs)
    const filteredCommonSdus: IOpenApiSdu[] = []
    const filteredFteOrPfbSdus: IOpenApiSdu[] = []
    sdus.forEach((sdu) => {
      const { phase, env, cid, az, componentTypeDisplay } = sdu
      const isFilteredSdu =
        (filterCids.length === 0 || filterCids.includes(cid.toUpperCase())) &&
        (filterAzs.length === 0 || filterAzs.includes(az.name)) &&
        (filterComponentTypes.length === 0 || filterComponentTypes.includes(componentTypeDisplay))
      if (!isFilteredSdu) {
        return
      }
      // the phase of fte or pfb deployment has 'fte' or 'pfb' prefix
      const isFteOrPfb = allPhaseEnvs.some((phaseEnv) => phase.startsWith(phaseEnv.toLowerCase()))
      if (isFteOrPfb) {
        const isFilteredFteOrPfbSdu =
          filterEnvs.length === 0 || phaseFilterEnvs.some((phaseEnv) => phase.startsWith(phaseEnv.toLowerCase()))

        if (isFilteredFteOrPfbSdu) {
          filteredFteOrPfbSdus.push(sdu)
        }
      } else {
        const isFilteredCommonSdu = filterEnvs.length === 0 || commonFilterEnvs.includes(env.toUpperCase())

        if (isFilteredCommonSdu) {
          filteredCommonSdus.push(sdu)
        }
      }
    })

    const filteredSdus = [...filteredCommonSdus, ...filteredFteOrPfbSdus]
    return filteredSdus
  }

  private collectSameSduAzs(openApiSdus: IOpenApiSdu[], projectName: string): ISduAzListMap {
    const sduAzListMap: ISduAzListMap = {}
    const deleteDeploymentConfig = this.configService.get<IDeleteDeploymentConfig>('globalV3.deleteDeploymentConfig')
    const { allowDeleteClusters = [], prohibitDeleteProjects = [] } = deleteDeploymentConfig || {}
    // collect azs with same sdu name into map
    openApiSdus.forEach((openApiSdu) => {
      const {
        name: sduName,
        type,
        env,
        cid,
        az,
        componentType,
        componentTypeDisplay,
        instance,
        healthy,
        status,
        updateTime,
        phase,
        tag,
        unhealthyCount,
        scalable: canScale,
        rollbackable: canRollback,
        fullreleaseable: canFullRelease,
        restartable: canRestart,
        appInstanceName,
        monitoringClusterName,
        releaseCount,
        canaryCount,
        clusterId,
        containers,
      } = openApiSdu
      const { name: azName, clusters } = az
      // clusters array only contains one cluster in fact
      const cluster = clusters.length !== 0 ? clusters[0] : undefined
      const podCount = releaseCount + canaryCount
      const canDelete =
        typeof cluster === 'string' &&
        allowDeleteClusters.includes(cluster) &&
        !prohibitDeleteProjects.includes(projectName) &&
        podCount === 0

      const formattedAz: SduAZ = {
        name: azName,
        type,
        env,
        cid,
        cluster,
        componentType,
        componentTypeDisplay,
        instance,
        status,
        healthy,
        unhealthyCount,
        phase,
        tag,
        updateTime,
        canScale,
        canRollback,
        canFullRelease,
        canRestart,
        canDelete: type === AZ_TYPE.KUBERNETES ? canDelete : false,
        appInstanceName,
        releaseCount,
        canaryCount,
        clusterId,
        containers,
        monitoringClusterName,
      }
      if (!sduAzListMap[sduName]) {
        sduAzListMap[sduName] = { azList: [formattedAz], instancesCount: 0 }
      } else {
        sduAzListMap[sduName].azList.push(formattedAz)
      }
      sduAzListMap[sduName].instancesCount += instance
    })

    return sduAzListMap
  }

  private transformSduAzListMapToSduList(sduAzListMap: ISduAzListMap): Sdu[] {
    const sduList = Object.entries(sduAzListMap).map(([sduName, azs]) => ({
      name: sduName,
      instancesCount: azs.instancesCount,
      azs: azs.azList,
    }))
    return sduList
  }

  async listAllAzSdus(listAllAzSdusParams: ListAllAzSdusParams) {
    const allSdus = await this.openApiService.listAllSdus(listAllAzSdusParams)
    const { lists: openApiHpaList } = await this.openApiService.listHPARules(listAllAzSdusParams, {})
    const hpaList = openApiHpaList.map(({ id, ...hpa }) => ({ id, ...formatOpenApiHpa(hpa) }))
    const azSdusListMap = this.collectSameAzSdus(allSdus, hpaList)
    const formattedSduList = this.transformAzSdusListMapToSduList(azSdusListMap)
    return {
      items: formattedSduList,
    }
  }

  private collectSameAzSdus(allSdus: IOpenApiListAllSdusResponse, hpaList: HPAWithId[]): IAzSduListMap {
    const azSduListMap: IAzSduListMap = {}

    allSdus.sdus.forEach((sdu) => {
      const { name: sduName, type, az, env } = sdu
      const { name: azName } = az

      const hasHpa = hpaList.some((hpaItem) => hpaItem.meta.az === azName && hpaItem.meta.sdu === sduName)

      const formattedSdu: SduItem = {
        sduName,
        hasHpa,
      }
      if (!azSduListMap[azName]) {
        azSduListMap[azName] = []
      }

      // Filter out live sdu if config map does not support
      const disableLiveHpa = this.configService.get<string>('globalV3.disableLiveHpa')
      const shouldDisableLive = disableLiveHpa === 'true'
      const isLiveSdu = liveEnvs.includes(env)
      if (shouldDisableLive && isLiveSdu) {
        return
      }

      const isExisted = azSduListMap[azName].some((item) => formattedSdu.sduName === item.sduName)
      if (type === AZ_TYPE.KUBERNETES && !isExisted) {
        azSduListMap[azName].push(formattedSdu)
      }
    })
    return azSduListMap
  }

  private transformAzSdusListMapToSduList(azSduListMap: IAzSduListMap): AzSdu[] {
    const sduList = Object.entries(azSduListMap).map(([azName, sduList]) => ({
      azName,
      sdus: sduList,
    }))
    const filteredSduList = sduList.filter((item) => item.sdus.length !== 0)
    return filteredSduList
  }

  private sortSduList(sdus: Sdu[], orderBy?: string): Sdu[] {
    let sortedSdus = sdus
    const isDesc = orderBy?.includes('updateTime desc')
    sortedSdus = sdus.sort((currentItem, previousItem) => {
      // sort sdu by the first az item updateTime
      const { updateTime: currentUpdateTime } = currentItem?.azs[0] || {}
      const { updateTime: previousUpdateTime } = previousItem?.azs[0] || {}
      const currentDate = new Date(currentUpdateTime)
      const previousDate = new Date(previousUpdateTime)
      const updateTimeSortValue = previousDate.getTime() - currentDate.getTime()
      const defaultSortValue = currentItem.name > previousItem.name ? 1 : -1
      return isDesc ? updateTimeSortValue : defaultSortValue
    })
    return sortedSdus
  }

  async getSduAzs(getSduParams: GetSduAzsParams) {
    const { tenantId, projectName, appName, sduName } = getSduParams
    const listSdusParams = { tenantId, projectName, appName }
    const listSdusQuery = {}
    const sdus = await this.listSdus(listSdusParams, listSdusQuery)
    const { items } = sdus

    const sdu = items.find((item) => item.name === sduName)

    if (sdu === undefined) {
      throwError(ERROR.SYSTEM_ERROR.SDU_ERROR.REQUEST_ERROR, `get ${sduName} azs failed`)
    }

    return {
      sdu,
    }
  }
}
