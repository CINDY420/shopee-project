import { isError, HTTPError, all } from '@space/common-http'
import { authFetch } from 'src/commonServices'
import { SERVER_MAP, RESPONSE_STATUS } from 'src/constants/server'
import { message } from 'infrad'
import { NO_PERMISSION } from 'src/constants/routes/routes'

interface IFetchArgs {
  [key: string]: any
}
interface IRespBody {
  status: number
  body: any
}

interface IFetchParam {
  resource: string
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT'
  params?: object
  contentType?: string
  payload?: object
  timeout?: number
}

function baseFetch(server: string | void) {
  return (fetchArgs: IFetchArgs) =>
    all(authFetch)({ server, ...fetchArgs }).then(({ status, body }: IRespBody) => {
      if (isError(status)) {
        if (status === 403 && !body.details) {
          body.details = [
            {
              field: body.message || 'permission denied',
              code: 'PERMISSION_DENIED',
            },
          ]
        }
        throw new HTTPError(body.error, status, body.details)
      } else if (fetchArgs.cleaner) {
        return fetchArgs.cleaner(body)
      } else {
        return body
      }
    })
}

export const HTTPFetch = async ({
  resource,
  method = 'GET',
  params,
  contentType = 'application/json',
  payload,
  timeout = 1000 * 60,
}: IFetchParam) => {
  const server = SERVER_MAP[__SERVER_ENV__] || SERVER_MAP.test
  const fetch = (fetchArgs: IFetchArgs) => baseFetch(`${server}`)(fetchArgs)
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
    if (error && error?.code === RESPONSE_STATUS.NO_PERMISSION) {
      location.assign(NO_PERMISSION)
    }
    if (error instanceof HTTPError) {
      error?.message && message.error(error.message)
      throw error.message
    } else {
      console.error('unknown error', error?.stack)
    }
  }
}
export default HTTPFetch
