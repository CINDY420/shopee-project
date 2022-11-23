import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { RequireLogin } from '@infra-node-kit/space-auth'
import { ApplicationService } from '@/features/application/application.service'
import { GitlabToken } from '@/common/decorators/gitlab-token.decorator'
import { ApiTags } from '@nestjs/swagger'
import {
  CreateApplicationBody,
  CreateApplicationResponse,
  QueryCreationTicketsParam,
  QueryCreationTicketsResponse,
  RecreateApplicationParam,
  ValidateCMDBServiceNameBody,
  ValidateCMDBServiceNameResponse,
} from '@/features/application/dtos/create-application.dto'
import {
  GetApplicationParam,
  GetApplicationResponse,
} from '@/features/application/dtos/get-application.dto'
import {
  ListApplicationQuery,
  ListApplicationResponse,
} from '@/features/application/dtos/list-application.dto'
import {
  SubscribeApplicationBody,
  SubscribeApplicationParam,
} from '@/features/application/dtos/subscribe-application.dto'

@ApiTags('Application')
@Controller()
@RequireLogin(true)
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @Post('application')
  async createApplication(
    @Body() body: CreateApplicationBody,
    @GitlabToken() gitlabToken: string,
  ): Promise<CreateApplicationResponse> {
    return await this.applicationService.createApplication(gitlabToken, body)
  }

  @Post('application/:appId[:]recreate')
  async recreateApplication(
    @Param() param: RecreateApplicationParam,
    @GitlabToken() gitlabToken: string,
  ): Promise<CreateApplicationResponse> {
    return await this.applicationService.recreateApplication(gitlabToken, param)
  }

  @Get('application/:appId[:]creationTickets')
  async queryCreationTickets(
    @Param() param: QueryCreationTicketsParam,
  ): Promise<QueryCreationTicketsResponse> {
    const { appId } = param
    return await this.applicationService.queryCreationTickets(appId)
  }

  @Get('applications')
  async listApplication(@Query() query: ListApplicationQuery): Promise<ListApplicationResponse> {
    return await this.applicationService.listApplication(query)
  }

  @Put('applications/:appId[:]subscribe')
  async subscribeApplication(
    @Param() param: SubscribeApplicationParam,
    @Body() body: SubscribeApplicationBody,
  ): Promise<void> {
    return await this.applicationService.subscribeApplication(param, body)
  }

  @Get('applications/:appId')
  async getApplication(@Param() param: GetApplicationParam): Promise<GetApplicationResponse> {
    const { appId } = param
    return await this.applicationService.getApplication(appId)
  }

  @Post('application[:]validateCMDBServiceName')
  async validateCMDBServiceName(
    @Body() body: ValidateCMDBServiceNameBody,
  ): Promise<ValidateCMDBServiceNameResponse> {
    return await this.applicationService.validateCMDBServiceName(body)
  }

  // TODO: for test, delete it after test
  @Put('application/:appId')
  async updateAppCreationProgress(
    @Param() param: GetApplicationParam,
    @Body() body: any,
  ): Promise<void> {
    return await this.applicationService.updateAppCreationProgress(param.appId, body)
  }

  // TODO: for test, delete it after test
  @Delete('application/:appId')
  async deleteApp(@Param() param: GetApplicationParam): Promise<void> {
    return await this.applicationService.deleteApp(param.appId)
  }
}
