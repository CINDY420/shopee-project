/**
 * nodejs error table example
 */
import { HttpStatus } from '@nestjs/common'

export interface ICustomErrorParams {
  message: string
  code: number
  status: HttpStatus
}

// code rule: -[aa][bb][cc] aa是大类 比如1代表系统错误，2代表第三方服务错误，[bb]是次大类，[cc]是第几种错误

// for all system error
const SYSTEM_ERROR = {
  // other system errors: -100xx
  UNKNOWN: {
    code: -10000,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'unknown system error',
  },
  // config service error: -101xx
  CONFIG_SERVICE: {
    LACK_CONFIG: {
      code: -10101,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'nest config is incomplete',
    },
  },
  UTIL_ERROR: {
    code: -10002,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'util function error: %s',
  },
} as const

// for all third-part Remote service's errors
const REMOTE_SERVICE_ERROR = {
  // ksc open api error: -201xx
  KSC_OPEN_API_ERROR: {
    UNKNOWN_ERROR: {
      code: -20100,
      message: '[openApiService]: %s',
    },
  },
  // sre ticket service error: -202xx
  SRE_TICKET_ERROR: {
    UNKNOWN_ERROR: {
      code: -20200,
      message: '[sreTicketService]: %s',
    },
  },
  // metrics service error: -203xx
  KSC_METRICS_ERROR: {
    UNKNOWN_ERROR: {
      code: -20300,
      message: '[metricsService]: %s',
    },
  },
} as const

export const ERROR = {
  SYSTEM_ERROR,
  REMOTE_SERVICE_ERROR,
} as const
