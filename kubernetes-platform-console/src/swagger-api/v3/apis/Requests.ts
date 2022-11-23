import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IRequestsControllerApplyAccessParams {
  tenantId: number
  projectName: string
}

type RequestsControllerApplyAccessFn = (params: IRequestsControllerApplyAccessParams) => Promise<any>

export const requestsControllerApplyAccess: RequestsControllerApplyAccessFn = async ({ tenantId, projectName }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/applyAccess`,
    method: 'POST'
  })

  return body
}

type RequestsControllerApproverPendingListFn = () => Promise<types.IRequestListResponseDto>

export const requestsControllerApproverPendingList: RequestsControllerApproverPendingListFn = async () => {
  const body = await fetch({
    resource: 'v3/approverPendingList',
    method: 'GET'
  })

  return body
}

type RequestsControllerApproverHistoryListFn = () => Promise<types.IRequestListResponseDto>

export const requestsControllerApproverHistoryList: RequestsControllerApproverHistoryListFn = async () => {
  const body = await fetch({
    resource: 'v3/approverHistoryList',
    method: 'GET'
  })

  return body
}

type RequestsControllerRequestPendingListFn = () => Promise<types.IRequestListResponseDto>

export const requestsControllerRequestPendingList: RequestsControllerRequestPendingListFn = async () => {
  const body = await fetch({
    resource: 'v3/requestPendingList',
    method: 'GET'
  })

  return body
}

type RequestsControllerRequestHistoryListFn = () => Promise<types.IRequestListResponseDto>

export const requestsControllerRequestHistoryList: RequestsControllerRequestHistoryListFn = async () => {
  const body = await fetch({
    resource: 'v3/requestHistoryList',
    method: 'GET'
  })

  return body
}

export interface IRequestsControllerRequestListParams {
  requestType: string
}

type RequestsControllerRequestListFn = (
  params: IRequestsControllerRequestListParams
) => Promise<types.IRequestListResponseDto>

export const requestsControllerRequestList: RequestsControllerRequestListFn = async ({ requestType }) => {
  const body = await fetch({
    resource: `v3/requestList/${requestType}`,
    method: 'GET'
  })

  return body
}

export interface IRequestsControllerApproveRequestParams {
  requestId: string
}

type RequestsControllerApproveRequestFn = (params: IRequestsControllerApproveRequestParams) => Promise<any>

export const requestsControllerApproveRequest: RequestsControllerApproveRequestFn = async ({ requestId }) => {
  const body = await fetch({
    resource: `v3/approveRequest/${requestId}`,
    method: 'POST'
  })

  return body
}

export interface IRequestsControllerRejectRequestParams {
  requestId: string
}

type RequestsControllerRejectRequestFn = (params: IRequestsControllerRejectRequestParams) => Promise<any>

export const requestsControllerRejectRequest: RequestsControllerRejectRequestFn = async ({ requestId }) => {
  const body = await fetch({
    resource: `v3/rejectRequest/${requestId}`,
    method: 'POST'
  })

  return body
}

export interface IRequestsControllerLatestAccessApplyRecordParams {
  tenantId: number
  projectName: string
}

type RequestsControllerLatestAccessApplyRecordFn = (
  params: IRequestsControllerLatestAccessApplyRecordParams
) => Promise<types.IIESTicket>

export const requestsControllerLatestAccessApplyRecord: RequestsControllerLatestAccessApplyRecordFn = async ({
  tenantId,
  projectName
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/activeaccess`,
    method: 'GET'
  })

  return body
}
