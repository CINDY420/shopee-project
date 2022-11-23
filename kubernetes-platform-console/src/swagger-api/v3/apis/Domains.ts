import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IDomainsControllerGetDomainParams {
  clusterName: string
  domainName: string
  searchBy?: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type DomainsControllerGetDomainFn = (params: IDomainsControllerGetDomainParams) => Promise<types.IGetDomainResponseDto>

export const domainsControllerGetDomain: DomainsControllerGetDomainFn = async ({
  clusterName,
  domainName,
  searchBy,
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/domains/${domainName}`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, searchBy }
  })

  return body
}

export interface IDomainsControllerGetDomainGroupsParams {
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type DomainsControllerGetDomainGroupsFn = (
  params: IDomainsControllerGetDomainGroupsParams
) => Promise<types.IGetDomainGroupsResponseDto>

export const domainsControllerGetDomainGroups: DomainsControllerGetDomainGroupsFn = async ({
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: 'v3/domainGroups',
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface IDomainsControllerGetDomainGroupParams {
  domainGroupName: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type DomainsControllerGetDomainGroupFn = (
  params: IDomainsControllerGetDomainGroupParams
) => Promise<types.IGetDomainGroupResponseDto>

export const domainsControllerGetDomainGroup: DomainsControllerGetDomainGroupFn = async ({
  domainGroupName,
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/domainGroups/${domainGroupName}`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}
