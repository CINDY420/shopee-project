import fetch from 'helpers/fetch'
import * as types from '../models'

type FlavorControllerGetDefaultFlavorsFn = () => Promise<types.IClusterFlavorResponse>

export const flavorControllerGetDefaultFlavors: FlavorControllerGetDefaultFlavorsFn = async () => {
  const body = await fetch({
    resource: 'v3/flavors',
    method: 'GET'
  })

  return body
}

export interface IFlavorControllerGetClusterFlavorsParams {
  clusterName: string
}

type FlavorControllerGetClusterFlavorsFn = (
  params: IFlavorControllerGetClusterFlavorsParams
) => Promise<types.IClusterFlavorResponse>

export const flavorControllerGetClusterFlavors: FlavorControllerGetClusterFlavorsFn = async ({ clusterName }) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/flavors`,
    method: 'GET'
  })

  return body
}

export interface IFlavorControllerUpdateClusterFlavorsParams {
  clusterName: string
  payload: types.IUpdateClusterFlavorsRequest
}

type FlavorControllerUpdateClusterFlavorsFn = (params: IFlavorControllerUpdateClusterFlavorsParams) => Promise<any>

export const flavorControllerUpdateClusterFlavors: FlavorControllerUpdateClusterFlavorsFn = async ({
  clusterName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/flavors`,
    method: 'POST',
    payload
  })

  return body
}

export interface IFlavorControllerAddClustersFlavorsParams {
  payload: types.IAddClustersFlavorsRequest
}

type FlavorControllerAddClustersFlavorsFn = (params: IFlavorControllerAddClustersFlavorsParams) => Promise<any>

export const flavorControllerAddClustersFlavors: FlavorControllerAddClustersFlavorsFn = async ({ payload }) => {
  const body = await fetch({
    resource: 'v3/clusters/flavors',
    method: 'POST',
    payload
  })

  return body
}
