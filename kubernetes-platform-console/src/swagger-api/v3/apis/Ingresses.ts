import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IIngressesControllerGetClusterIngressesParams {
  offset?: number
  limit?: number
  searchBy?: string
  clusterName: string
}

type IngressesControllerGetClusterIngressesFn = (
  params: IIngressesControllerGetClusterIngressesParams
) => Promise<types.IIngressListResponseDto>

export const ingressesControllerGetClusterIngresses: IngressesControllerGetClusterIngressesFn = async ({
  offset,
  limit,
  searchBy,
  clusterName
}) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/ingresses`,
    method: 'GET',
    params: { offset, limit, searchBy }
  })

  return body
}

type IngressesControllerGetIngressesTreeFn = () => Promise<string[]>

export const ingressesControllerGetIngressesTree: IngressesControllerGetIngressesTreeFn = async () => {
  const body = await fetch({
    resource: 'v3/ingresses/tree',
    method: 'GET'
  })

  return body
}
