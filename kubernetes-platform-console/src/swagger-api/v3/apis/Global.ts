import fetch from 'helpers/fetch'
import * as types from '../models'

type GlobalControllerGetMetaDataFn = () => Promise<types.IIMetadataResponse>

export const globalControllerGetMetaData: GlobalControllerGetMetaDataFn = async () => {
  const body = await fetch({
    resource: 'v3/metadata',
    method: 'GET'
  })

  return body
}

type GlobalControllerGetCidsFn = () => Promise<types.IIGlobalDataResponse>

export const globalControllerGetCids: GlobalControllerGetCidsFn = async () => {
  const body = await fetch({
    resource: 'v3/cids',
    method: 'GET'
  })

  return body
}

type GlobalControllerGetEnvsFn = () => Promise<types.IIGlobalDataResponse>

export const globalControllerGetEnvs: GlobalControllerGetEnvsFn = async () => {
  const body = await fetch({
    resource: 'v3/envs',
    method: 'GET'
  })

  return body
}

type GlobalControllerGetGroupsFn = () => Promise<types.IIGlobalDataResponse>

export const globalControllerGetGroups: GlobalControllerGetGroupsFn = async () => {
  const body = await fetch({
    resource: 'v3/grps',
    method: 'GET'
  })

  return body
}

export interface IGlobalControllerGetResourcesParams {
  searchBy: string
}

type GlobalControllerGetResourcesFn = (params: IGlobalControllerGetResourcesParams) => Promise<types.IIResourceResponse>

export const globalControllerGetResources: GlobalControllerGetResourcesFn = async ({ searchBy }) => {
  const body = await fetch({
    resource: 'v3/resources',
    method: 'GET',
    params: { searchBy }
  })

  return body
}

type GlobalControllerGetTemplateTypeFn = () => Promise<types.IIGlobalDataResponse>

export const globalControllerGetTemplateType: GlobalControllerGetTemplateTypeFn = async () => {
  const body = await fetch({
    resource: 'v3/templateType',
    method: 'GET'
  })

  return body
}
