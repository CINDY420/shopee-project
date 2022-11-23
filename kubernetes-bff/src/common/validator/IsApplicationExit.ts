import { Injectable } from '@nestjs/common'
import { ValidatorConstraintInterface, ValidatorConstraint, ValidationArguments } from 'class-validator'
import { ERROR_MESSAGE } from 'common/constants/error'
import { ESIndex } from 'common/constants/es'
import { ESService } from 'common/modules/es/es.service'

@Injectable()
@ValidatorConstraint({ name: 'isApplicationExit', async: true })
export class IsApplicationExit implements ValidatorConstraintInterface {
  constructor(private esService: ESService) {}

  async validate(applicationName: string, args: ValidationArguments) {
    if (!applicationName) {
      return false
    }

    try {
      const { object } = args
      const { projectName } = object as any
      const result = await this.esService.getById(ESIndex.APPLICATION, `${applicationName}@${projectName}`)
      if (result === null) {
        return false
      }
      return true
    } catch (e) {
      return false
    }
  }

  defaultMessage() {
    return ERROR_MESSAGE.REQUEST_APPLICATION_NOT_EXIST
  }
}
