import { registerDecorator, ValidationOptions } from 'class-validator'

/**
 * 'IsStringify' means a JavaScript Object Notation (JSON) string
 */
export function IsStringify(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringify',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: {
        message: `'${propertyName}' must be a valid JSON`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') {
            return false
          }
          try {
            const parseValue = JSON.parse(value)
            if (parseValue === null || parseValue === undefined) {
              return false
            }
            if (Array.isArray(parseValue)) {
              return false
            }
            if (typeof parseValue !== 'object') {
              return false
            }

            return true
          } catch {
            return false
          }
        },
      },
    })
  }
}
