import { Injectable } from '@nestjs/common'
import { GetDeployConfigParams, GetDeployConfigQuery } from '@/features/deploy-config/dto/get-deploy-config.dto'
import { OpenApiService } from '@/shared/open-api/open-api.service'
import { Logger } from '@/common/utils/logger'
import { tryCatch } from '@/common/utils/try-catch'
import { throwError } from '@/common/utils/throw-error'
import { ERROR } from '@/common/constants/error'
import { UpdateDeployConfigBodyDto } from '@/features/deploy-config/dto/update-deploy-config.dto'
import { ApiResponse } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class DeployConfigService {
  constructor(
    private readonly openApiService: OpenApiService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(DeployConfigService.name)
  }

  async updateDeployConfig(param: GetDeployConfigParams, body: UpdateDeployConfigBodyDto) {
    const [, error] = await tryCatch(this.openApiService.updateEcpDeployConfig(param, body))

    if (error) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR,
        `update deploy config failed ${error?.message}`,
      )
    }
  }

  async getDeployConfig(params: GetDeployConfigParams, query: GetDeployConfigQuery) {
    const [result, error] = await tryCatch(
      this.openApiService.getEcpDeployConfig({
        ...params,
        ...query,
      }),
    )

    if (error || !result) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, `get deploy config failed ${error?.message}`)
    }

    const { enable: isEnable, comment, createAt, version, data } = result
    const deployConfig = JSON.parse(data)

    return {
      enable: isEnable,
      comment,
      createAt,
      deployConfig,
      version,
    }
  }

  @ApiResponse({
    type: 'string',
  })
  async listAvailableZones(query: GetDeployConfigQuery) {
    const { env } = query
    const [availableZones, error] = await tryCatch(this.openApiService.listAvailableZones(env))

    if (error || !availableZones) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR,
        `list available zones failed ${error?.message}`,
      )
    }

    return {
      availableZones,
      total: availableZones.length,
    }
  }

  async listComponents(params: GetDeployConfigQuery) {
    const { env } = params
    const [components, error] = await tryCatch(this.openApiService.listComponents(env))

    if (error || !components) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, `list az components failed ${error?.message}`)
    }

    return {
      components,
    }
  }

  async listExtraConfigs() {
    const configs = this.configService.get<string[]>('globalV3.jenkinsConfigs') || []

    return {
      extraConfigs: configs,
      total: configs.length,
    }
  }

  async listDeployConfigEnvs() {
    const envs = this.configService.get<string[]>('globalV3.deployConfigEnvs') || []

    return {
      envs,
      total: envs.length,
    }
  }
}
