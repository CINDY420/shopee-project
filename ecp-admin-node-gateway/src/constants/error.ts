import { HttpStatus } from '@nestjs/common'

/*
 * Refer to https://git.garena.com/shopee/sz-devops/fe/infra-base/infra-node-kit/-/blob/master/packages/exception/src/types.ts#L41
 * auth error: -100xx
 */
export const AUTH_ERROR = {
  NO_BEARER_TOKEN: {
    code: -10001,
    status: HttpStatus.UNAUTHORIZED,
    message: 'No bearer token!',
  },
  VALIDATE_BEARER_TOKEN_FAILED: {
    code: -10002,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Validate space token failed!',
  },
  TOKEN_WITHOUT_EMAIL: {
    code: -10003,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Can not extract email from token!',
  },
  NO_ACCESS_PERMISSION: {
    code: -10004,
    status: HttpStatus.FORBIDDEN,
    message: 'You have no access permission!',
  },
  UNKNOWN_ERROR: {
    code: -10005,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Unknown error!',
  },
} as const

// ECP Apis error: -101xx
export const ECP_APIS_ERROR = {
  REQUEST_FAILED_ERROR: {
    code: -10100,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Request ECP apis service failed!',
  },
  UNKNOWN_ERROR: {
    code: -10101,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'ECP apis unknown error!',
  },
} as const

// Space Az error: -102xx
export const SPACE_AZ_ERROR = {
  REQUEST_FAILED_ERROR: {
    code: -10200,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Request Space AZ service failed!',
  },
  UNKNOWN_ERROR: {
    code: -10201,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Space AZ unknown error!',
  },
  SPACE_AZ_API_ERROR: {
    code: -10402,
    status: HttpStatus.BAD_GATEWAY,
    message: "[Space AZ API] API '%s' failed with result: %s",
  },
} as const

// System error: -103xx
export const SYSTEM_ERROR = {
  LIST_QUERY_ERROR: {
    code: -10300,
    status: HttpStatus.BAD_REQUEST,
    message: 'unsupported list query',
  },
  RESOURCE_NOT_FOUND_ERROR: {
    code: -10301,
    status: HttpStatus.NOT_FOUND,
    message: 'Resource not found',
  },
  BAD_REQUEST_ERROR: {
    code: -10302,
    status: HttpStatus.BAD_REQUEST,
    message: 'Bad request',
  },
} as const

// Space CMDB error: -104xx
export const SPACE_CMDB_ERROR = {
  UNKNOWN_ERROR: {
    code: -10400,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '[Space CMDB Rapper] Unknown error!',
  },
  REQUEST_FAILED_ERROR: {
    code: -10401,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '[Space CMDB Rapper] Request failed!',
  },
  SPACE_CMDB_API_ERROR: {
    code: -10402,
    status: HttpStatus.BAD_GATEWAY,
    message: "[Space CMDB API] API '%s' failed with code: %s",
  },
} as const

// EKS Cluster Apis error: -105xx
export const EKS_CLUSTER_APIS_ERROR = {
  NOT_FOUND_JOB: {
    code: -10500,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Not found job with cluster id: %s',
  },
  CREATE_CLUSTER_FAILED: {
    code: -10501,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Create cluster failed: %s ',
  },
  REQUEST_FAILED_ERROR: {
    code: -10502,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Request EKS apis service failed!',
  },
  UNKNOWN_ERROR: {
    code: -10503,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'EKS apis Unknown error!',
  },
} as const

// ECP Admmin Apis error: -106xx
export const ECP_ADMIN_APIS_ERROR = {
  REQUEST_FAILED_ERROR: {
    code: -10600,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Request ECP admin apis service failed!',
  },
  UNKNOWN_ERROR: {
    code: -10601,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'ECP admin apis unknown error!',
  },
} as const

// ETCD Apis error: -107xx
export const ETCD_APIS_ERROR = {
  REQUEST_FAILED_ERROR: {
    code: -10700,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Request ETCD apis service failed!',
  },
  UNKNOWN_ERROR: {
    code: -10701,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'ETCD apis Unknown error!',
  },
} as const
