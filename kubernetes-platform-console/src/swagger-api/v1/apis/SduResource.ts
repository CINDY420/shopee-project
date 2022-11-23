import fetch from 'helpers/fetchV1'
import * as types from '../models'

type SduResourceControllerListAzsFn = () => Promise<types.IListAzsResponse>

export const sduResourceControllerListAzs: SduResourceControllerListAzsFn = async () => {
  const body = await fetch({
    resource: 'v1/sdu-resource/azs',
    method: 'GET'
  })

  return body
}

type SduResourceControllerListEnvsFn = () => Promise<types.IListEnvsResponse>

export const sduResourceControllerListEnvs: SduResourceControllerListEnvsFn = async () => {
  const body = await fetch({
    resource: 'v1/sdu-resource/envs',
    method: 'GET'
  })

  return body
}

type SduResourceControllerListCidsFn = () => Promise<types.IListCidsResponse>

export const sduResourceControllerListCids: SduResourceControllerListCidsFn = async () => {
  const body = await fetch({
    resource: 'v1/sdu-resource/cids',
    method: 'GET'
  })

  return body
}

export interface ISduResourceControllerListClustersParams {
  az: string
}

type SduResourceControllerListClustersFn = (
  params: ISduResourceControllerListClustersParams
) => Promise<types.IListClustersResponse>

export const sduResourceControllerListClusters: SduResourceControllerListClustersFn = async ({ az }) => {
  const body = await fetch({
    resource: `v1/sdu-resource/${az}/clusters`,
    method: 'GET'
  })

  return body
}

export interface ISduResourceControllerListSegmentsParams {
  az: string
}

type SduResourceControllerListSegmentsFn = (
  params: ISduResourceControllerListSegmentsParams
) => Promise<types.IListSegmentsResponse>

export const sduResourceControllerListSegments: SduResourceControllerListSegmentsFn = async ({ az }) => {
  const body = await fetch({
    resource: `v1/sdu-resource/${az}/segments`,
    method: 'GET'
  })

  return body
}

type SduResourceControllerListMachineModelsFn = () => Promise<types.IListMachineModelsResponse>

export const sduResourceControllerListMachineModels: SduResourceControllerListMachineModelsFn = async () => {
  const body = await fetch({
    resource: 'v1/sdu-resource/machine-models',
    method: 'GET'
  })

  return body
}

type SduResourceControllerListBigSalesFn = () => Promise<types.IListBigSalesResponse>

export const sduResourceControllerListBigSales: SduResourceControllerListBigSalesFn = async () => {
  const body = await fetch({
    resource: 'v1/sdu-resource/big-sales',
    method: 'GET'
  })

  return body
}

type SduResourceControllerGetLabelTreeFn = () => Promise<types.ILabelNode[]>

export const sduResourceControllerGetLabelTree: SduResourceControllerGetLabelTreeFn = async () => {
  const body = await fetch({
    resource: 'v1/sdu-resource/label-tree',
    method: 'GET'
  })

  return body
}

type SduResourceControllerListFirstLabelsFn = () => Promise<types.IListLabelsResponse>

export const sduResourceControllerListFirstLabels: SduResourceControllerListFirstLabelsFn = async () => {
  const body = await fetch({
    resource: 'v1/sdu-resource/first-labels',
    method: 'GET'
  })

  return body
}

export interface ISduResourceControllerListSecondLabelsParams {
  firstLabelId: string
}

type SduResourceControllerListSecondLabelsFn = (
  params: ISduResourceControllerListSecondLabelsParams
) => Promise<types.IListLabelsResponse>

export const sduResourceControllerListSecondLabels: SduResourceControllerListSecondLabelsFn = async ({
  firstLabelId
}) => {
  const body = await fetch({
    resource: `v1/sdu-resource/first-labels/${firstLabelId}/second-labels`,
    method: 'GET'
  })

  return body
}

export interface ISduResourceControllerListThirdLabelsParams {
  firstLabelId: string
  secondLabelId: string
}

type SduResourceControllerListThirdLabelsFn = (
  params: ISduResourceControllerListThirdLabelsParams
) => Promise<types.IListLabelsResponse>

export const sduResourceControllerListThirdLabels: SduResourceControllerListThirdLabelsFn = async ({
  firstLabelId,
  secondLabelId
}) => {
  const body = await fetch({
    resource: `v1/sdu-resource/first-labels/${firstLabelId}/second-labels/${secondLabelId}/third-labels`,
    method: 'GET'
  })

  return body
}

export interface ISduResourceControllerListIncrementParams {
  level1?: string
  level2?: string
  level3?: string
  env?: string
  cid?: string
  az?: string
  versionId?: string
  cluster?: string
  segment?: string
  limit: number
  offset: number
}

type SduResourceControllerListIncrementFn = (
  params: ISduResourceControllerListIncrementParams
) => Promise<types.IListIncrementResponse>

export const sduResourceControllerListIncrement: SduResourceControllerListIncrementFn = async ({
  level1,
  level2,
  level3,
  env,
  cid,
  az,
  versionId,
  cluster,
  segment,
  limit,
  offset
}) => {
  const body = await fetch({
    resource: 'v1/sdu-resource/increment',
    method: 'GET',
    params: { level1, level2, level3, env, cid, az, versionId, cluster, segment, limit, offset }
  })

  return body
}

