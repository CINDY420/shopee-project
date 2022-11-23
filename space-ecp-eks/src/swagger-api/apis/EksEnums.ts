/* eslint-disable */
import fetch from 'src/helpers/fetch'
import * as types from '../models'

type EksEnumsController_listAllAzSegmentFn = () => Promise<types.IEksListAllAzSegmentResponse>

export const eksEnumsController_listAllAzSegment: EksEnumsController_listAllAzSegmentFn =
  async () => {
    const body = await fetch({
      resource: 'ecpadmin/eks/enums/azSegments',
      method: 'GET'
    })

    return body
  }

type EksEnumsController_listAllEnvsFn = () => Promise<types.IEksListAllEnvsResponse>

export const eksEnumsController_listAllEnvs: EksEnumsController_listAllEnvsFn = async () => {
  const body = await fetch({
    resource: 'ecpadmin/eks/enums/envs',
    method: 'GET'
  })

  return body
}

type EksEnumsController_listAllTemplatesFn = () => Promise<types.IEksListAllTemplatesResponse>

export const eksEnumsController_listAllTemplates: EksEnumsController_listAllTemplatesFn =
  async () => {
    const body = await fetch({
      resource: 'ecpadmin/eks/enums/templates',
      method: 'GET'
    })

    return body
  }

export interface IEksEnumsController_getTemplateDetailParams {
  templateId: string
}

type EksEnumsController_getTemplateDetailFn = (
  params: IEksEnumsController_getTemplateDetailParams
) => Promise<types.IEksGetTemplateDetailResponse>

export const eksEnumsController_getTemplateDetail: EksEnumsController_getTemplateDetailFn = async ({
  templateId
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/enums/templates/${templateId}`,
    method: 'GET'
  })

  return body
}

type EksEnumsController_listAllSpaceTenantsFn = () => Promise<types.IEksListAllSpaceTenantsResponse>

export const eksEnumsController_listAllSpaceTenants: EksEnumsController_listAllSpaceTenantsFn =
  async () => {
    const body = await fetch({
      resource: 'ecpadmin/eks/enums/space/tenants',
      method: 'GET'
    })

    return body
  }

export interface IEksEnumsController_listAllSpaceTenantProductsParams {
  tenantName: string
}

type EksEnumsController_listAllSpaceTenantProductsFn = (
  params: IEksEnumsController_listAllSpaceTenantProductsParams
) => Promise<types.IEksListAllSpaceTenantProductsResponse>

export const eksEnumsController_listAllSpaceTenantProducts: EksEnumsController_listAllSpaceTenantProductsFn =
  async ({ tenantName }) => {
    const body = await fetch({
      resource: `ecpadmin/eks/enums/space/tenants/${tenantName}/products`,
      method: 'GET',
      params: { tenantName }
    })

    return body
  }

type EksEnumsController_listAllPlatformsFn = () => Promise<types.IEksListAllPlatformsResponse>

export const eksEnumsController_listAllPlatforms: EksEnumsController_listAllPlatformsFn =
  async () => {
    const body = await fetch({
      resource: 'ecpadmin/eks/enums/platforms',
      method: 'GET'
    })

    return body
  }

type EksEnumsController_listAllKubernetesVersionsFn =
  () => Promise<types.IEksListAllKubernetesVersionsResponse>

export const eksEnumsController_listAllKubernetesVersions: EksEnumsController_listAllKubernetesVersionsFn =
  async () => {
    const body = await fetch({
      resource: 'ecpadmin/eks/enums/kubernetesVersion',
      method: 'GET'
    })

    return body
  }

export interface IEksEnumsController_listAllVpcsParams {
  platformID: number
  az: string
}

type EksEnumsController_listAllVpcsFn = (
  params: IEksEnumsController_listAllVpcsParams
) => Promise<types.IEksListAllVpcsResponse>

export const eksEnumsController_listAllVpcs: EksEnumsController_listAllVpcsFn = async ({
  platformID,
  az
}) => {
  const body = await fetch({
    resource: 'ecpadmin/eks/enums/vpcs',
    method: 'GET',
    params: { platformID, az }
  })

  return body
}
