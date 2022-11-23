import fetch from 'helpers/fetchV1'
import * as types from '../models'

/**
 * 创建工单
create shopee ticket
 */
export interface ITicketControllerCreateTicketParams {
  payload: types.ICreateTicketBody
}

/**
 * 创建工单
create shopee ticket
 */
type TicketControllerCreateTicketFn = (
  params: ITicketControllerCreateTicketParams
) => Promise<types.ICreateTicketResponse>

/**
 * 创建工单
create shopee ticket
 */
export const ticketControllerCreateTicket: TicketControllerCreateTicketFn = async ({ payload }) => {
  const body = await fetch({
    resource: 'v1/tickets',
    method: 'POST',
    payload
  })

  return body
}

/**
 * get ticket list
 */
export interface ITicketControllerListTicketsParams {
  perspective: 'STARTER' | 'APPROVER'
  ticketStatus?: 'OPEN' | 'CLOSED'
  filterBy?: string
  orderBy?: string
  offset?: string
  limit?: string
  searchBy?: string
}

/**
 * get ticket list
 */
type TicketControllerListTicketsFn = (params: ITicketControllerListTicketsParams) => Promise<types.IGetTicketsResponse>

/**
 * get ticket list
 */
export const ticketControllerListTickets: TicketControllerListTicketsFn = async ({
  perspective,
  ticketStatus,
  filterBy,
  orderBy,
  offset,
  limit,
  searchBy
}) => {
  const body = await fetch({
    resource: 'v1/tickets',
    method: 'GET',
    params: { perspective, ticketStatus, filterBy, orderBy, offset, limit, searchBy }
  })

  return body
}

/**
 * 获取工单详情
get ticket&#39;s detail
 */
export interface ITicketControllerGetTicketParams {
  ticketId: string
}

/**
 * 获取工单详情
get ticket&#39;s detail
 */
type TicketControllerGetTicketFn = (params: ITicketControllerGetTicketParams) => Promise<types.IGetTicketResponse>

/**
 * 获取工单详情
get ticket&#39;s detail
 */
export const ticketControllerGetTicket: TicketControllerGetTicketFn = async ({ ticketId }) => {
  const body = await fetch({
    resource: `v1/tickets/${ticketId}`,
    method: 'GET'
  })

  return body
}

/**
 * 取消工单
cancel a ticket by id
 */
export interface ITicketControllerCancelTicketParams {
  ticketId: string
}

/**
 * 取消工单
cancel a ticket by id
 */
type TicketControllerCancelTicketFn = (params: ITicketControllerCancelTicketParams) => Promise<any>

/**
 * 取消工单
cancel a ticket by id
 */
export const ticketControllerCancelTicket: TicketControllerCancelTicketFn = async ({ ticketId }) => {
  const body = await fetch({
    resource: `v1/tickets/${ticketId}`,
    method: 'DELETE'
  })

  return body
}

/**
 * 更新工单表单，目前(2021.12.21仅STC工单有更新功能)
patch ticket form data
 */
export interface ITicketControllerUpdateTicketFormParams {
  ticketId: string
  payload: types.IUpdateTicketFormBody
}

/**
 * 更新工单表单，目前(2021.12.21仅STC工单有更新功能)
patch ticket form data
 */
type TicketControllerUpdateTicketFormFn = (params: ITicketControllerUpdateTicketFormParams) => Promise<any>

/**
 * 更新工单表单，目前(2021.12.21仅STC工单有更新功能)
patch ticket form data
 */
export const ticketControllerUpdateTicketForm: TicketControllerUpdateTicketFormFn = async ({ ticketId, payload }) => {
  const body = await fetch({
    resource: `v1/tickets/${ticketId}/forms`,
    method: 'PATCH',
    payload
  })

  return body
}

/**
 * 审批 &#x2F; 拒绝工单
 */
export interface ITicketControllerUpdateTaskParams {
  ticketId: string
  taskId: string
  payload: types.IUpdateTasksBody
}

/**
 * 审批 &#x2F; 拒绝工单
 */
type TicketControllerUpdateTaskFn = (params: ITicketControllerUpdateTaskParams) => Promise<any>

/**
 * 审批 &#x2F; 拒绝工单
 */
export const ticketControllerUpdateTask: TicketControllerUpdateTaskFn = async ({ ticketId, taskId, payload }) => {
  const body = await fetch({
    resource: `v1/tickets/${ticketId}/tasks/${taskId}`,
    method: 'PUT',
    payload
  })

  return body
}
