import { Dispatch } from 'react'

import { IState, IDeploymentEditingObject } from './context'
import { IDeployFilterInfo, ITag } from 'api/types/application/deploy'
import { ISpannedAz } from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/helper'

export const SCALE = 'Desired Pods'

export const ROLLBACK = 'Tag'

export enum ACTION_TYPES {
  UPDATE_FILTERS,
  SELECT_ENV,
  SELECT_CID,
  SELECT_AZ,
  SELECT_POD_STATUS,
  SELECT_POD_PHASE,
  SELECT_POD_FILTERS,
  ENABLE_EDIT,
  EXIT_EDIT,
  SELECT_RECORD,
  SELECT_STATISTIC,
  SELECT_AZ_COMPONENT_TYPE
}

export interface IAction {
  type: ACTION_TYPES
  filters?: IDeployFilterInfo
  environment?: string
  cids?: string[]
  azs?: string[]
  tags?: ITag[]
  podStatus?: string[]
  podPhases?: string[]
  editingObject?: IDeploymentEditingObject
  records?: ISpannedAz[]
  selectedRowKeys?: string[]
  azComponentTypes?: string[]
}

export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_FILTERS: {
      const { filters } = action
      const { cids = [], azs = [], envs = [] } = filters

      return {
        ...state,
        cids,
        environments: envs,
        azs,
        selectedEnvironment: envs[0]
      }
    }

    case ACTION_TYPES.SELECT_ENV: {
      return {
        ...state,
        selectedEnvironment: action.environment,
        selectedRowKeys: []
      }
    }

    case ACTION_TYPES.SELECT_CID: {
      return {
        ...state,
        selectedCids: action.cids,
        selectedRowKeys: []
      }
    }

    case ACTION_TYPES.SELECT_AZ: {
      return {
        ...state,
        selectedAZs: action.azs,
        selectedRowKeys: []
      }
    }

    case ACTION_TYPES.SELECT_POD_STATUS: {
      const { podStatus } = action
      return {
        ...state,
        selectedPodStatus: podStatus,
        selectedRowKeys: []
      }
    }

    case ACTION_TYPES.SELECT_POD_PHASE: {
      const { podPhases } = action
      return {
        ...state,
        selectedPodPhase: podPhases,
        selectedRowKeys: []
      }
    }

    case ACTION_TYPES.SELECT_POD_FILTERS: {
      const { podPhases, podStatus } = action
      return {
        ...state,
        selectedPodStatus: podStatus,
        selectedPodPhase: podPhases,
        selectedRowKeys: []
      }
    }

    case ACTION_TYPES.ENABLE_EDIT: {
      const { editingObject } = action

      return {
        ...state,
        editingObject,
        selectedRowKeys: []
      }
    }

    case ACTION_TYPES.EXIT_EDIT: {
      return {
        ...state,
        editingObject: undefined,
        selectedRowKeys: []
      }
    }

    case ACTION_TYPES.SELECT_RECORD: {
      const { records, selectedRowKeys } = action
      const { editingObject } = state
      return {
        ...state,
        editingObject: {
          ...editingObject,
          editingRows: records
        },
        selectedRowKeys
      }
    }

    case ACTION_TYPES.SELECT_STATISTIC: {
      const { environment, podStatus, podPhases } = action

      return {
        ...state,
        selectedEnvironment: environment,
        selectedPodStatus: podStatus,
        selectedPodPhase: podPhases
      }
    }

    case ACTION_TYPES.SELECT_AZ_COMPONENT_TYPE: {
      const { azComponentTypes } = action

      return {
        ...state,
        selectedAzComponentType: azComponentTypes
      }
    }

    default: {
      return state
    }
  }
}

export const getDispatchers = (dispatch: Dispatch<IAction>) => ({
  updateFilters: (filters: IDeployFilterInfo) => dispatch({ type: ACTION_TYPES.UPDATE_FILTERS, filters }),
  selectEnvironment: (environment: string) => dispatch({ type: ACTION_TYPES.SELECT_ENV, environment }),
  selectCid: (cids: string[]) => dispatch({ type: ACTION_TYPES.SELECT_CID, cids }),
  selectAZ: (azs: string[]) => dispatch({ type: ACTION_TYPES.SELECT_AZ, azs }),
  selectPodStatus: (podStatus: string[]) => dispatch({ type: ACTION_TYPES.SELECT_POD_STATUS, podStatus }),
  selectPodPhase: (podPhases: string[]) => dispatch({ type: ACTION_TYPES.SELECT_POD_PHASE, podPhases }),
  selectPodFilters: (podStatus: string[], podPhases: string[]) =>
    dispatch({ type: ACTION_TYPES.SELECT_POD_FILTERS, podStatus, podPhases }),
  selectRecord: ({ records }) => dispatch({ type: ACTION_TYPES.SELECT_RECORD, records }),
  selectAzComponentType: (azComponentTypes: string[]) =>
    dispatch({ type: ACTION_TYPES.SELECT_AZ_COMPONENT_TYPE, azComponentTypes }),

  enableEdit: (editingObject: IDeploymentEditingObject) => dispatch({ type: ACTION_TYPES.ENABLE_EDIT, editingObject }),
  exitEdit: () => dispatch({ type: ACTION_TYPES.EXIT_EDIT }),
  selectStatistic: ({ environment, podStatus, podPhases }) =>
    dispatch({ type: ACTION_TYPES.SELECT_STATISTIC, environment, podPhases, podStatus })
})
