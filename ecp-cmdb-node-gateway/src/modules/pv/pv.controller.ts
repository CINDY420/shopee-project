import { PVService } from '@/modules/pv/pv.service'
import { RequireLogin } from '@infra-node-kit/space-auth'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Pagination } from '@/helpers/decorators/parameters/pagination'
import { PaginateInterceptor } from '@/helpers/interceptors/pagination.interceptor'
import {
  ListPVsParam,
  ListPVsQuery,
  ListPVsResponse,
  CreatePVBody,
  CreatePVParam,
  DeletePVParam,
  ListPvSecretsParam,
  ListPvSecretsQuery,
  ListPvSecretsResponse,
  CheckIsPvSecretExistParam,
  CheckIsPvSecretExistResponse,
  CreatePvSecretBody,
  CreatePvSecretParam,
  DeletePvSecretParam,
  UpdatePvSecretBody,
  UpdatePvSecretParam,
  ListAllPvSecretsParam,
  ListAllPvSecretsQuery,
  ListAllPvSecretsResponse,
  RetryCreatePVParam,
  RetryCreatePVBody,
  GetAllPvsParam,
  GetAllPvsResponse,
  CheckIsPvSecretExistBody,
} from '@/modules/pv/dto/pv.dto'

@ApiTags('PV')
@RequireLogin(true)
@Controller()
export class PVController {
  constructor(private pvService: PVService) {}

  @Pagination({
    key: 'items',
    countKey: 'total',
    defaultOrder: 'updatedAt desc',
    canPaginationFilter: true,
    canPaginationSearch: true,
  })
  @UseInterceptors(PaginateInterceptor)
  @Get('/services/:serviceId/pvs')
  async listPVs(
    @Param() param: ListPVsParam,
    @Query() _query: ListPVsQuery,
  ): Promise<ListPVsResponse> {
    return await this.pvService.listPVs(param)
  }

  @Post('/services/:serviceId/pvs')
  async createPV(@Param() param: CreatePVParam, @Body() body: CreatePVBody): Promise<void> {
    return await this.pvService.createPV(param, body)
  }

  @Post('/services/:serviceId/pvs/:uuid')
  async retryCreatePV(
    @Param() param: RetryCreatePVParam,
    @Body() body: RetryCreatePVBody,
  ): Promise<void> {
    return await this.pvService.retryCreatePV(param, body)
  }

  @Delete('/pvs/:uuid')
  async deletePV(@Param() param: DeletePVParam): Promise<void> {
    const { uuid } = param
    return await this.pvService.deletePV(uuid)
  }

  @Pagination({
    key: 'items',
    countKey: 'total',
    defaultOrder: 'updatedAt desc',
    canPaginationFilter: true,
    canPaginationSearch: true,
  })
  @UseInterceptors(PaginateInterceptor)
  @Get('/services/:serviceId/pvSecrets')
  async listPvSeccrets(
    @Param() param: ListPvSecretsParam,
    @Query() _query: ListPvSecretsQuery,
  ): Promise<ListPvSecretsResponse> {
    return await this.pvService.listPvSevrets(param)
  }

  @Get('/services/:serviceId/allPvSecrets')
  async listAllPvSeccrets(
    @Param() param: ListAllPvSecretsParam,
    @Query() query: ListAllPvSecretsQuery,
  ): Promise<ListAllPvSecretsResponse> {
    return await this.pvService.listAllPvSevrets(param, query)
  }

  @Post('/services/:serviceId/pvSecrets')
  async createPvSecret(
    @Param() param: CreatePvSecretParam,
    @Body() body: CreatePvSecretBody,
  ): Promise<void> {
    return await this.pvService.createPvSecret(param, body)
  }

  @Put('/services/:serviceId/pvSecrets/:uuid')
  async updatePvSecret(
    @Param() param: UpdatePvSecretParam,
    @Body() body: UpdatePvSecretBody,
  ): Promise<void> {
    return await this.pvService.updatePvSecret(param, body)
  }

  @Delete('/pvSecrets/:uuid')
  async deletePvSecret(@Param() param: DeletePvSecretParam): Promise<void> {
    const { uuid } = param
    return this.pvService.deletePvSecret(uuid)
  }

  @Post('/services/:serviceId/pvSecrets/:ussAppid[:]isExist')
  async checkIsSecretExist(
    @Param() param: CheckIsPvSecretExistParam,
    @Body() body: CheckIsPvSecretExistBody,
  ): Promise<CheckIsPvSecretExistResponse> {
    return this.pvService.checkIsSecretExist(param, body)
  }

  @Get('/services/:serviceId/allPvs')
  async getAllPvcs(@Param() param: GetAllPvsParam): Promise<GetAllPvsResponse> {
    return this.pvService.getAllPvs(param)
  }

  @Get('/pvAzs')
  async getPvAzs(): Promise<{ azs: string[] }> {
    return this.pvService.getPvAzs()
  }
}
