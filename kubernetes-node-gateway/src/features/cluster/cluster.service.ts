import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { Logger } from '@/common/utils/logger'
import { OpenApiService } from '@/shared/open-api/open-api.service'
import { GetGlobalHpaParams, UpdateGlobalHpaParams, UpdateGlobalHpaBody } from '@/features/cluster/dto/cluster.dto'
import { STATUS_TYPE } from '@/shared/open-api/interfaces/cluster'

@Injectable()
export class ClusterService {
  constructor(
    private readonly configService: ConfigService,
    private readonly openApiService: OpenApiService,
    private readonly logger: Logger,
  ) {}

  /**
   * 这部分集群是特殊集群，如线上的测试集群，只有platform admin有权限操作
   */
  public getSpecialClusterNameList() {
    /**
     * todo jiyao.hong 改掉这个config的key 这个key是不正确的，不是特别的deployment，是特别的cluster
     */
    return this.configService.get<string[]>('global.specialDeploymentForTest') ?? []
  }

  async getGlobalHpa(getGlobalHpaParams: GetGlobalHpaParams) {
    const { status } = await this.openApiService.getGlobalHpa(getGlobalHpaParams)
    const isGlobalHpaEnable = status === STATUS_TYPE.ENABLE
    return { hpaStatus: isGlobalHpaEnable }
  }

  async updateGlobalHpa(updateGlobalHpaParams: UpdateGlobalHpaParams, updateGlobalHpaBody: UpdateGlobalHpaBody) {
    const { hpaStatus: isHpaEnable } = updateGlobalHpaBody
    const status = isHpaEnable === true ? STATUS_TYPE.ENABLE : STATUS_TYPE.DISABLE
    return this.openApiService.updateGlobalHpa(updateGlobalHpaParams, { status })
  }
}
