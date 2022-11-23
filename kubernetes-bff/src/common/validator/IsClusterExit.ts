import { Injectable } from '@nestjs/common'
import { ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator'
import { ERROR_MESSAGE } from 'common/constants/error'
import { ESIndex } from 'common/constants/es'
import { ESService } from 'common/modules/es/es.service'

@Injectable()
@ValidatorConstraint({ name: 'isClusterExit', async: true })
export class IsClusterExit implements ValidatorConstraintInterface {
  constructor(private esService: ESService) {}

  async validate(clusterName: string) {
    try {
      const result = await this.esService.termQueryFirst(ESIndex.CLUSTER, 'name', clusterName)

      return !!result
    } catch {
      return false
    }
  }

  defaultMessage() {
    return ERROR_MESSAGE.REQUEST_CLUSTER_NOT_EXIST
  }
}
