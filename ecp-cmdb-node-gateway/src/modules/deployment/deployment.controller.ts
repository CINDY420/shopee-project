import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { DeploymentService } from '@/modules/deployment/deployment.service'
import { ApiTags } from '@nestjs/swagger'
import { RequireLogin } from '@infra-node-kit/space-auth'
import {
  GetDeploymentMetaParam,
  GetDeploymentMetaResponse,
} from '@/modules/deployment/dtos/deployment.dto'
import {
  ListDeploymentsParam,
  ListDeploymentsQuery,
  ListDeploymentsResponse,
} from '@/modules/deployment/dtos/list-deployments.dto'
import {
  ScaleDeploymentBody,
  ScaleDeploymentParam,
} from '@/modules/deployment/dtos/scale-deployment.dto'
import {
  ListWorkloadsQuery,
  ListWorkloadsResponse,
} from '@/modules/deployment/dtos/list-workloads.dto'
import {
  RollbackDeploymentBody,
  RollbackDeploymentParam,
} from '@/modules/deployment/dtos/rollback-deployment.dto'
import {
  GetDeploymentHistoryParam,
  GetDeploymentHistoryResponse,
} from '@/modules/deployment/dtos/list-deployment-history.dto'
import {
  ListDeploymentEventResponse,
  ListDeploymentEventsParam,
  ListDeploymentEventsQuery,
} from '@/modules/deployment/dtos/list-deployment-events.dto'
import {
  RestartDeploymentBody,
  RestartDeploymentParam,
} from '@/modules/deployment/dtos/restart-deployment.dto'

@ApiTags('Deployment')
@RequireLogin(true)
@Controller()
export class DeploymentController {
  constructor(private deploymentService: DeploymentService) {}

  @Get('/sdus/:sduName/svcdeploys/:deployId/meta')
  async getDeploymentMeta(
    @Param() param: GetDeploymentMetaParam,
  ): Promise<GetDeploymentMetaResponse> {
    return await this.deploymentService.getDeploymentMeta(param)
  }

  @Get('/sdus/:sduName/deploys')
  async listDeployments(
    @Param() param: ListDeploymentsParam,
    @Query() query: ListDeploymentsQuery,
  ): Promise<ListDeploymentsResponse> {
    return await this.deploymentService.listDeployments(param, query)
  }

  @Post('/sdus/:sduName/deploys/:deployId[:]scale')
  async scaleDeployment(
    @Param() param: ScaleDeploymentParam,
    @Body() body: ScaleDeploymentBody,
  ): Promise<void> {
    return await this.deploymentService.scaleDeployment(param, body)
  }

  @Get('/workloads')
  async listWorkloads(@Query() query: ListWorkloadsQuery): Promise<ListWorkloadsResponse> {
    return await this.deploymentService.listWorkloads(query)
  }

  @Post('/sdus/:sduName/deploys/:deployId[:]rollback')
  async rollbackDeployment(
    @Param() param: RollbackDeploymentParam,
    @Body() body: RollbackDeploymentBody,
  ): Promise<void> {
    return await this.deploymentService.rollbackDeployment(param, body)
  }

  @Get('/sdus/:sduName/deploys/:deployId/history')
  async listDeploymentHistory(
    @Param() param: GetDeploymentHistoryParam,
  ): Promise<GetDeploymentHistoryResponse> {
    return await this.deploymentService.getDeploymentHistory(param)
  }

  @Get('/sdus/:sduName/deploys/:deployId/events')
  async listDeploymentEvents(
    @Param() param: ListDeploymentEventsParam,
    @Query() query: ListDeploymentEventsQuery,
  ): Promise<ListDeploymentEventResponse> {
    return await this.deploymentService.listDeploymentEvents(param, query)
  }

  @Post('/sdus/:sduName/deploys/:deployId[:]restart')
  async restartDeployment(
    @Param() param: RestartDeploymentParam,
    @Body() body: RestartDeploymentBody,
  ): Promise<unknown> {
    return await this.deploymentService.restartDeployment(param, body)
  }

  @Post('/sdus/:sduName/deploys/:deployId[:]fullRelease')
  async fullReleaseDeployment(@Param() param: RestartDeploymentParam): Promise<unknown> {
    return await this.deploymentService.fullReleaseDeployment(param)
  }

  @Post('/sdus/:sduName/deploys/:deployId[:]cancelCanary')
  async cancelCanaryDeployment(@Param() param: RestartDeploymentParam): Promise<unknown> {
    return await this.deploymentService.cancelCanaryDeployment(param)
  }

  @Post('/sdus/:sduName/deploys/:deployId[:]suspend')
  async suspendDeployment(@Param() param: RestartDeploymentParam): Promise<unknown> {
    return await this.deploymentService.suspendDeployment(param)
  }

  @Post('/sdus/:sduName/deploys/:deployId[:]stop')
  async stopDeployment(@Param() param: RestartDeploymentParam): Promise<unknown> {
    return await this.deploymentService.stopDeployment(param)
  }
}
