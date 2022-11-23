/* eslint-disable */
import fetch from 'src/helpers/fetch'
import * as types from '../models'

export interface IEksSecretController_listEksSecretsParams {
  clusterId: string
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type EksSecretController_listEksSecretsFn = (
  params: IEksSecretController_listEksSecretsParams
) => Promise<types.IListEksSecretsResponse>

export const eksSecretController_listEksSecrets: EksSecretController_listEksSecretsFn = async ({
  clusterId,
  offset,
  limit,
  orderBy,
  filterBy,
  searchBy
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/secrets`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, searchBy }
  })

  return body
}

export interface IEksSecretController_listAllNamespacesParams {
  clusterId: string
  searchBy?: string
}

type EksSecretController_listAllNamespacesFn = (
  params: IEksSecretController_listAllNamespacesParams
) => Promise<types.IListAllNamespacesResponse>

export const eksSecretController_listAllNamespaces: EksSecretController_listAllNamespacesFn =
  async ({ clusterId, searchBy }) => {
    const body = await fetch({
      resource: `ecpadmin/eks/clusters/${clusterId}/secrets/namespaces`,
      method: 'GET',
      params: { searchBy }
    })

    return body
  }

export interface IEksSecretController_listAllTypesParams {
  clusterId: string
}

type EksSecretController_listAllTypesFn = (
  params: IEksSecretController_listAllTypesParams
) => Promise<types.IListAllTypesResponse>

export const eksSecretController_listAllTypes: EksSecretController_listAllTypesFn = async ({
  clusterId
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/secrets/types`,
    method: 'GET'
  })

  return body
}

export interface IEksSecretController_getEksSecretParams {
  clusterId: string
  secretName: string
  namespace: string
}

type EksSecretController_getEksSecretFn = (
  params: IEksSecretController_getEksSecretParams
) => Promise<types.IGetEksSecretResponse>

export const eksSecretController_getEksSecret: EksSecretController_getEksSecretFn = async ({
  clusterId,
  secretName,
  namespace
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/secrets/${secretName}`,
    method: 'GET',
    params: { namespace }
  })

  return body
}

export interface IEksSecretController_listEksSecretDetailParams {
  clusterId: string
  secretName: string
  offset?: string
  limit?: string
  namespace: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type EksSecretController_listEksSecretDetailFn = (
  params: IEksSecretController_listEksSecretDetailParams
) => Promise<types.IListEksSecretDetailResponse>

export const eksSecretController_listEksSecretDetail: EksSecretController_listEksSecretDetailFn =
  async ({ clusterId, secretName, offset, limit, namespace, orderBy, filterBy, searchBy }) => {
    const body = await fetch({
      resource: `ecpadmin/eks/clusters/${clusterId}/secrets/${secretName}/secretDetail`,
      method: 'GET',
      params: { offset, limit, namespace, orderBy, filterBy, searchBy }
    })

    return body
  }
