import { registerDecorator, ValidationOptions } from 'class-validator'
import { dedup } from 'common/helpers/array'

import { isStringOrNull, isIntOrNull } from 'common/helpers/paginate'

export function buildDecorator(validator, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: validator
    })
  }
}

export function IsNotRepeat(validationOptions?: ValidationOptions) {
  return buildDecorator(
    {
      validate(value: any[]) {
        const oldLength = value.length
        const newLength = dedup(value).length
        return oldLength === newLength
      }
    },
    validationOptions
  )
}

export function IsNotEmptyArray(validationOptions?: ValidationOptions) {
  return buildDecorator(
    {
      validate(value: any[]) {
        return value && value.length > 0
      }
    },
    validationOptions
  )
}

export function IsNotEmptyObject(validationOptions?: ValidationOptions) {
  return buildDecorator(
    {
      validate(value) {
        return value && Object.keys(value) && Object.keys(value).length > 0
      }
    },
    validationOptions
  )
}

export function IsInArray(targetArray: any[], validationOptions?: ValidationOptions) {
  return buildDecorator(
    {
      validate(value: any[]) {
        return value instanceof Array && value.every((item) => targetArray && targetArray.includes(item))
      }
    },
    validationOptions
  )
}

export function IsStringOrNull(validationOptions?: ValidationOptions) {
  return buildDecorator(
    {
      validate(value: string | null) {
        return isStringOrNull(value)
      }
    },
    validationOptions
  )
}

export function IsIntOrNull(validationOptions?: ValidationOptions) {
  return buildDecorator(
    {
      validate(value: number | null) {
        return isIntOrNull(value)
      }
    },
    validationOptions
  )
}

export function IsMatchRegExp(regExp: RegExp, validationOptions?: ValidationOptions) {
  return buildDecorator(
    {
      validate(value: string) {
        return new RegExp(regExp).test(value)
      }
    },
    validationOptions
  )
}

export function IsItemInArray(targetArray: any[], validationOptions?: ValidationOptions) {
  return buildDecorator(
    {
      validate(value: any) {
        return targetArray.includes(value)
      }
    },
    validationOptions
  )
}
