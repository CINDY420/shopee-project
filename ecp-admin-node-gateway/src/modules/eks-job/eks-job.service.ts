import { Injectable } from '@nestjs/common'
import { EksApisService } from '@/shared/eks-apis/eks-apis.service'
import { EksListJobParams, EksListJobQuery } from '@/modules/eks-job/dto/eks-job.dto'
import { listQuery } from '@infra/utils'
const { offsetLimitToPagination } = listQuery

@Injectable()
export class EksJobService {
  constructor(private readonly eksApisService: EksApisService) {}

  async listJobs(params: EksListJobParams, query: EksListJobQuery) {
    const { clusterId } = params
    const { offset, limit } = query

    const { currentPage, pageSize } = offsetLimitToPagination({
      offset: Number(offset),
      limit: Number(limit),
    })

    const data = await this.eksApisService.getApis().listJobs({
      clusterID: clusterId,
      pageNo: currentPage,
      pageSize,
    })
    const { total = 0, items = [] } = data
    const jobList = items.map((item) => {
      const {
        created_at: startTime = '',
        status = '',
        updated_at: updateTime = '',
        name = '',
        id = 0,
        sub_job_status: condition = [],
      } = item
      return {
        jobId: id,
        event: name,
        status,
        startTime,
        updateTime,
        condition,
      }
    })
    return {
      items: jobList,
      total,
    }
  }
}
