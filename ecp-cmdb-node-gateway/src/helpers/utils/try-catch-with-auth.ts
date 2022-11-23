import { ERROR } from '@/helpers/constants/error'
import { ResCode } from '@/helpers/constants/res-code'
import { SamDefinedResponsePermissionProperty } from '@/helpers/constants/sam'
import { ICMDBServiceResponse, IEcpServiceResponse } from '@/helpers/interfaces/response'
import { tryCatchOptional } from '@/helpers/utils/try-catch-optional'
import { CustomException } from '@infra-node-kit/exception/dist/models/custom-exception'
import { ForbiddenException } from '@nestjs/common'
import { pick, has, mapValues } from 'lodash'

function isCustomException(error: unknown): error is CustomException {
  return error instanceof CustomException
}

function isForbiddenException(error: unknown): error is ForbiddenException {
  return error instanceof ForbiddenException
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function hasErrorProperty(obj: unknown): obj is { error_detailed: string } {
  return has(obj, 'error_detailed')
}
function hasMessageProperty(obj: unknown): obj is { message: string } {
  return has(obj, 'message')
}

function handleUnsafeJSON<TData = unknown>(
  jsonString: string,
): { valid: boolean; json: TData | undefined } {
  try {
    const json = JSON.parse(jsonString)
    return { valid: true, json }
  } catch (e) {
    return { valid: false, json: undefined }
  }
}

export async function tryCatchWithAuth<TReturn, TError extends Error = CustomException>(
  promise: Promise<TReturn> | TReturn,
): Promise<[TReturn, null] | [null, TError]> {
  return tryCatchOptional<TReturn, TError>(promise, (error) => {
    // for call stack
    if (isForbiddenException(error)) {
      throw error
    }

    if (isCustomException(error)) {
      const { response } = error
      const { code, data } = response

      if (code === ResCode.ECP_SERVICE_FORBIDDEN) {
        const { metadata } = data as IEcpServiceResponse
        const serializeMetadata = {
          ...metadata,
          ...mapValues(
            pick(
              metadata as ICMDBServiceResponse,
              Object.values(SamDefinedResponsePermissionProperty),
            ),
            (value: string) => {
              const { valid, json } = handleUnsafeJSON(value)
              if (valid) {
                return json
              }

              // return the default value from origin, won't work normally
              return value
            },
          ),
        }

        throw new ForbiddenException({
          message: hasMessageProperty(data)
            ? data.message
            : ERROR.SYSTEM_ERROR.AUTH.FORBIDDEN_ERROR,
          metadata: {
            ...metadata,
            ...serializeMetadata,
          },
        })
      }

      if (code === ResCode.CMDB_SERVICE_FORBIDDEN) {
        throw new ForbiddenException({
          metadata: data,
          message: hasErrorProperty(data)
            ? data.error_detailed
            : ERROR.SYSTEM_ERROR.AUTH.FORBIDDEN_ERROR,
        })
      }
    }
  })
}
