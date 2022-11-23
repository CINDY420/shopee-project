import { IBaseAction } from 'components/App/ResourceManagement/useResourceContext/reducer'
import React from 'react'
import { IBigSale, ILabelNode, IVersion } from 'swagger-api/v1/models'

export interface IState {
  labelTree: ILabelNode[]
  versions: IVersion[]
  cids: string[]
  envs: string[]
  azs: string[]
  clusters: string[]
  segments: string[]
  machineModels: string[]
  bigSales: Record<number, IBigSale[]>
}

export const initialState: IState = {
  labelTree: [],
  versions: [],
  cids: [],
  envs: [],
  azs: [],
  clusters: [],
  segments: [],
  machineModels: [],
  bigSales: {}
}

export const ResourceContext = React.createContext<{ state: IState; dispatch?: React.Dispatch<IBaseAction> }>({
  state: initialState
})
