import { atom } from 'recoil'

import { ITicket } from 'swagger-api/v1/models'

export const selectedRequest = atom<ITicket>({
  key: 'selectedRequest',
  default: undefined
})

export const pendingApprovalCount = atom<number>({
  key: 'pendingApprovalCount',
  default: 0
})

export const ticketCenterSelectedTreeNodes = atom<string>({
  key: 'ticketCenterSelectedTreeNodes',
  default: []
})

export const ticketCenterSelectedExpandedNodes = atom<string>({
  key: 'ticketCenterSelectedExpandedNodes',
  default: []
})
