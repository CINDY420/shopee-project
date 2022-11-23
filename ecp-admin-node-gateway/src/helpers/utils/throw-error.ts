import { format } from 'node:util'
import { HttpStatus } from '@nestjs/common'
import { throwError as rawThrowError } from '@infra-node-kit/exception'

export const nodeKitThrowError = rawThrowError

export interface ICustomErrorParams {
  message: string
  code: number
  status: HttpStatus
}

export function throwError(params: ICustomErrorParams): never
export function throwError(params: ICustomErrorParams, ...messageParams: (string | number)[]): never
export function throwError(message: string): never
export function throwError(message: string, code: number, status: HttpStatus): never
export function throwError(
  firstParams: string | ICustomErrorParams,
  ...others: [number, HttpStatus] | (string | number)[]
): never {
  if (typeof firstParams === 'string') {
    return rawThrowError({
      message: firstParams,
      code: typeof others[0] === 'number' ? others[0] : -1,
      status: typeof others[1] === 'number' ? others[1] : HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }

  return rawThrowError({
    message: format(firstParams.message, ...others),
    code: firstParams.code,
    status: firstParams.status,
    logMessage: firstParams.message,
    logMessageParams: others.map((item) => String(item)),
  })
}
