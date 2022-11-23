import * as React from 'react'
import { IAction } from 'src/components/Deployment/useDeploymentContext/reducer'
import { DeploymentActions } from 'src/constants/deployment'

export interface IState {
  action: DeploymentActions | undefined
  refresh: boolean
}

export const initialState: IState = {
  action: undefined,
  // signal for pod list refresh when edit deployment finish
  refresh: false,
}

export const DeploymentContext = React.createContext<{
  state: IState
  dispatch?: React.Dispatch<IAction>
}>({
  state: initialState,
})
