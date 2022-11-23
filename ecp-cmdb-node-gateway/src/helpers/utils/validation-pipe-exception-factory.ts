import { ValidationError } from 'class-validator'
import { throwError } from '@infra-node-kit/exception'

export const exceptionFactory = function (errors: ValidationError[]) {
  if (errors.length > 0) {
    const error = errors.shift()
    const constraints = (<ValidationError>error).constraints
    const contexts = (<ValidationError>error).contexts
    for (const key in constraints) {
      let code = 400
      if (contexts && (<any>contexts)[key]) {
        code = (<any>contexts)[key].errorCode
      }
      throwError(constraints[key] || 'request query or param has some error', code)
    }
  }
}
