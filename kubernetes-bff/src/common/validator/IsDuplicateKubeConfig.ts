import { Injectable } from '@nestjs/common'
import { ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator'
import { ERROR_MESSAGE } from 'common/constants/error'
import { ESIndex } from 'common/constants/es'
import { ESService } from 'common/modules/es/es.service'

@Injectable()
@ValidatorConstraint({ name: 'isKubeConfig', async: true })
export class IsDuplicateKubeConfig implements ValidatorConstraintInterface {
  constructor(private esService: ESService) {}

  async validate(kubeconfig: string) {
    try {
      const result = await this.esService.termQueryFirst(ESIndex.CLUSTER, 'config', kubeconfig)

      return !result
    } catch {
      return false
    }
  }

  defaultMessage() {
    return ERROR_MESSAGE.REQUEST_KUBECONFIG_DUPLICATE
  }
}
