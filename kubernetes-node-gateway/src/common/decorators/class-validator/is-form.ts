import { registerDecorator, ValidationOptions } from 'class-validator'

/**
 * 'IsForm' means an object with type Record<string, number | string>, just like a form data object form font-end
 */
export function IsForm(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isForm',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: {
        message: `'${propertyName}' must be a map, and the value type must be number or string`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown) {
          if (value === null || value === undefined) {
            return false
          }
          if (Array.isArray(value)) {
            return false
          }
          if (typeof value !== 'object') {
            return false
          }
          return Object.values(value).every(
            (valueOfObject) => typeof valueOfObject === 'string' || typeof valueOfObject === 'number',
          )
        },
      },
    })
  }
}
