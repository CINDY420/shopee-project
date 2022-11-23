import { Controller, Get, Param, Post, Query, Body, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RequireLogin } from '@infra-node-kit/space-auth'
import { PodService } from '@/modules/pod/pod.service'
import { Pagination } from '@/helpers/decorators/parameters/pagination'
import { PaginateInterceptor } from '@/helpers/interceptors/pagination.interceptor'
import {
  ListDeploymentPodParam,
  ListDeploymentPodQuery,
  ListDeploymentPodResponse,
  KillPodParam,
  KillPodBody,
  BatchKillPodParam,
  BatchKillPodBody,
  GetLogFileContentParams,
  GetLogFileContentQuery,
  GetLogFileContentResponse,
  ListLogFilesResponse,
  ListLogFilesParams,
  ListLogFilesQuery,
  GetPodLogsParams,
  GetPodLogsQuery,
  GetPodLogsResponse,
} from '@/modules/pod/dto/pod.dto'

@ApiTags('Pod')
@RequireLogin(true)
@Controller()
export class PodController {
  constructor(private podService: PodService) {}

  @Pagination({
    key: 'items',
    countKey: 'total',
    canPaginationFilter: false,
    canPaginationSearch: false,
  })
  @UseInterceptors(PaginateInterceptor)
  @Get('/sdus/:sduName/svcdeploys/:deployId/pods')
  async listDeploymentPods(
    @Param() param: ListDeploymentPodParam,
    @Query() query: ListDeploymentPodQuery,
  ): Promise<ListDeploymentPodResponse> {
    return await this.podService.listDeploymentPods(param, query)
  }

  @Post('/sdus/:sduName/svcdeploys/:deployId/pods/:podName[:]kill')
  async killPod(@Param() param: KillPodParam, @Body() body: KillPodBody): Promise<unknown> {
    return await this.podService.killPod(param, body)
  }

  @Post('/sdus/:sduName/svcdeploys/:deployId/pods[:]batchKill')
  async batchKillPods(
    @Param() param: BatchKillPodParam,
    @Body() body: BatchKillPodBody,
  ): Promise<unknown> {
    return await this.podService.batchKillPods(param, body)
  }

  @Pagination({
    key: 'items',
    countKey: 'total',
    defaultOrder: 'modTime desc',
    canPaginationFilter: false,
    canPaginationSearch: false,
  })
  @UseInterceptors(PaginateInterceptor)
  @Get('/sdus/:sduName/svcdeploys/:deployId/pods/:podName/files')
  async listPodFiles(
    @Param() param: ListLogFilesParams,
    @Query() query: ListLogFilesQuery,
  ): Promise<ListLogFilesResponse> {
    return await this.podService.listPodFiles(param, query)
  }

  @Get('/sdus/:sduName/svcdeploys/:deployId/pods/:podName/file[:]read')
  async getLogFileContent(
    @Param() param: GetLogFileContentParams,
    @Query() query: GetLogFileContentQuery,
  ): Promise<GetLogFileContentResponse> {
    return await this.podService.getLogFileContent(param, query)
  }

  @Get('/sdus/:sduName/svcdeploys/:deployId/pods/:podName/logs')
  async getPodLog(
    @Param() param: GetPodLogsParams,
    @Query() query: GetPodLogsQuery,
  ): Promise<GetPodLogsResponse> {
    return await this.podService.getPodLogs(param, query)
  }
}
