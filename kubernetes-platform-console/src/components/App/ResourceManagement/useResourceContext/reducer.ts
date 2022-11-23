import { IState } from 'components/App/ResourceManagement/useResourceContext/context'
import React from 'react'

export enum ACTION_TYPES {
  UPDATE_LABEL_TREE,
  UPDATE_VERSIONS,
  UPDATE_CIDS,
  UPDATE_ENVS,
  UPDATE_AZS,
  UPDATE_CLUSTERS,
  UPDATE_MACHINE_MODElS,
  UPDATE_BIG_SALES,
  UPDATE_SEGMENTS
}

export interface IBaseAction {
  type: ACTION_TYPES
  labelTree?: IState['labelTree']
  versions?: IState['versions']
  cids?: IState['cids']
  envs?: IState['envs']
  azs?: IState['azs']
  clusters?: IState['clusters']
  segments?: IState['segments']
  machineModels?: IState['machineModels']
  bigSales?: IState['bigSales']
}

export const reducer = (state: IState, action: IBaseAction): IState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_LABEL_TREE:
      return {
        ...state,
        labelTree: action.labelTree
      }

    case ACTION_TYPES.UPDATE_VERSIONS:
      return {
        ...state,
        versions: action.versions
      }

    case ACTION_TYPES.UPDATE_CIDS:
      return {
        ...state,
        cids: action.cids
      }

    case ACTION_TYPES.UPDATE_ENVS:
      return {
        ...state,
        envs: action.envs
      }

    case ACTION_TYPES.UPDATE_AZS:
      return {
        ...state,
        azs: action.azs
      }

    case ACTION_TYPES.UPDATE_CLUSTERS:
      return {
        ...state,
        clusters: action.clusters
      }

    case ACTION_TYPES.UPDATE_SEGMENTS:
      return {
        ...state,
        segments: action.segments
      }

    case ACTION_TYPES.UPDATE_MACHINE_MODElS:
      return {
        ...state,
        machineModels: action.machineModels
      }

    case ACTION_TYPES.UPDATE_BIG_SALES:
      return {
        ...state,
        bigSales: action.bigSales
      }
  }
}

export const getDispatchers = (dispatch: React.Dispatch<IBaseAction>) => ({
  updateLabelTree: (labelTree: IState['labelTree']) => dispatch({ type: ACTION_TYPES.UPDATE_LABEL_TREE, labelTree }),
  updateVersions: (versions: IState['versions']) => dispatch({ type: ACTION_TYPES.UPDATE_VERSIONS, versions }),
  updateCids: (cids: IState['cids']) => dispatch({ type: ACTION_TYPES.UPDATE_CIDS, cids }),
  updateEnvs: (envs: IState['envs']) => dispatch({ type: ACTION_TYPES.UPDATE_ENVS, envs }),
  updateAzs: (azs: IState['azs']) => dispatch({ type: ACTION_TYPES.UPDATE_AZS, azs }),
  updateClusters: (clusters: IState['clusters']) => dispatch({ type: ACTION_TYPES.UPDATE_CLUSTERS, clusters }),
  updateSegments: (segments: IState['segments']) => dispatch({ type: ACTION_TYPES.UPDATE_SEGMENTS, segments }),
  updateMachineModels: (machineModels: IState['machineModels']) =>
    dispatch({ type: ACTION_TYPES.UPDATE_MACHINE_MODElS, machineModels }),
  updateBigSales: (bigSales: IState['bigSales']) => dispatch({ type: ACTION_TYPES.UPDATE_BIG_SALES, bigSales })
})
