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
      status: HttpStatus.INTERNAL_SERVER_ERROR,
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
  },
  // config service error: -102xx
  CONFIG_SERVICE: {
    LACK_CONFIG: {
      code: -10201,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'nest config is incomplete',
    },
  },
  // auth service error: -103xx
  AUTH: {
    INIT_ERROR: {
      code: -10310,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'auth init failed: can not get auth config: %s',
    },
    REQUEST_ERROR: {
      code: -10311,
      status: HttpStatus.BAD_REQUEST,
      message: 'request auth service error: %s',
    },
    FORBIDDEN_ERROR: {
      code: -10312,
      status: HttpStatus.FORBIDDEN,
      message: 'request forbidden',
    },
    RESOURCE_FORBIDDEN_ERROR: {
      code: -10313,
      status: HttpStatus.FORBIDDEN,
      message: 'request forbidden',
    },
  },
  // ticket service error: -104xx
  TICKET_SERVICE: {
    UNSUPPORTED_TICKET_TYPE: {
      code: -10401,
      status: HttpStatus.BAD_REQUEST,
      message: 'ticket type is unsupported now',
    },
    CONFIG_LACK: {
      code: -10402,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'ticket configuration is incomplete',
    },
    BAD_CONDITION: {
      code: -10403,
      status: HttpStatus.BAD_REQUEST,
      message: 'query condition is invalid',
    },
    PRECONDITION_FAILED: {
      code: -10404,
      status: HttpStatus.PRECONDITION_FAILED,
      message: "current ticket %s is not operable because it's closed",
    },
    FORBIDDEN: {
      code: -10405,
      status: HttpStatus.FORBIDDEN,
      message: 'You do not have permission to do this action, %s',
    },
  },
  // es service error: -104xx
  ES_SERVICE: {
    REQUEST_ERROR: {
      code: -10510,
      status: HttpStatus.BAD_REQUEST,
      message: 'request es service error: %s',
    },
  },
  // audit interceptor error: -105xx
  AUDIT_INTERCEPTOR: {
    REQUEST_ERROR: {
      code: -10610,
      status: HttpStatus.BAD_REQUEST,
      message: 'request audit service error: %s',
    },
  },
  MAILER: {
    INIT_ERROR: {
      code: -10710,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'init mailer service error: %s',
    },
  },
  ECP_REGION_GUARD: {
    REQUEST_ERROR: {
      code: -10810,
      status: HttpStatus.BAD_REQUEST,
      message: 'request error: %s',
    },
  },
} as const

// for all third-part Remote service's errors
const REMOTE_SERVICE_ERROR = {
  // shopee ticket center error: -201xx
  SHOPEE_TICKET_CENTER_ERROR: {
    GET_TOKEN_FAILED: {
      code: -20101,
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'get shopee ticket center token failed',
    },
    TICKET_OPERATION_FAILED: {
      code: -20102,
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'ticket operation failed: %s',
    },
    ASSIGNEES_LACK: {
      code: -20103,
      status: HttpStatus.BAD_REQUEST,
      message: 'ticket assignees lack',
    },
    TICKET_NOT_FOUND: {
      code: -20104,
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'ticket does not exist',
    },
    TASK_EXECUTE_FAILED: {
      code: -20105,
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'task execute failed: %s',
    },
    SERVICE_IS_NOT_AVAILABLE: {
      code: -20106,
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'stc service is not available: %s',
    },
  },
  OPEN_API_ERROR: {
    REQUEST_ERROR: {
      code: -20201,
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'open api execute failed: %s',
    },
  },
  SPACE_API_ERROR: {
    REQUEST_ERROR: {
      code: -20201,
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'space api execute failed: %s',
    },
  },
} as const

export const ERROR = {
  SYSTEM_ERROR,
  REMOTE_SERVICE_ERROR,
} as const
