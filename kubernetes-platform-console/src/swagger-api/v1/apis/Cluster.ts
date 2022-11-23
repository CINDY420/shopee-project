import fetch from 'helpers/fetchV1'
import * as types from '../models'

type ClusterControllerListSpecialClusterNamesFn = () => Promise<string[]>

export const clusterControllerListSpecialClusterNames: ClusterControllerListSpecialClusterNamesFn = async () => {
  const body = await fetch({
    resource: 'v1/clusters:specialClusterNames',
    method: 'GET'
  })

  return body
}

export interface IClusterControllerGetGlobalHpaParams {
  cluster: string
}

type ClusterControllerGetGlobalHpaFn = (
  params: IClusterControllerGetGlobalHpaParams
) => Promise<types.IGetGlobalHpaResponse>

export const clusterControllerGetGlobalHpa: ClusterControllerGetGlobalHpaFn = async ({ cluster }) => {
  const body = await fetch({
    resource: `v1/clusters/${cluster}/hpa`,
    method: 'GET'
  })

  return body
}

export interface IClusterControllerUpdateGlobalHpaParams {
  cluster: string
  payload: types.IUpdateGlobalHpaBody
}

type ClusterControllerUpdateGlobalHpaFn = (params: IClusterControllerUpdateGlobalHpaParams) => Promise<any>

export const clusterControllerUpdateGlobalHpa: ClusterControllerUpdateGlobalHpaFn = async ({ cluster, payload }) => {
  const body = await fetch({
    resource: `v1/clusters/${cluster}/hpa/update`,
    method: 'POST',
    payload
  })

  return body
}
