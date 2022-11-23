import { HttpStatus } from '@nestjs/common'
import { CustomException } from '@/common/models/custom-exception'
import { ICustomErrorParams } from '@/common/constants/error'
import { format } from 'util'

export function throwError(params: ICustomErrorParams): never
export function throwError(params: ICustomErrorParams, ...messageParams: string[]): never
export function throwError(message: string): never
export function throwError(message: string, code: number, status: HttpStatus): never
export function throwError(
  firstParams: string | ICustomErrorParams,
  ...others: [number, HttpStatus] | string[]
): never {
  if (typeof firstParams === 'string') {
    throw new CustomException(
      firstParams,
      typeof others[0] === 'number' ? others[0] : -1,
      typeof others[1] !== 'string' ? others[1] : HttpStatus.INTERNAL_SERVER_ERROR,
    )
  }
  throw new CustomException(
    format(firstParams.message, ...others),
    firstParams.code,
    firstParams.status,
  )
}
