import * as React from 'react'

import { DEVELOPING_VERSIONS, VERSION_CONTROL } from 'constants/versionControl'
import { IRole } from 'api/types/accessRequest'

interface IState {
  selectedVersion: DEVELOPING_VERSIONS
  userRoles: IRole[]
}

export enum GLOBAL_CONTEXT_ACTION_TYPES {
  SWITCH_VERSION,
  USER_ROLES
}

interface IAction {
  type: GLOBAL_CONTEXT_ACTION_TYPES
  version?: DEVELOPING_VERSIONS
  userRoles?: IRole[]
}

type ReducerFn = (state: IState, action: IAction) => IState

const setVersion: ReducerFn = (state, action) => {
  const { selectedVersion, ...others } = state
  const { version } = action

  const developingVersions = Object.values(DEVELOPING_VERSIONS)
  if (!developingVersions.find(developingVersion => developingVersion === version)) {
    return state
  }
  window.localStorage.setItem(VERSION_CONTROL, JSON.stringify(version))
  return {
    selectedVersion: version,
    ...others
  }
}
const setUserRoles: ReducerFn = (state, action) => {
  const { userRoles, ...others } = state
  const { userRoles: newRoles } = action
  return {
    userRoles: newRoles,
    ...others
  }
}

const setStateMap = {
  [GLOBAL_CONTEXT_ACTION_TYPES.SWITCH_VERSION]: setVersion,
  [GLOBAL_CONTEXT_ACTION_TYPES.USER_ROLES]: setUserRoles
}

export const reducer: ReducerFn = (state, action) => {
  const { type } = action || {}
  const setState = setStateMap[type]
  return setState && setState(state, action)
}

const getDefaultVersion = (): DEVELOPING_VERSIONS => {
  const localStorageVersion = JSON.parse(window.localStorage.getItem(VERSION_CONTROL))

  const developingVersions = Object.values(DEVELOPING_VERSIONS)

  if (localStorageVersion === null || !developingVersions.find(version => localStorageVersion === version)) {
    return developingVersions[0]
  }

  return localStorageVersion
}

export const initialState: IState = {
  selectedVersion: getDefaultVersion(),
  userRoles: []
}

export const GlobalContext = React.createContext<{ state: IState; dispatch: React.Dispatch<IAction> }>({
  state: initialState,
  dispatch: null
})

export const getDispatchers = (dispatch: React.Dispatch<IAction>) => ({
  selectVersion: (version: DEVELOPING_VERSIONS) =>
    dispatch({ type: GLOBAL_CONTEXT_ACTION_TYPES.SWITCH_VERSION, version })
})
