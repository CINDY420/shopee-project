import { isError, HTTPError, all } from '@space/common-http'
import { authFetch } from 'src/commonServices'
import { baseUrl } from 'src/constants/server'
import { message } from 'infrad'
import { loadSharedModules } from '@space/common-utils'
import UtilitySamUtils from 'space_utility_sam/utils'

const sharedModules = await loadSharedModules([
  { scope: 'utility', container: 'sam', module: 'utils' },
])
const utils: typeof UtilitySamUtils = sharedModules.utility.sam.utils

const { permissionErrorHandler } = utils

const DEFAULT_SERVICE_NAME = '*'

interface IFetchArgs {
  [key: string]: any
}
interface IRespBody {
  status: number
  body: any
}

function baseFetch(server: string | void) {
  return (fetchArgs: IFetchArgs) =>
    all(authFetch)({ server, ...fetchArgs }).then(({ status, body }: IRespBody) => {
      if (isError(status)) {
        if (status === 403 && body?.data) {
          const { name, service_type: serviceType } = body.data.metadata

          permissionErrorHandler(
            body.data.metadata,
            fetchArgs,
            name ?? DEFAULT_SERVICE_NAME,
            serviceType,
          )
        }
        throw new HTTPError(body.message, body.code, body.details)
      } else if (fetchArgs.cleaner) {
        return fetchArgs.cleaner(body)
      } else {
        return body
      }
    })
}

export default baseFetch(baseUrl)

export const spaceFetch = baseFetch

interface IFetchParam {
  resource: string
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT'
  params?: object
  contentType?: string
  payload?: object
  timeout?: number
}

interface IFetchExtra {
  disableError?: boolean
}

export const HTTPFetch = async (
  {
    resource,
    method = 'GET',
    params,
    contentType = 'application/json',
    payload,
    timeout = 1000 * 60,
  }: IFetchParam,
  extra: IFetchExtra,
) => {
  const fetch = (fetchArgs: IFetchArgs) => baseFetch(`${baseUrl}`)(fetchArgs)
  const headers = {
    'Content-Type': contentType,
  }
  try {
    const response = await fetch({
      resource,
      method,
      params,
      contentType,
      headers,
      payload,
      timeout,
    })
    return response.data
  } catch (error) {
    if (error instanceof HTTPError) {
      !extra?.disableError && error?.message && message.error(error.message)
      throw error.message
    }
  }
}
