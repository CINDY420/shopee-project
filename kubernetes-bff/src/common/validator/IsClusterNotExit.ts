import { Injectable } from '@nestjs/common'
import { ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator'
import { ERROR_MESSAGE } from 'common/constants/error'
import { ESIndex } from 'common/constants/es'
import { ESService } from 'common/modules/es/es.service'

@Injectable()
@ValidatorConstraint({ name: 'isClusterNotExit', async: true })
export class IsClusterNotExit implements ValidatorConstraintInterface {
  constructor(private esService: ESService) {}

  async validate(clusterName: string) {
    try {
      const result = await this.esService.termQueryFirst(ESIndex.CLUSTER, 'name', clusterName)
      return !result
    } catch (e) {
      return false
    }
  }

  defaultMessage() {
    return ERROR_MESSAGE.REQUEST_NAME_EXIST
  }
}
