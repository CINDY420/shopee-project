import * as React from 'react'

import { POD_STATUS } from '../Statistics/PodStatistic'
import { ITag } from 'api/types/application/deploy'
import { DEPLOYMENT_ACTIONS } from 'constants/deployment'
import { ISpannedAz } from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/helper'

export const POD_STATUS_FILTERS = {
  [POD_STATUS.NORMAL]: 'normal',
  [POD_STATUS.ABNORMAL]: 'abnormal'
}

export enum EDIT_TYPES {
  SINGLE = 'Single',
  BATCH = 'Batch'
}

export interface IDeploymentEditingObject {
  editType?: EDIT_TYPES
  actionType?: DEPLOYMENT_ACTIONS
  editingRows?: ISpannedAz[]
}

export interface IState {
  tags?: ITag[]
  cids: string[]
  azs: string[]
  environments: string[]
  selectedCids: string[]
  selectedAZs: string[]
  selectedEnvironment: string

  podStatus: string[]
  selectedPodStatus: string[]
  selectedPodPhase: string[]
  selectedAzComponentType: string[]

  editingObject: IDeploymentEditingObject
  selectedRowKeys: string[]
}

export const initialState: IState = {
  cids: [],
  tags: [],
  azs: [],
  environments: [],
  podStatus: Object.values(POD_STATUS_FILTERS),

  selectedCids: [],
  selectedAZs: [],
  selectedPodPhase: [],
  selectedPodStatus: [],
  selectedEnvironment: undefined,
  selectedAzComponentType: [],

  editingObject: undefined,
  selectedRowKeys: []
}

export const ApplicationContext = React.createContext<{ state: IState; dispatch?: any }>({
  state: initialState
})
