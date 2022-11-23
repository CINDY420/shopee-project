/**
 * nodejs error table example
 */
import { HttpStatus } from '@nestjs/common'

export interface ICustomErrorParams {
  message: string
  code: number
  status: HttpStatus
}

// code rule: -[a][bb][cc] aa是大类 比如1代表系统错误，2代表第三方服务错误，[bb]是次大类，[cc]是第几种错误

// for all system error
const SYSTEM_ERROR = {
  // other system errors: -100xx
  OTHER: {
    UNKNOWN: {
      code: -10000,
      status: HttpStatus.EXPECTATION_FAILED,
      message: 'unknown system error',
    },
  },
  // common system errors: -101xx
  COMMON: {
    LIST_QUERY_ERROR: {
      code: -10101,
      status: HttpStatus.BAD_REQUEST,
      message: 'unsupported list query: %s',
    },
    PARSE_REQUEST_PARAMS_ERROR: {
      code: -10102,
      status: HttpStatus.BAD_REQUEST,
      message: 'parse %s error: %s',
    },
    EXECUTE_ERROR: {
      code: -10103,
      status: HttpStatus.BAD_REQUEST,
      message: 'request failed: %s',
    },
  },
  // config service error: -102xx
  CONFIG_SERVICE: {
    LACK_CONFIG: {
      code: -10201,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'nest config is incomplete',
    },
  },
  AUTH: {
    GITLAB_UNAUTHORIZED_ERROR: {
      code: -10301,
      status: HttpStatus.EXPECTATION_FAILED,
      message: 'gitlab unauthorized exception',
    },
    GET_USER_INFO_ERROR: {
      code: -10302,
      status: HttpStatus.FORBIDDEN,
      message: 'get user info error: %s',
    },
  },
  SQL: {
    REQUEST_ERROR: {
      code: -10401,
      status: HttpStatus.BAD_REQUEST,
      message: 'failed to CRUD database: %s',
    },
  },
  GITLAB_SERVICE: {
    EXECUTE_ERROR: {
      code: -10501,
      status: HttpStatus.EXPECTATION_FAILED,
      message: 'gitlab service error failed: %s',
    },
  },
} as const

// for all third-part Remote service's errors
const REMOTE_SERVICE_ERROR = {
  SPACE_API_ERROR: {
    REQUEST_ERROR: {
      code: -20201,
      status: HttpStatus.EXPECTATION_FAILED,
      message: 'space api execute failed: %s',
    },
  },
  GITLAB: {
    VALIDATE_ERROR: {
      code: -10501,
      status: HttpStatus.BAD_REQUEST,
      message: 'validate failed from gitlab: %s',
    },
    REQUEST_ERROR: {
      code: -10502,
      status: HttpStatus.BAD_REQUEST,
      message: 'gitlab request failed: %s',
    },
  },
}

export const ERROR = {
  SYSTEM_ERROR,
  REMOTE_SERVICE_ERROR,
} as const
