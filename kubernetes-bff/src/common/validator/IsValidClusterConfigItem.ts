import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ValidatorConstraintInterface, ValidatorConstraint, ValidationArguments } from 'class-validator'
import { ERROR_MESSAGE } from 'common/constants/error'
import { checkIsSubsetArray, dedup } from 'common/helpers/array'
import { IGlobalConfig } from 'common/interfaces'
import { ESService } from 'common/modules/es/es.service'

enum ClusterConfigKeys {
  cids = 'cids',
  groups = 'groups',
  environments = 'envs',
  envs = 'environments'
}

@Injectable()
@ValidatorConstraint({ name: 'IsValidClusterConfigItem', async: true })
export class IsValidClusterConfigItem implements ValidatorConstraintInterface {
  private message = 'invalid'

  constructor(private esService: ESService, private configService: ConfigService) {}

  async validate(items: unknown, args: ValidationArguments) {
    // check if it is an array
    if (!Array.isArray(items)) {
      return false
    } else {
      // check if value is string type
      let somethingIsNotString = false
      items.forEach((item) => {
        if (typeof item !== 'string' || item === '') {
          somethingIsNotString = true
        }
      })

      // check duplicate value
      const isUniqueValueArray = dedup(items).length === items.length

      // check if array is subset of global config
      let { property } = args
      // huadong TODO remove in v1.1
      if (property === 'tenants') {
        property = 'groups'
      }
      const globalConfig = this.configService.get<IGlobalConfig>('global')
      const globalValues = globalConfig[ClusterConfigKeys[property]]
      const isSubset = checkIsSubsetArray<string>(items, globalValues)

      return !somethingIsNotString && isUniqueValueArray && items.length > 0 && isSubset
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${ERROR_MESSAGE.REQUEST_BODY_INVALID}: ${args.property} ${this.message}`
  }
}
