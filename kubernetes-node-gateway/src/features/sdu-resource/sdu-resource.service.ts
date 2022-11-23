import { Logger } from '@/common/utils/logger'
import { ListSecondLabelsParams, ListThirdLabelsParams } from '@/features/sdu-resource/dto/list-labels.dto'
import { OpsPlatformService } from '@/shared/ops-platform/ops-platform.service'
import { Injectable } from '@nestjs/common'
import { ERROR } from '@/common/constants/error'
import { tryCatch } from '@/common/utils/try-catch'
import { throwError } from '@/common/utils/throw-error'
import { EditIncrementEstimateBody } from '@/features/sdu-resource/dto/edit-increment-estimate.dto'
import { EditStockResourceBody } from '@/features/sdu-resource/dto/edit-stock-resource.dto'
import { DeleteIncrementEstimateBody } from '@/features/sdu-resource/dto/delete-increment-estimate.dto'
import { ListStockQuery } from '@/features/sdu-resource/dto/list-stock-resource.dto'
import { EditVersionBody } from '@/features/sdu-resource/dto/edit-version.dto'
import { CreateVersionBody } from '@/features/sdu-resource/dto/create-version.dto'
import { CreateIncrementEstimateBody } from '@/features/sdu-resource/dto/create-increment-estimate.dto'
import { ListIncrementQuery } from '@/features/sdu-resource/dto/list-increment-resource.dto'
import { ListSummaryQuery } from '@/features/sdu-resource/dto/list-summary.dto'
import { ListClusterParams, ListSegmentParams } from '@/features/sdu-resource/dto/list-resource.dto'
import { EVALUATION_METRICS_TYPE } from '@/features/sdu-resource/entities/stock.entity'
import { ListQuery } from '@/common/models/dtos/list-query.dto'

@Injectable()
export class SduResourceService {
  constructor(private readonly opsPlatformService: OpsPlatformService, private readonly logger: Logger) {
    this.logger.setContext(SduResourceService.name)
  }

