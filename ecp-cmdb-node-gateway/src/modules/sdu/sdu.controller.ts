import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { SduService } from '@/modules/sdu/sdu.service'
import { ApiTags } from '@nestjs/swagger'
import { ListSduParam, ListSduQuery, ListSduResponse } from '@/modules/sdu/dtos/list-sdu.dto'
import { RequireLogin } from '@infra-node-kit/space-auth'
import {
  ListSDUHpaEnabledAZsParam,
  ListSDUHpaEnabledAZsResponse,
} from '@/modules/sdu/dtos/list-sdu-hpa-enabled-azs.dto'
import { ScaleSDUBody, ScaleSDUParam } from '@/modules/sdu/dtos/scale-sdu.dto'
import {
  GetEnabledSduAutoScalerBody,
  GetEnabledSduAutoScalerParam,
  GetEnabledSduAutoScalerQuery,
} from '@/modules/sdu/dtos/get-enabled-sdu-auto-scaler.dto'
import {
  GetUnboundSDUsQuery,
  GetUnboundSDUsResponse,
} from '@/modules/sdu/dtos/get-unbound-sdus.dto'
import { BindSDUsParam, BindSDUsBody } from '@/modules/sdu/dtos/bind-sdus.dto'
import { UnbindSDUParam } from '@/modules/sdu/dtos/unbind-sdu.dto'
import { RestartSDUParam, RestartSDUBody } from '@/modules/sdu/dtos/restart-sdu.dto'
import { SuspendSDUParam, SuspendSDUBody } from '@/modules/sdu/dtos/suspend-sdu.dto'
import { StopSDUParam, StopSDUBody } from '@/modules/sdu/dtos/stop-sdu.dto'
import {
  ListRollbackableSDUParam,
  ListRollbackableSDUQuery,
  ListRollbackableSDUResponse,
} from '@/modules/sdu/dtos/list-rollbackable-sdu.dto'
import { RollbackSDUsBody } from '@/modules/sdu/dtos/rollback-sdus.dto'
import {
  ListSDUsHistoryQuery,
  ListSDUsHistoryResponse,
} from '@/modules/sdu/dtos/list-sdus-history.dto'
import {
  GetSDUsRollbackPreviewQuery,
  GetSDUsRollbackPreviewResponse,
} from '@/modules/sdu/dtos/get-sdus-rollback-preview.dto'

@ApiTags('SDU')
@RequireLogin(true)
@Controller()
export class SduController {
  constructor(private sduService: SduService) {}

  @Get('/ping')
  async ping() {
    return await this.sduService.ping()
  }
  @Get('/services/:serviceName/sdus')
  async listSdus(
    @Param() param: ListSduParam,
    @Query() query: ListSduQuery,
  ): Promise<ListSduResponse> {
    return await this.sduService.listSdus(param, query)
  }

  @Get('/sdus/:sduName/hpa[:]enabledAZs')
  async listSDUHpaEnabledAZs(
    @Param() param: ListSDUHpaEnabledAZsParam,
  ): Promise<ListSDUHpaEnabledAZsResponse> {
    return await this.sduService.listSDUHpaEnabledAZs(param)
  }

  @Get('/sdus/:sduName/autoScale[:]enabled')
  async getEnabledSduAutoScale(
    @Param() param: GetEnabledSduAutoScalerParam,
    @Query() query: GetEnabledSduAutoScalerQuery,
  ): Promise<GetEnabledSduAutoScalerBody> {
    return await this.sduService.getEnabledSduAutoScale(param, query)
  }

  @Post('/sdus/:sduName[:]scale')
  async scaleSDU(@Param() param: ScaleSDUParam, @Body() body: ScaleSDUBody): Promise<unknown> {
    return await this.sduService.scaleSDU(param, body)
  }

  @Get('/sdus[:]unbound')
  async getUnboundSDUs(@Query() query: GetUnboundSDUsQuery): Promise<GetUnboundSDUsResponse> {
    return await this.sduService.getUnboundSDUs(query)
  }

  @Post('/services/:serviceName/sdus[:]bind')
  async bindSDUs(@Param() param: BindSDUsParam, @Body() body: BindSDUsBody): Promise<unknown> {
    return await this.sduService.bindSDUs(param, body)
  }

  @Post('/services/:serviceName/sdus/:sduName[:]unbind')
  async unbindSDU(@Param() param: UnbindSDUParam): Promise<unknown> {
    return await this.sduService.unbindSDU(param)
  }

  @Post('/sdus/:sduName[:]restart')
  async restartSDU(
    @Param() param: RestartSDUParam,
    @Body() body: RestartSDUBody,
  ): Promise<unknown> {
    return await this.sduService.restartSDU(param, body)
  }

  @Post('/sdus/:sduName[:]suspend')
  async suspendSDU(
    @Param() param: SuspendSDUParam,
    @Body() body: SuspendSDUBody,
  ): Promise<unknown> {
    return await this.sduService.suspendSDU(param, body)
  }

  @Post('/sdus/:sduName[:]stop')
  async stopSDU(@Param() param: StopSDUParam, @Body() body: StopSDUBody): Promise<unknown> {
    return await this.sduService.stoptSDU(param, body)
  }

  @Get('/services/:serviceName/sdus[:]rollbackable')
  async listRollbackableSDU(
    @Param() param: ListRollbackableSDUParam,
    @Query() query: ListRollbackableSDUQuery,
  ): Promise<ListRollbackableSDUResponse> {
    return await this.sduService.listRollbackableSDU(param, query)
  }

  @Post('/sdus[:]rollback')
  async rollbackSDUs(@Body() body: RollbackSDUsBody): Promise<unknown> {
    return await this.sduService.rollbackSDUs(body)
  }

  @Get('/sdus[:]history')
  async getSDUsHistory(@Query() query: ListSDUsHistoryQuery): Promise<ListSDUsHistoryResponse> {
    const { sdus } = query
    const sduArray = sdus?.split(',')
    return await this.sduService.listSDUsHistory(sduArray)
  }

  @Get('/sdus[:]rollbackPreview')
  async getSDUsRollbackPreview(
    @Query() query: GetSDUsRollbackPreviewQuery,
  ): Promise<GetSDUsRollbackPreviewResponse> {
    const { sdus, targetTag } = query
    const sduArray = sdus?.split(',')
    return await this.sduService.getSDUsRollbackPreview(targetTag, sduArray)
  }
}
