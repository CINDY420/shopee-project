import { SYSTEM_ERROR } from '@/constants/error'
import { ID_SEPARATOR, MAX_CLUSTER_LIMIT, LOW_THRESHOLD, HIGH_THRESHOLD } from '@/constants/segment'
import { throwError } from '@infra-node-kit/exception'
import { Injectable } from '@nestjs/common'
import { GlobalService } from '@/modules/global/global.service'
import {
  GetSegmentResponse,
  ListSegmentsResponse,
  SegmentDetail,
  Status,
} from '@/modules/segment/dto/segment.dto'
import { ClusterService } from '@/modules/cluster/cluster.service'
import { ListClustersQuery } from '@/modules/cluster/dto/cluster.dto'

@Injectable()
export class SegmentService {
  constructor(
    private readonly globalService: GlobalService,
    private readonly clusterService: ClusterService,
  ) {}

  async listSegments(azKey?: string): Promise<ListSegmentsResponse> {
    const azs = await this.globalService.listAllAzs(azKey)

    const segments: SegmentDetail[] = azs.items
      .reduce<SegmentDetail[]>(
        (result, az) =>
          result.concat(
            az.segments.map((segment) => {
              const item = {
                azName: az.azName,
                azKey: az.azKey,
                segmentKey: segment.segmentKey,
                segmentId: `${az.azKey}${ID_SEPARATOR}${segment.segmentKey}`,
                name: segment.segmentName,
                labels: az.labels,
                region: az.region,
                status: Status.LOW,
                property: az.complianceType,
                type: az.statefulness,
                cpu: {
                  used: 0,
                  applied: 0,
                  total: 0,
                },
                memory: {
                  used: 0,
                  applied: 0,
                  total: 0,
                },
                usedCPUPercentage: 0,
                appliedCPUPercentage: 0,
                usedMemoryPercentage: 0,
                appliedMemoryPercentage: 0,
              }

              return item
            }),
          ),
        [],
      )
      .sort((segment1, segment2) => {
        if (segment1.segmentId < segment2.segmentId) {
          return -1
        }

        if (segment1.segmentId > segment2.segmentId) {
          return 1
        }

        return 0
      })

    const listClusterQuery = new ListClustersQuery()
    listClusterQuery.limit = MAX_CLUSTER_LIMIT
    const clusterDetails = await this.clusterService.listClusters(listClusterQuery)

    segments.forEach((segment) => {
      const segmentClusterDetails = clusterDetails.items.filter(
        (cluster) => cluster.segmentKey === segment.segmentKey,
      )
      segmentClusterDetails.forEach((cluster) => {
        segment.cpu.applied += cluster.metrics?.cpu.applied as number
        segment.cpu.used += cluster.metrics?.cpu.used as number
        segment.cpu.total += cluster.metrics?.cpu.total as number
        segment.memory.applied += cluster.metrics?.memory.applied as number
        segment.memory.used += cluster.metrics?.memory.used as number
        segment.memory.total += cluster.metrics?.memory.total as number
      })

      let cpuAppliedPercentage = 0
      if (segment.cpu.total > 0) {
        cpuAppliedPercentage = Math.round((segment.cpu.applied / segment.cpu.total) * 100)
        segment.appliedCPUPercentage = cpuAppliedPercentage
        segment.usedCPUPercentage = Math.round((segment.cpu.used / segment.cpu.total) * 100)
      }
      let memoryAppliedPercentage = 0
      if (segment.memory.total > 0) {
        memoryAppliedPercentage = Math.round((segment.memory.applied / segment.memory.total) * 100)
        segment.appliedMemoryPercentage = memoryAppliedPercentage
        segment.usedMemoryPercentage = Math.round(
          (segment.memory.used / segment.memory.total) * 100,
        )
      }

      if (cpuAppliedPercentage >= HIGH_THRESHOLD || memoryAppliedPercentage >= HIGH_THRESHOLD) {
        segment.status = Status.HIGH
      } else if (
        cpuAppliedPercentage >= LOW_THRESHOLD &&
        memoryAppliedPercentage >= LOW_THRESHOLD
      ) {
        segment.status = Status.NORMAL
      }
    })

    return {
      items: segments,
    }
  }

  async getSegment(segmentId: string): Promise<GetSegmentResponse> {
    const segmentInfos = segmentId.split(ID_SEPARATOR)
    if (segmentInfos.length !== 2) {
      return throwError({
        code: SYSTEM_ERROR.BAD_REQUEST_ERROR.code,
        status: SYSTEM_ERROR.BAD_REQUEST_ERROR.status,
        message: `invalid segmentId ${segmentId}`,
      })
    }
    const [azKey] = segmentInfos

    const segments = await this.listSegments(azKey)
    const targetSegment = segments.items.find((segment) => segment.segmentId === segmentId)

    if (!targetSegment) {
      return throwError(SYSTEM_ERROR.RESOURCE_NOT_FOUND_ERROR)
    }

    return targetSegment
  }
}
