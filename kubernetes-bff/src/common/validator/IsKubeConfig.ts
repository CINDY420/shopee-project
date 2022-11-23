import { Injectable } from '@nestjs/common'
import { ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator'
import { ERROR_MESSAGE } from 'common/constants/error'
import { NodesService } from 'nodes/nodes.service'

@Injectable()
@ValidatorConstraint({ name: 'isKubeConfig', async: true })
export class IsKubeConfig implements ValidatorConstraintInterface {
  constructor(private nodesService: NodesService) {}

  async validate(clusterConfig: { config: string; clusterName: string }) {
    const { config, clusterName } = clusterConfig
    try {
      await this.nodesService.getNodeListWithClusterConfig(config, clusterName, false)
      return true
    } catch {
      return false
    }
  }

  defaultMessage() {
    return ERROR_MESSAGE.REQUEST_KUBECONFIG_INVALID
  }
}
