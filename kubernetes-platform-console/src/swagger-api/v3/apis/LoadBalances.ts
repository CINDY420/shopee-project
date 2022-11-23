import fetch from 'helpers/fetch'
import * as types from '../models'

export interface ILoadBalanceControllerGetInfoParams {
  type: 'live' | 'nonlive'
}

type LoadBalanceControllerGetInfoFn = (params: ILoadBalanceControllerGetInfoParams) => Promise<any>

export const loadBalanceControllerGetInfo: LoadBalanceControllerGetInfoFn = async ({ type }) => {
  const body = await fetch({
    resource: 'v3/loadbalance/info',
    method: 'GET',
    params: { type }
  })

  return body
}

type LoadBalanceControllerGetTemplateFn = () => Promise<any>

export const loadBalanceControllerGetTemplate: LoadBalanceControllerGetTemplateFn = async () => {
  const body = await fetch({
    resource: 'v3/loadbalance/template',
    method: 'GET'
  })

  return body
}

export interface ILoadBalanceControllerRenderTemplateParams {
  payload: types.IRenderTemplateBodyDto
}

type LoadBalanceControllerRenderTemplateFn = (params: ILoadBalanceControllerRenderTemplateParams) => Promise<any>

export const loadBalanceControllerRenderTemplate: LoadBalanceControllerRenderTemplateFn = async ({ payload }) => {
  const body = await fetch({
    resource: 'v3/loadbalance/template/render',
    method: 'POST',
    payload
  })

  return body
}
