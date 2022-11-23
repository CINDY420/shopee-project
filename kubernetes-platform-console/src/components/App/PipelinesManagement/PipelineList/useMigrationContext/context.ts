import * as React from 'react'

import { MIGRATION_TASK_STATUS } from 'constants/pipeline'

export interface IState {
  status: string
  onRefreshMigrationStatus: () => void
}

export const initialState = {
  status: MIGRATION_TASK_STATUS.pending,
  onRefreshMigrationStatus: () => null
}

export const MigrationContext = React.createContext<{ state: IState; dispatch?: any }>({
  state: initialState
})
