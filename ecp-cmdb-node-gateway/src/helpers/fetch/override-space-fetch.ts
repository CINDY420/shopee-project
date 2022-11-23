import { FetchConfigFunc, IUserFetchParams } from '@infra/rapper/runtime/commonLib'
import { AxiosRequestConfig, AxiosError, AxiosInstance } from 'axios'
import { throwError } from '@infra-node-kit/exception'
import { createFetch } from '@/rapper/space/index'
import { HttpStatus } from '@nestjs/common'
import { LogActions } from '@/helpers/constants/log.constant'
import { ResCode } from '@/helpers/constants/res-code'
import { SpaceAuthService } from '@infra-node-kit/space-auth'
export interface IOverConfig {
  baseURL: string
}

export function overRideSpaceFetch(
  axiosRef: AxiosInstance,
  config: IOverConfig,
  authService: SpaceAuthService,
) {
  const { baseURL } = config
  const overrideFunc: FetchConfigFunc = async function <T>({
    url,
    method,
    params,
  }: IUserFetchParams) {
    const token = authService.getUser()?.auth ?? ''
    const axiosConfig: AxiosRequestConfig = {
      baseURL,
      method,
      url,
      headers: {
        Authorization: token,
        'X-App-Name': 'ECP-BFF',
      },
    }
    if (method.toUpperCase() === 'GET') {
      axiosConfig.params = params
    } else {
      axiosConfig.data = params
    }
    const response = await axiosRef
      .request(axiosConfig)
      .catch((error: AxiosError) => {
        // 内部已经打 error 日志 这里是为了指定返回内容
        const status = error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        const isForbidden = status === HttpStatus.FORBIDDEN
        throwError({
          writeLog: false,
          message: `${method.toUpperCase()} ${baseURL}${url} error`,
          code: isForbidden ? ResCode.CMDB_SERVICE_FORBIDDEN : ResCode.FETCHERROR,
          status,
          data: error?.response?.data,
        })
      })
      .then((res) => {
        if (res.data && typeof res.data.errno === 'number' && res.data.errno !== 0) {
          // 如果用户在上层 catch error 就不会有报警
          return throwError({
            action: LogActions.CMDBFETCH_ERRNO,
            message: res.data.errmsg,
            code: res.data.errno,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
          })
        }
        return res
      })
    return response.data as unknown as T
  }
  return createFetch(overrideFunc)
}
