import { danger, success } from 'constants/colors'
import { ClockCircleFilled, CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from 'infra-design-icons'

export const TICKET_STAGE = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELED: 'Canceled'
}

export enum TICKET_STATUS {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}

export enum TICKET_PERSPECTIVE {
  STARTER = 'STARTER',
  APPROVER = 'APPROVER'
}

export enum APPROVAL_ACTION_TYPE {
  REJECT = 'reject',
  APPROVE = 'approval',
  CANCEL = 'cancel'
}

export const ACTION_ALERT_NAMES = {
  [APPROVAL_ACTION_TYPE.REJECT]: 'refused',
  [APPROVAL_ACTION_TYPE.APPROVE]: 'approved',
  [APPROVAL_ACTION_TYPE.CANCEL]: 'cancelled'
}

export const TAG_COLORS = {
  [TICKET_STAGE.PENDING]: 'volcano',
  [TICKET_STAGE.APPROVED]: 'green',
  [TICKET_STAGE.REJECTED]: 'red',
  [TICKET_STAGE.CANCELED]: 'grey'
}

export const REQUEST_COLORS = {
  [TICKET_STAGE.REJECTED]: danger,
  [TICKET_STAGE.CANCELED]: success
}

export const DETAIL_ICON_COLORS = {
  [TICKET_STAGE.PENDING]: '#2673DD',
  [TICKET_STAGE.APPROVED]: '#55CC77',
  [TICKET_STAGE.REJECTED]: '#FF4742',
  [TICKET_STAGE.CANCELED]: '#B7B7B7'
}

export const DETAIL_ICONS = {
  [TICKET_STAGE.PENDING]: ClockCircleFilled,
  [TICKET_STAGE.APPROVED]: CheckCircleFilled,
  [TICKET_STAGE.REJECTED]: CloseCircleFilled,
  [TICKET_STAGE.CANCELED]: ExclamationCircleFilled
}
