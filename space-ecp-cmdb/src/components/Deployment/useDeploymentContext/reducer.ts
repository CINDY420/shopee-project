import { Dispatch } from 'react'
import { DeploymentActions } from 'src/constants/deployment'

import { IState } from './context'

export const SCALE = 'Desired Pods'

export const ROLLBACK = 'Tag'

export enum ActionTypes {
  ENABLE_EDIT,
  EXIT_EDIT,
  REQUEST_REFRESH,
  FINISH_REFRESH,
}

export interface IAction {
  type: ActionTypes
  editAction?: DeploymentActions | undefined
}

export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ActionTypes.ENABLE_EDIT:
      return {
        ...state,
        action: action.editAction,
      }

    case ActionTypes.EXIT_EDIT:
      return {
        ...state,
        action: undefined,
      }

    case ActionTypes.REQUEST_REFRESH:
      return {
        ...state,
        refresh: true,
      }

    case ActionTypes.FINISH_REFRESH:
      return {
        ...state,
        refresh: false,
      }

    default: {
      return state
    }
  }
}

export const getDispatchers = (dispatch: Dispatch<IAction>) => ({
  enableEdit: (editAction: DeploymentActions) =>
    dispatch({ type: ActionTypes.ENABLE_EDIT, editAction }),
  exitEdit: () => dispatch({ type: ActionTypes.EXIT_EDIT }),
  requestRefresh: () => dispatch({ type: ActionTypes.REQUEST_REFRESH }),
  finishRefresh: () => dispatch({ type: ActionTypes.FINISH_REFRESH }),
})
