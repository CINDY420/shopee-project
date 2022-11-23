import { FetchConfigFunc, IUserFetchParams } from '@infra/rapper/runtime/commonLib'
import { HTTPError } from '@space/common-http'
import { overrideFetch } from 'src/rapper'
import fetch from 'src/helpers/fetch'
import { message } from 'infrad'

export const overrideRapper = () => {
  const overFunc: FetchConfigFunc = async (config: IUserFetchParams) => {
    const { url, method, params, extra } = config
    const resource = url.startsWith('/') ? url.substring(1) : url
    const { contentType, headers, ...others } = extra || {}

    let fetchParams = {}
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      fetchParams = { payload: params }
    } else {
      fetchParams = { params }
    }
    try {
      const response = await fetch({
        resource,
        method,
        ...fetchParams,
        headers: { 'Content-Type': contentType || 'application/json', ...headers },
        ...others,
      })
      if (__SERVER_ENV__ === 'mock') {
        return response
      }
      return response?.data
    } catch (error) {
      if (error instanceof HTTPError) {
        error?.message && message.error(error.message)
        throw error.message
      } else {
        console.error('unknown error', error)
      }
    }
  }
  overrideFetch(overFunc)
}
