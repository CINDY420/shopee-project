import { Dispatch } from 'react'

import { formatTime } from 'helpers/format'
import { TICKET_STAGE, ACTION_ALERT_NAMES, APPROVAL_ACTION_TYPE } from 'constants/requestAndApproval'
import { ITicket } from 'swagger-api/v1/models'

export interface IState {
  alertMessage: string
}

export const initialState: IState = {
  alertMessage: ''
}

export enum ACTION_TYPES {
  UPDATE = 'UPDATE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface IAction {
  type: ACTION_TYPES
  request?: ITicket
  actionType?: APPROVAL_ACTION_TYPE
  error?: Error
}

export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE: {
      const { stage = '', updateTime } = action?.request?.metaInfo || {}
      const isPending = stage === TICKET_STAGE.PENDING
      const alertMessage = isPending ? '' : `This request has been ${stage.toLowerCase()} at ${formatTime(updateTime)}`

      return {
        alertMessage
      }
    }

    case ACTION_TYPES.SUCCESS: {
      const { actionType } = action
      const alertMessage = `Successfully ${ACTION_ALERT_NAMES[actionType]} !`

      return {
        alertMessage
      }
    }

    case ACTION_TYPES.ERROR: {
      const { error } = action

      const alertMessage = error.toString()

      return {
        alertMessage
      }
    }

    default: {
      return state
    }
  }
}

export const getDispatchers = (dispatch: Dispatch<IAction>) => ({
  updateRequest: (request: ITicket) => dispatch({ type: ACTION_TYPES.UPDATE, request }),
  onSuccess: (actionType: APPROVAL_ACTION_TYPE) => dispatch({ type: ACTION_TYPES.SUCCESS, actionType }),
  onError: (error: Error) => dispatch({ type: ACTION_TYPES.ERROR, error })
})
