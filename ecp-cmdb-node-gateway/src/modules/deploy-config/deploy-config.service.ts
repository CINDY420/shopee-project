import { Injectable } from '@nestjs/common'
import { FetchService } from '@/modules/fetch/fetch.service'
import { ListCommitsQuery } from '@/modules/deploy-config/dto/list-commits.dto'
import { CustomException } from '@infra-node-kit/exception/dist/models/custom-exception'
import { IModels as ISpaceModel } from '@/rapper/space/request'
import { IModels as ICmdbModel } from '@/rapper/cmdb/request'
import { ERROR } from '@/helpers/constants/error'
import { tryGetMessage } from '@/helpers/utils/try-get-message'
import { throwError } from '@infra-node-kit/exception'
import { format } from 'util'
import { ConfigService } from '@nestjs/config'
import { ListAvailableZonesQuery } from '@/modules/deploy-config/dto/list-available-zone.dto'
import { CreateCommitBody } from '@/modules/deploy-config/dto/create-commit.dto'
import { tryCatch } from '@infra/utils'

type CreateCommit = ISpaceModel['POST/apis/cmdb/v1/depconf/commit/create']['Res']
type ListCommits = ISpaceModel['GET/apis/cmdb/v1/depconf/commit/get_info']['Res']
type ListAzs = ICmdbModel['GET/ecpapi/v2/azs']['Res']

@Injectable()
export class DeployConfigService {
  constructor(
    private readonly configService: ConfigService,
    private readonly fetchService: FetchService,
  ) {}

  listExtraConfigs() {
    const configs = this.configService.get<string[]>('ecpGlobalConfig.jenkinsConfigs') || []

    return {
      extraConfigs: configs,
      total: configs.length,
    }
  }

  async listAvailableZones(query: ListAvailableZonesQuery) {
    const { env } = query
    const [azLists, listAzsError] = await tryCatch<ListAzs, CustomException>(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/azs']({ env }),
    )

    if (listAzsError) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(listAzsError?.response?.data)
      throwError({
        status,
        message: format(message, errorMessage),
        data: listAzsError?.response?.message,
      })
    }

    const { items } = azLists
    return {
      availableZones: items,
      total: items.length,
    }
  }

  async listCommits(query: ListCommitsQuery) {
    const { env, serviceId, project, commitId, page, limit } = query
    const [commitList, listCommitsError] = await tryCatch<ListCommits, CustomException>(
      this.fetchService.spaceFetch['GET/apis/cmdb/v1/depconf/commit/get_info']({
        env,
        service_id: serviceId,
        project,
        commit_id: commitId,
        page,
        limit,
      }),
    )
    if (listCommitsError) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(listCommitsError?.response?.data, 'error_detailed')
      throwError({
        status,
        message: format(message, errorMessage),
        data: listCommitsError?.response?.message,
      })
    }
    const { commits, total_count: total } = commitList
    const formattedCommits = commits.map((commit) => {
      const { data, ...rest } = commit
      return {
        data: { ...JSON.parse(data) },
        ...rest,
      }
    })

    return {
      commits: formattedCommits,
      total,
    }
  }

  async createCommit(body: CreateCommitBody) {
    const [, createCommitError] = await tryCatch<CreateCommit, CustomException>(
      this.fetchService.spaceFetch['POST/apis/cmdb/v1/depconf/commit/create']({ ...body }),
    )
    if (createCommitError) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(createCommitError?.response?.data, 'error_detailed')
      throwError({
        status,
        message: format(message, errorMessage),
        data: createCommitError?.response?.message,
      })
    }
  }
}
