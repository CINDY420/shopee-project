import { isError, all } from '@space/common-http'
import { authFetch } from 'src/commonServices'
import { overrideFetch } from 'src/rapper'
import { FetchConfigFunc, IUserFetchParams } from '@infra/rapper/runtime/commonLib'
import { message } from 'infrad'
import samUtils from 'src/sharedModules/sam/utils'
import { ECP_REGION_QUERY_KEY } from 'src/components/Common/RouteSetRegion'

const { permissionErrorHandler } = samUtils

interface IFetchArgs {
  [key: string]: any
}
interface IRespBody<TData = unknown> {
  status: number
  body: {
    data: TData
    code: number
    message: string
    status: number
    // eslint-disable-next-line @typescript-eslint/naming-convention
    metadata?: Record<string, unknown> & { name: string; service_type: string }
    [key: string]: any
  }
}

const SERVER_MAP: Record<string, string> = {
  mock: 'https://rap.shopee.io/api/app/mock/178',
  dev: 'http://localhost:3000',
  test: 'https://kubernetes.devops.i.test.sz.shopee.io',
  live: 'https://kubernetes.devops.i.sz.shopee.io',
}

function baseFetch(server: string | void) {
  return (fetchArgs: IFetchArgs) =>
    all(authFetch)({ server, ...fetchArgs }).then(({ status, body }: IRespBody) => {
      if (isError(status)) {
        if (status === 403 && body.metadata) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { name = '', service_type = '' } = body.metadata

          let serviceName
          if (name && service_type) {
            serviceName = `${name}${service_type === 'service' ? '' : '.*'}`
          } else {
            serviceName = window.location.pathname.split('/').find((t) => t.startsWith('shopee.'))
          }
          permissionErrorHandler(body.metadata, fetchArgs, serviceName)
        }

        /*
         * cmdb error property: error_detailed or error
         * ecp error property: message
         */

        throw new Error(body?.error_detailed || body?.message || body?.error)
      } else if (fetchArgs.cleaner) {
        return fetchArgs.cleaner(body)
      } else {
        return body
      }
    })
}

function showError(error: Error, customMessage: string = null) {
  let errorMessage = error?.message
  if (typeof errorMessage !== 'string') {
    errorMessage = (error?.message as unknown as Error)?.message
  }
  message.error(`${customMessage || 'Action failed.'} Error details : ${errorMessage || 'N/A'}`)
}

function getLocationQuery(query: string) {
  const search = window.location.search
  const searchParams = new URLSearchParams(search)

  return searchParams.get(query)
}

export function overrideRapper() {
  const ecpRegion = getLocationQuery(ECP_REGION_QUERY_KEY)
  const server = SERVER_MAP[__SERVER_ENV__] || SERVER_MAP.test
  const fetch = (fetchArgs: IFetchArgs) => baseFetch(server)(fetchArgs)
  const overrideFunc = async (config: IUserFetchParams) => {
    const { url, method, params, extra } = config
    const { contentType = 'application/json', headers } = extra
    const resource = url.startsWith('/') ? url.substring(1) : url
    try {
      const response = await fetch({
        method,
        resource,
        headers: {
          'Content-Type': contentType,
          'ecp-region': ecpRegion,
          ...headers,
        },
        ...(method === 'GET' ? { params } : { payload: params }),
      })
      if (typeof response === 'string' || server === SERVER_MAP.mock) {
        return response
      }
      return response.data
    } catch (error) {
      showError(error)
      throw error
    }
  }

  overrideFetch(overrideFunc as FetchConfigFunc)
}
