/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

type GlobalController_listAllPlatformsFn = (extra?: any) => Promise<types.IListEnumsResponse>

export const globalController_listAllPlatforms: GlobalController_listAllPlatformsFn = async (
  extra?: any
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/enums/platform',
      method: 'GET'
    },
    extra
  )

  return body
}

type GlobalController_listAllClusterTypesFn = (extra?: any) => Promise<types.IListEnumsResponse>

export const globalController_listAllClusterTypes: GlobalController_listAllClusterTypesFn = async (
  extra?: any
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/enums/clusterType',
      method: 'GET'
    },
    extra
  )

  return body
}

type GlobalController_listAllAZPropertiesFn = (extra?: any) => Promise<types.IListEnumsResponse>

export const globalController_listAllAZProperties: GlobalController_listAllAZPropertiesFn = async (
  extra?: any
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/enums/azProperties',
      method: 'GET'
    },
    extra
  )

  return body
}

type GlobalController_listAllAZTypesFn = (extra?: any) => Promise<types.IListEnumsResponse>

export const globalController_listAllAZTypes: GlobalController_listAllAZTypesFn = async (
  extra?: any
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/enums/azTypes',
      method: 'GET'
    },
    extra
  )

  return body
}

type GlobalController_listAllEcpVersionsFn = (extra?: any) => Promise<types.IListEnumsResponse>

export const globalController_listAllEcpVersions: GlobalController_listAllEcpVersionsFn = async (
  extra?: any
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/enums/ecpVersion',
      method: 'GET'
    },
    extra
  )

  return body
}

type GlobalController_listAllAzsFn = (extra?: any) => Promise<types.IListAllAzsResponse>

export const globalController_listAllAzs: GlobalController_listAllAzsFn = async (extra?: any) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/azs',
      method: 'GET'
    },
    extra
  )

  return body
}

type GlobalController_listAllSegmentNamesFn = (
  extra?: any
) => Promise<types.IListAllSegmentNamesResponse>

export const globalController_listAllSegmentNames: GlobalController_listAllSegmentNamesFn = async (
  extra?: any
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/segmentNames',
      method: 'GET'
    },
    extra
  )

  return body
}

export interface IGlobalController_listAzSegmentsParams {
  env?: string
}

type GlobalController_listAzSegmentsFn = (
  params: IGlobalController_listAzSegmentsParams,
  extra?: any
) => Promise<types.IListAzsSegmentsResponse>

export const globalController_listAzSegments: GlobalController_listAzSegmentsFn = async (
  { env },
  extra
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/azSegments',
      method: 'GET',
      params: { env }
    },
    extra
  )

  return body
}

type GlobalController_listEnvsFn = (extra?: any) => Promise<types.IListAllEnvsResponse>

export const globalController_listEnvs: GlobalController_listEnvsFn = async (extra?: any) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/envs',
      method: 'GET'
    },
    extra
  )

  return body
}

type GlobalController_listCIDsFn = (extra?: any) => Promise<types.IListAllCIDsResponse>

export const globalController_listCIDs: GlobalController_listCIDsFn = async (extra?: any) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/cids',
      method: 'GET'
    },
    extra
  )

  return body
}

type GlobalController_listAllAZv1sFn = (extra?: any) => Promise<types.IListEnumsResponse>

export const globalController_listAllAZv1s: GlobalController_listAllAZv1sFn = async (
  extra?: any
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/allAZv1s',
      method: 'GET'
    },
    extra
  )

  return body
}
