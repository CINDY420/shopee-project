import { Dispatch } from 'react'
import { NodeAction } from 'src/components/App/Cluster/ClusterDetail/NodeTable/constant'
import { IState } from 'src/components/App/Cluster/ClusterDetail/NodeTable/useNodeContext/context'
import { IEksNodeItem } from 'src/swagger-api/models'

export enum ActionTypes {
  ENABLE_EDIT,
  EXIT_EDIT,
  REQUEST_REFRESH,
  FINISH_REFRESH,
  UPDATE_SELCTED_NODES,
  UPDATE_OPERATE_DISABLED_STATE,
}

export interface IAction {
  type: ActionTypes
  editAction?: NodeAction | undefined
  selectedNodes?: IEksNodeItem[]
  operateDisabled?: boolean
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

    case ActionTypes.UPDATE_SELCTED_NODES:
      return {
        ...state,
        selectedNodes: action.selectedNodes,
      }

    default: {
      return state
    }
  }
}

export const getDispatchers = (dispatch: Dispatch<IAction>) => ({
  enableEdit: (editAction: NodeAction) => dispatch({ type: ActionTypes.ENABLE_EDIT, editAction }),
  exitEdit: () => dispatch({ type: ActionTypes.EXIT_EDIT }),
  requestRefresh: () => dispatch({ type: ActionTypes.REQUEST_REFRESH }),
  finishRefresh: () => dispatch({ type: ActionTypes.FINISH_REFRESH }),
  updateSelectedNodes: (selectedNodes: IEksNodeItem[]) =>
    dispatch({ type: ActionTypes.UPDATE_SELCTED_NODES, selectedNodes }),
})
