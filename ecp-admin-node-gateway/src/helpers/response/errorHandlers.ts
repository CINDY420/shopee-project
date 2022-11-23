import { HttpStatus } from '@nestjs/common'
import { hasMetadata } from '@/interfaces/response'
import { parseUnsafeJSON } from '@/helpers/utils/format'
import { nodeKitThrowError } from '@/helpers/utils/throw-error'

import { get, mapValues } from 'lodash'
import axios from 'axios'

interface IHandleAxiosErrorArgs {
  error: Error
  serviceName: string
  code: number
}

export const handleAxiosError = ({ error, serviceName, code }: IHandleAxiosErrorArgs) => {
  if (axios.isAxiosError(error)) {
    let data = error?.response?.data
    if (error.response?.status === HttpStatus.FORBIDDEN && hasMetadata(data)) {
      const { metadata, ...others } = data
      const parsedMetadata = mapValues(metadata, (value) => {
        const { valid, json } = parseUnsafeJSON(value)
        return valid ? json : value
      })
      data = { ...others, metadata: parsedMetadata }
    }
    return nodeKitThrowError({
      code,
      status: error?.response?.status,
      data,
      message: `Request ${serviceName} service failed:${get(
        error,
        ['response', 'data', 'message'],
        'unknown error',
      )}`,
    })
  }
}
