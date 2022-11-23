import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator'
import { MEMORY_UNIT } from '@/common/constants/quota'

export function buildDecorator(validator: ValidatorConstraintInterface, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator,
    })
  }
}

export function IsValidMemoryQuota(validationOptions?: ValidationOptions) {
  return buildDecorator(
    {
      validate(memoryQuota: string) {
        return typeof memoryQuota === 'string' && Object.values(MEMORY_UNIT).some((unit) => memoryQuota.endsWith(unit))
      },
    },
    validationOptions,
  )
}
