import fetch from 'helpers/fetch'
import * as types from '../models'

export interface ITicketControllerGetMyApproverPendingTicketsParams {
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type TicketControllerGetMyApproverPendingTicketsFn = (
  params: ITicketControllerGetMyApproverPendingTicketsParams
) => Promise<types.IIListTicketsResponse>

export const ticketControllerGetMyApproverPendingTickets: TicketControllerGetMyApproverPendingTicketsFn = async ({
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: 'v3/ticket/myApproverPendingTickets',
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface ITicketControllerGetMyApproverHistoryParams {
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type TicketControllerGetMyApproverHistoryFn = (
  params: ITicketControllerGetMyApproverHistoryParams
) => Promise<types.IIListTicketsResponse>

export const ticketControllerGetMyApproverHistory: TicketControllerGetMyApproverHistoryFn = async ({
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: 'v3/ticket/myApproverHistoryTickets',
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface ITicketControllerGetMyPendingHistoryParams {
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
  statusType: string
}

type TicketControllerGetMyPendingHistoryFn = (
  params: ITicketControllerGetMyPendingHistoryParams
) => Promise<types.IIMyTickets>

export const ticketControllerGetMyPendingHistory: TicketControllerGetMyPendingHistoryFn = async ({
  offset,
  limit,
  orderBy,
  filterBy,
  statusType
}) => {
  const body = await fetch({
    resource: 'v3/ticket/myTickets',
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, statusType }
  })

  return body
}

export interface ITicketControllerApplyTerminalAccessParams {
  tenantId: number
  projectName: string
  payload: types.IApplyTerminalAccessBody
}

type TicketControllerApplyTerminalAccessFn = (
  params: ITicketControllerApplyTerminalAccessParams
) => Promise<types.IITicket>

export const ticketControllerApplyTerminalAccess: TicketControllerApplyTerminalAccessFn = async ({
  tenantId,
  projectName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/ticket/tenants/${tenantId}/projects/${projectName}/terminalAccesses`,
    method: 'POST',
    payload
  })

  return body
}

export interface ITicketControllerGetTicketDetailParams {
  ticketId: string
}

type TicketControllerGetTicketDetailFn = (
  params: ITicketControllerGetTicketDetailParams
) => Promise<types.IITicketDetail>

export const ticketControllerGetTicketDetail: TicketControllerGetTicketDetailFn = async ({ ticketId }) => {
  const body = await fetch({
    resource: `v3/ticket/${ticketId}/detail`,
    method: 'GET'
  })

  return body
}

/**
 * Cancel Ticket
 */
export interface ITicketControllerCancelTicketParams {
  ticketId: string
}

/**
 * Cancel Ticket
 */
type TicketControllerCancelTicketFn = (params: ITicketControllerCancelTicketParams) => Promise<any>

/**
 * Cancel Ticket
 */
export const ticketControllerCancelTicket: TicketControllerCancelTicketFn = async ({ ticketId }) => {
  const body = await fetch({
    resource: `v3/ticket/${ticketId}`,
    method: 'DELETE'
  })

  return body
}

export interface ITicketControllerApproveTicketParams {
  ticketId: string
}

type TicketControllerApproveTicketFn = (params: ITicketControllerApproveTicketParams) => Promise<types.IIPostResponse>

export const ticketControllerApproveTicket: TicketControllerApproveTicketFn = async ({ ticketId }) => {
  const body = await fetch({
    resource: `v3/ticket/${ticketId}/approve`,
    method: 'POST'
  })

  return body
}

export interface ITicketControllerRejectTicketParams {
  ticketId: string
}

type TicketControllerRejectTicketFn = (params: ITicketControllerRejectTicketParams) => Promise<types.IIPostResponse>

export const ticketControllerRejectTicket: TicketControllerRejectTicketFn = async ({ ticketId }) => {
  const body = await fetch({
    resource: `v3/ticket/${ticketId}/reject`,
    method: 'POST'
  })

  return body
}
