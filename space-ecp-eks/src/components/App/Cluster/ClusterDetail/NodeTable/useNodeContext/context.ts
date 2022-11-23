import * as React from 'react'
import { NodeAction } from 'src/components/App/Cluster/ClusterDetail/NodeTable/constant'
import { IAction } from 'src/components/App/Cluster/ClusterDetail/NodeTable/useNodeContext/reducer'
import { IEksNodeItem } from 'src/swagger-api/models'

export interface IState {
  action: NodeAction | undefined
  refresh: boolean
  selectedNodes: IEksNodeItem[]
}

export const initialState: IState = {
  action: undefined,
  // signal for node list refresh when edit node finish
  refresh: false,
  selectedNodes: [],
}

export const NodeContext = React.createContext<{
  state: IState
  dispatch?: React.Dispatch<IAction>
}>({
  state: initialState,
})
