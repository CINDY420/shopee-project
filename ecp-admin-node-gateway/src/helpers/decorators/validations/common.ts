import { registerDecorator, ValidationOptions } from 'class-validator'

export function buildDecorator(validator: any, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator,
    })
  }
}

export function RegValid(reg: RegExp, validationOptions?: ValidationOptions) {
  return buildDecorator(
    {
      validate(value: any) {
        return typeof value === 'string' && reg.test(value)
      },
    },
    validationOptions,
  )
}
