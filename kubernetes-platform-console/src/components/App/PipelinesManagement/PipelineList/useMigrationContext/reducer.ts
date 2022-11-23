import { Dispatch } from 'react'

import { IState } from './context'
import { MIGRATION_TASK_STATUS } from 'constants/pipeline'

export enum ACTION_TYPES {
  UPDATE_STATUS,
  REFRESH_STATUS
}

export interface IAction {
  type: ACTION_TYPES
  status?: MIGRATION_TASK_STATUS
  onRefreshMigrationStatus?: () => void
}

export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_STATUS: {
      const { status } = action
      return {
        ...state,
        status
      }
    }

    case ACTION_TYPES.REFRESH_STATUS: {
      const { onRefreshMigrationStatus } = action
      return {
        ...state,
        onRefreshMigrationStatus
      }
    }
  }
}

export const getDispatchers = (dispatch: Dispatch<IAction>) => ({
  updateStatus: (status: MIGRATION_TASK_STATUS) => dispatch({ type: ACTION_TYPES.UPDATE_STATUS, status }),
  refreshStaus: (onRefreshMigrationStatus: () => void) =>
    dispatch({ type: ACTION_TYPES.REFRESH_STATUS, onRefreshMigrationStatus })
})