  async listAzs() {
    const [availableZones, error] = await tryCatch(this.opsPlatformService.listAzs())

    if (error || !availableZones) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR,
        `list common available zones failed ${error?.message}`,
      )
    }

    return {
      availableZones,
      total: availableZones.length,
    }
  }

  async listEnvs() {
    const [envs, error] = await tryCatch(this.opsPlatformService.listEnvs())

    if (error || !envs) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR,
        `list common available zones failed ${error?.message}`,
      )
    }

    return {
      envs,
      total: envs.length,
    }
  }

  async listCids() {
    const [cids, error] = await tryCatch(this.opsPlatformService.listCids())

    if (error || !cids) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, `list common cids failed ${error?.message}`)
    }

    return {
      cids,
      total: cids.length,
    }
  }

  async listClusters(params: ListClusterParams) {
    const { az } = params
    const [clusters, error] = await tryCatch(this.opsPlatformService.listClusters(az))

    if (error || !clusters) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR,
        `list common clusters failed ${error?.message}`,
      )
    }

    return {
      clusters,
      total: clusters.length,
    }
  }

  async listSegments(params: ListSegmentParams) {
    const { az } = params
    const [segments, error] = await tryCatch(this.opsPlatformService.listSegments(az))

    if (error || !segments) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR,
        `list common segments failed ${error?.message}`,
      )
    }

    return {
      segments,
      total: segments.length,
    }
  }

  async listMachineModels() {
    const [machineModels, error] = await tryCatch(this.opsPlatformService.listMachineModels())

    if (error || !machineModels) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR,
        `list common machine models failed ${error?.message}`,
      )
    }

    return {
      machineModels,
      total: machineModels.length,
    }
  }

  async listBigSales() {
    const [bigSales, error] = await tryCatch(this.opsPlatformService.listBigSales())

    if (error || !bigSales) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, `list big sales failed ${error?.message}`)
    }

    return {
      bigSales,
      total: bigSales.length,
    }
  }

  private convertByteToGigabyte = (byte: number | null) => {
    if (byte === null || byte === undefined) {
      return null
    }
    return Math.ceil(byte / 1024 / 1024 / 1024)
  }

  private convertGigabyteToByte = (gigabyte?: number | null) => {
    if (gigabyte === null || gigabyte === undefined) {
      return null
    }
    return Math.floor(gigabyte * 1024 * 1024 * 1024)
  }

  private convertByteToTwoDecimalGigabyte = (byte: number | null) => {
    if (byte === null || byte === undefined) {
      return null
    }
    return Number((byte / 1024 / 1024 / 1024).toFixed(2))
  }

  private getInitialSafetyThreshold = (type: EVALUATION_METRICS_TYPE) => {
    if (type === EVALUATION_METRICS_TYPE.CPU) {
      return '70%'
    } else if (type === EVALUATION_METRICS_TYPE.MEM) {
      return '85%'
    }
    return ''
  }

  async listStock(query: ListStockQuery) {
    const { filterBy, ...restQuery } = query
    const filterList = ListQuery.parseMustFiltersToKeyValuesMap(filterBy)
    const editStatusValues = filterList['metaData.editStatus']
    const editStatusObj =
      editStatusValues?.length === 1
        ? {
            editStatus: Number(editStatusValues?.[0]),
          }
        : null

    const newQuery = {
      ...editStatusObj,
      ...restQuery,
    }
    const [stockList, error] = await tryCatch(this.opsPlatformService.listStockResource(newQuery))
    if (error || !stockList) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, `list stock failed ${error?.message}`)
    }
    const lists = stockList?.data?.map((stock) => {
      const {
        sduClusterId,
        sdu,
        level1DisplayName,
        level2DisplayName,
        level3DisplayName,
        versionName,
        editStatus,

        cid,
        displayEnv,
        az,
        cluster,
        segment,
        insCountPeak,
        cpuReqOneInsPeak,
        memLimitOneInsPeak,
        gpuCardLimitOneInsPeak,
        cpuLimitOneInsPeak,
        memUsedOneInsPeak,
        gpuCardAllocatedTotalPeak,
        cpuAllocatedTotalPeak,
        memAllocatedTotalPeak,
        cpuUsedOneInsPeak,
        cpuUsedTotalPeak,
        memReqOneInsPeak,
        memUsedTotalPeak,

        qpsTotalPeak,
        qpsMaxOneIns,
        inUse,
        evaluationMetrics,
        growthRatio,
        growthRatioAnnotation,
        minInsCount,
        safetyThreshold,
        remark,
        machineModel,

        estimatedCpuIncrement,
        estimatedGpuCardIncrement,
        estimatedInsCountIncrement,
        estimatedInsCountTotal,
        estimatedMemIncrement,
      } = stock
      const metaData = {
        id: sduClusterId,
        sdu,
        level1: level1DisplayName,
        level2: level2DisplayName,
        level3: level3DisplayName,
        version: versionName,
        editStatus,
      }

      return {
        metaData,
        data: {
          basicInfo: {
            cid,
            displayEnv,
            az,
            cluster,
            segment,
          },
          reference: {
            insCountPeak,
            cpuReqOneInsPeak,
            memLimitOneInsPeak: this.convertByteToTwoDecimalGigabyte(memLimitOneInsPeak),
            gpuCardLimitOneInsPeak: gpuCardLimitOneInsPeak || 0,
            cpuLimitOneInsPeak,
            memUsedOneInsPeak: this.convertByteToTwoDecimalGigabyte(memUsedOneInsPeak),
            gpuCardAllocatedTotalPeak,
            cpuAllocatedTotalPeak,
            memAllocatedTotalPeak: this.convertByteToTwoDecimalGigabyte(memAllocatedTotalPeak),
            cpuUsedOneInsPeak,
            cpuUsedTotalPeak,
            memReqOneInsPeak: this.convertByteToTwoDecimalGigabyte(memReqOneInsPeak),
            memUsedTotalPeak: this.convertByteToTwoDecimalGigabyte(memUsedTotalPeak),
          },
          growthExpectation: {
            qpsTotalPeak,
            qpsMaxOneIns,
            inUse: inUse || 1,
            evaluationMetrics: evaluationMetrics || EVALUATION_METRICS_TYPE.CPU,
            growthRatio,
            growthRatioAnnotation,
            minInsCount: minInsCount || 2,
            safetyThreshold: safetyThreshold
              ? `${safetyThreshold * 100}%`
              : this.getInitialSafetyThreshold(evaluationMetrics),
            remark,
            machineModel: machineModel || 'S1_V2',
          },
          estimated: {
            estimatedCpuIncrement,
            estimatedGpuCardIncrement,
            estimatedInsCountIncrement,
            estimatedInsCountTotal,
            estimatedMemIncrement: this.convertByteToTwoDecimalGigabyte(estimatedMemIncrement),
          },
        },
      }
    })

    return {
      data: lists,
      total: stockList.page.total,
    }
  }

  async listIncrement(query: ListIncrementQuery) {
    const [incrementList, error] = await tryCatch(this.opsPlatformService.listIncrementResource(query))
    if (error || !incrementList) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, `list increment failed ${error?.message}`)
    }
    const lists = incrementList?.data?.map((increment) => {
      const {
        incrementId,
        level1DisplayName,
        level2DisplayName,
        level3DisplayName,
        versionName,

        cid,
        displayEnv,
        az,
        cluster,
        segment,

        estimatedQpsTotal,
        estimatedCpuIncrementTotal,
        estimatedLogic,
        estimatedMemIncrementTotal,
        estimatedGpuCardIncrement,
        memLimitOneInsPeak,
        gpuCardLimitOneInsPeak,
        cpuLimitOneInsPeak,
        qpsMaxOneIns,
        evaluationMetrics,
        minInsCount,
        remark,
        machineModel,
        estimatedCpuIncrement,
        estimatedInsCountTotal,
        estimatedMemIncrement,
      } = increment
      const metaData = {
        id: incrementId,
        level1: level1DisplayName,
        level2: level2DisplayName,
        level3: level3DisplayName,
        version: versionName,
      }

      return {
        metaData,
        data: {
          basicInfo: {
            cid,
            displayEnv,
            az,
            cluster,
            segment,
          },
          estimated: {
            estimatedQpsTotal,
            estimatedCpuIncrementTotal,
            estimatedLogic,
            estimatedMemIncrementTotal: this.convertByteToGigabyte(estimatedMemIncrementTotal),
            estimatedGpuCardIncrement,
            memLimitOneInsPeak: this.convertByteToGigabyte(memLimitOneInsPeak),
            gpuCardLimitOneInsPeak,
            cpuLimitOneInsPeak,
            qpsMaxOneIns,
            evaluationMetrics: evaluationMetrics || EVALUATION_METRICS_TYPE.CPU,
            minInsCount: minInsCount || 2,
            remark,
            machineModel: machineModel || 'S1_V2',
            estimatedCpuIncrement,
            estimatedInsCountTotal,
            estimatedMemIncrement: this.convertByteToGigabyte(estimatedMemIncrement),
          },
        },
      }
    })

    return {
      data: lists,
      total: incrementList.page.total,
    }
  }

  async getLabelTree() {
    return this.opsPlatformService.listLabelTree()
  }

  async listFirstLabels() {
    const labels = await this.opsPlatformService.listLabelTree()

    const matchLabels = labels.map((label) => {
      const { labelNodeId, displayName } = label
      return {
        labelNodeId,
        displayName,
      }
    })

    return {
      labels: matchLabels,
      total: matchLabels.length,
    }
  }

  async listSecondLabels(params: ListSecondLabelsParams) {
    const { firstLabelId } = params
    const labels = await this.opsPlatformService.listLabelTree()
    const parent = labels.find((label) => label.labelNodeId === firstLabelId)

    if (!parent) {
      return {
        labels: [],
        total: 0,
      }
    }

    const matchLabels = parent.childNodes.map((label) => {
      const { labelNodeId, displayName } = label
      return {
        labelNodeId,
        displayName,
      }
    })

    return {
      labels: matchLabels,
      total: matchLabels.length,
    }
  }

  async listThirdLabels(params: ListThirdLabelsParams) {
    const { firstLabelId, secondLabelId } = params

    const labels = await this.opsPlatformService.listLabelTree()
    const grandParent = labels.find((label) => label.labelNodeId === firstLabelId)
    const parent = grandParent?.childNodes.find((label) => label.labelNodeId === secondLabelId)

    if (!parent) {
      return {
        labels: [],
        total: 0,
      }
    }

    const matchLabels = parent.childNodes.map((label) => {
      const { labelNodeId, displayName } = label
      return {
        labelNodeId,
        displayName,
      }
    })

    return {
      labels: matchLabels,
      total: matchLabels.length,
    }
  }

  async deleteIncrementEstimate(query: DeleteIncrementEstimateBody) {
    const { ids } = query
    const [, error] = await tryCatch(this.opsPlatformService.deleteIncrementEstimate(ids))

    if (error) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR,
        `delete increment estimate failed ${error?.message}`,
      )
    }
  }

  async createIncrementEstimate(body: CreateIncrementEstimateBody) {
    const newDatas = body?.data?.map((each) => {
      const { memLimitOneInsPeak, estimatedMemIncrementTotal } = each
      const newData = { ...each }
      if (memLimitOneInsPeak) {
        Object.assign(newData, { memLimitOneInsPeak: this.convertGigabyteToByte(memLimitOneInsPeak) })
      }
      if (estimatedMemIncrementTotal) {
        Object.assign(newData, { estimatedMemIncrementTotal: this.convertGigabyteToByte(estimatedMemIncrementTotal) })
      }
      return newData
    })
    const formatedBody = { data: newDatas }
    const [, error] = await tryCatch(this.opsPlatformService.createIncrementEstimate(formatedBody))

    if (error) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR,
        `create increment estimate failed ${error?.message}`,
      )
    }
  }

  async editIncrementEstimate(body: EditIncrementEstimateBody) {
    const { data, ids } = body
    const { memLimitOneInsPeak, estimatedMemIncrementTotal } = data
    const newData = { ...data }
    if (memLimitOneInsPeak) {
      Object.assign(newData, { memLimitOneInsPeak: this.convertGigabyteToByte(memLimitOneInsPeak) })
    }
    if (estimatedMemIncrementTotal) {
      Object.assign(newData, { estimatedMemIncrementTotal: this.convertGigabyteToByte(estimatedMemIncrementTotal) })
    }

    const formatedBody = { data: newData, ids }
    const [, error] = await tryCatch(this.opsPlatformService.editIncrementEstimate(formatedBody))

    if (error) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR,
        `edit increment estimate failed ${error?.message}`,
      )
    }
  }

  async editStockResource(body: EditStockResourceBody) {
    const [, error] = await tryCatch(this.opsPlatformService.editStockResource(body))

    if (error) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR,
        `edit stock resource failed ${error?.message}`,
      )
    }
  }

  async listVersion() {
    const [versions, error] = await tryCatch(this.opsPlatformService.listVersion())
    if (error || !versions) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, `list version failed ${error?.message}`)
    }

    return {
      versions,
      total: versions.length,
    }
  }

  async createVersion(body: CreateVersionBody) {
    const [, error] = await tryCatch(this.opsPlatformService.createVersion(body))

    if (error) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, `create version failed ${error?.message}`)
    }
  }

  async editVersion(body: EditVersionBody) {
    const [, error] = await tryCatch(this.opsPlatformService.editVersion(body))
    if (error) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, `edit version failed ${error?.message}`)
    }
  }

  async listSummary(query: ListSummaryQuery) {
    const [summaries, error] = await tryCatch(this.opsPlatformService.listSummary(query))
    if (error || !summaries) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, `list summary failed ${error?.message}`)
    }
    const formatSummaries = summaries?.data?.map((summary) => {
      const { memStock, memTarget, memIncrement, ...others } = summary
      return {
        memStock: this.convertByteToGigabyte(memStock),
        memTarget: this.convertByteToGigabyte(memTarget),
        memIncrement: this.convertByteToGigabyte(memIncrement),
        ...others,
      }
    })
    return {
      summaries: formatSummaries,
      total: summaries.page.total,
    }
  }
}
