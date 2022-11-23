/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

type EksEnumsController_listAllAzSegmentFn = (
  extra?: any
) => Promise<types.IEksListAllAzSegmentResponse>

export const eksEnumsController_listAllAzSegment: EksEnumsController_listAllAzSegmentFn = async (
  extra?: any
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/eks/enums/azSegments',
      method: 'GET'
    },
    extra
  )

  return body
}

type EksEnumsController_listAllEnvsFn = (extra?: any) => Promise<types.IEksListAllEnvsResponse>

export const eksEnumsController_listAllEnvs: EksEnumsController_listAllEnvsFn = async (
  extra?: any
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/eks/enums/envs',
      method: 'GET'
    },
    extra
  )

  return body
}

type EksEnumsController_listAllTemplatesFn = (
  extra?: any
) => Promise<types.IEksListAllTemplatesResponse>

export const eksEnumsController_listAllTemplates: EksEnumsController_listAllTemplatesFn = async (
  extra?: any
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/eks/enums/templates',
      method: 'GET'
    },
    extra
  )

  return body
}

export interface IEksEnumsController_getTemplateDetailParams {
  templateId: string
}

type EksEnumsController_getTemplateDetailFn = (
  params: IEksEnumsController_getTemplateDetailParams,
  extra?: any
) => Promise<types.IEksGetTemplateDetailResponse>

export const eksEnumsController_getTemplateDetail: EksEnumsController_getTemplateDetailFn = async (
  { templateId },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/eks/enums/templates/${templateId}`,
      method: 'GET'
    },
    extra
  )

  return body
}

type EksEnumsController_listAllSpaceTenantsFn = (
  extra?: any
) => Promise<types.IEksListAllSpaceTenantsResponse>

export const eksEnumsController_listAllSpaceTenants: EksEnumsController_listAllSpaceTenantsFn =
  async (extra?: any) => {
    const body = await fetch(
      {
        resource: 'ecpadmin/eks/enums/space/tenants',
        method: 'GET'
      },
      extra
    )

    return body
  }

export interface IEksEnumsController_listAllSpaceTenantProductsParams {
  tenantName: string
}

type EksEnumsController_listAllSpaceTenantProductsFn = (
  params: IEksEnumsController_listAllSpaceTenantProductsParams,
  extra?: any
) => Promise<types.IEksListAllSpaceTenantProductsResponse>

export const eksEnumsController_listAllSpaceTenantProducts: EksEnumsController_listAllSpaceTenantProductsFn =
  async ({ tenantName }, extra) => {
    const body = await fetch(
      {
        resource: `ecpadmin/eks/enums/space/tenants/${tenantName}/products`,
        method: 'GET',
        params: { tenantName }
      },
      extra
    )

    return body
  }

type EksEnumsController_listAllPlatformsFn = (
  extra?: any
) => Promise<types.IEksListAllPlatformsResponse>

export const eksEnumsController_listAllPlatforms: EksEnumsController_listAllPlatformsFn = async (
  extra?: any
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/eks/enums/platforms',
      method: 'GET'
    },
    extra
  )

  return body
}

type EksEnumsController_listAllKubernetesVersionsFn = (
  extra?: any
) => Promise<types.IEksListAllKubernetesVersionsResponse>

export const eksEnumsController_listAllKubernetesVersions: EksEnumsController_listAllKubernetesVersionsFn =
  async (extra?: any) => {
    const body = await fetch(
      {
        resource: 'ecpadmin/eks/enums/kubernetesVersion',
        method: 'GET'
      },
      extra
    )

    return body
  }

export interface IEksEnumsController_listAllVpcsParams {
  platformID: number
  az: string
}

type EksEnumsController_listAllVpcsFn = (
  params: IEksEnumsController_listAllVpcsParams,
  extra?: any
) => Promise<types.IEksListAllVpcsResponse>

export const eksEnumsController_listAllVpcs: EksEnumsController_listAllVpcsFn = async (
  { platformID, az },
  extra
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/eks/enums/vpcs',
      method: 'GET',
      params: { platformID, az }
    },
    extra
  )

  return body
}