export interface ISduResourceControllerDeleteIncrementEstimateParams {
  payload: types.IDeleteIncrementEstimateBody
}

type SduResourceControllerDeleteIncrementEstimateFn = (
  params: ISduResourceControllerDeleteIncrementEstimateParams
) => Promise<any>

export const sduResourceControllerDeleteIncrementEstimate: SduResourceControllerDeleteIncrementEstimateFn = async ({
  payload
}) => {
  const body = await fetch({
    resource: 'v1/sdu-resource/increment',
    method: 'DELETE',
    payload
  })

  return body
}

export interface ISduResourceControllerCreateIncrementEstimateParams {
  payload: types.ICreateIncrementEstimateBody
}

type SduResourceControllerCreateIncrementEstimateFn = (
  params: ISduResourceControllerCreateIncrementEstimateParams
) => Promise<any>

export const sduResourceControllerCreateIncrementEstimate: SduResourceControllerCreateIncrementEstimateFn = async ({
  payload
}) => {
  const body = await fetch({
    resource: 'v1/sdu-resource/increment',
    method: 'POST',
    payload
  })

  return body
}

export interface ISduResourceControllerEditIncrementEstimateParams {
  payload: types.IEditIncrementEstimateBody
}

type SduResourceControllerEditIncrementEstimateFn = (
  params: ISduResourceControllerEditIncrementEstimateParams
) => Promise<any>

export const sduResourceControllerEditIncrementEstimate: SduResourceControllerEditIncrementEstimateFn = async ({
  payload
}) => {
  const body = await fetch({
    resource: 'v1/sdu-resource/increment',
    method: 'PUT',
    payload
  })

  return body
}

export interface ISduResourceControllerListStockParams {
  limit: number
  offset: number
  level1?: string
  level2?: string
  level3?: string
  az?: string
  cluster?: string
  segment?: string
  env?: string
  cid?: string
  versionId?: string
  filterBy?: string
  grepKey?: string
}

type SduResourceControllerListStockFn = (
  params: ISduResourceControllerListStockParams
) => Promise<types.IListStockResponse>

export const sduResourceControllerListStock: SduResourceControllerListStockFn = async ({
  limit,
  offset,
  level1,
  level2,
  level3,
  az,
  cluster,
  segment,
  env,
  cid,
  versionId,
  filterBy,
  grepKey
}) => {
  const body = await fetch({
    resource: 'v1/sdu-resource/stock',
    method: 'GET',
    params: { limit, offset, level1, level2, level3, az, cluster, segment, env, cid, versionId, filterBy, grepKey }
  })

  return body
}

export interface ISduResourceControllerEditStockResourceParams {
  payload: types.IEditStockResourceBody
}

type SduResourceControllerEditStockResourceFn = (params: ISduResourceControllerEditStockResourceParams) => Promise<any>

export const sduResourceControllerEditStockResource: SduResourceControllerEditStockResourceFn = async ({ payload }) => {
  const body = await fetch({
    resource: 'v1/sdu-resource/stock',
    method: 'PUT',
    payload
  })

  return body
}

export interface ISduResourceControllerListSummaryParams {
  groupBy: string
  level1?: string
  level2?: string
  level3?: string
  az?: string
  env?: string
  machineModel?: string
  versionId?: string
  limit?: number
  offset?: number
}

type SduResourceControllerListSummaryFn = (
  params: ISduResourceControllerListSummaryParams
) => Promise<types.IListSummaryResponse>

export const sduResourceControllerListSummary: SduResourceControllerListSummaryFn = async ({
  groupBy,
  level1,
  level2,
  level3,
  az,
  env,
  machineModel,
  versionId,
  limit,
  offset
}) => {
  const body = await fetch({
    resource: 'v1/sdu-resource/summary',
    method: 'GET',
    params: { groupBy, level1, level2, level3, az, env, machineModel, versionId, limit, offset }
  })

  return body
}

type SduResourceControllerListVersionFn = () => Promise<types.IListVersionResponse>

export const sduResourceControllerListVersion: SduResourceControllerListVersionFn = async () => {
  const body = await fetch({
    resource: 'v1/sdu-resource/version',
    method: 'GET'
  })

  return body
}

export interface ISduResourceControllerCreateVersionParams {
  payload: types.ICreateVersionBody
}

type SduResourceControllerCreateVersionFn = (params: ISduResourceControllerCreateVersionParams) => Promise<any>

export const sduResourceControllerCreateVersion: SduResourceControllerCreateVersionFn = async ({ payload }) => {
  const body = await fetch({
    resource: 'v1/sdu-resource/version',
    method: 'POST',
    payload
  })

  return body
}

export interface ISduResourceControllerEditVersionParams {
  payload: types.IEditVersionBody
}

type SduResourceControllerEditVersionFn = (params: ISduResourceControllerEditVersionParams) => Promise<any>

export const sduResourceControllerEditVersion: SduResourceControllerEditVersionFn = async ({ payload }) => {
  const body = await fetch({
    resource: 'v1/sdu-resource/version',
    method: 'PUT',
    payload
  })

  return body
}
