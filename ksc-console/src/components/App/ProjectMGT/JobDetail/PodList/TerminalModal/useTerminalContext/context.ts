// copy form kubernetes-platform-console

import * as React from 'react'
import XTerm from 'helpers/terminal/xterm'
import HeartBeatSocket from 'helpers/terminal/heartBeatSocket'
import { SOCKET_STATUS } from 'constants/webSocket'

export interface IState {
  xterm: XTerm | null
  socket: HeartBeatSocket | null
  socketStatus: SOCKET_STATUS
}

export enum ACTION_TYPES {
  UPDATE_TERMINAL,
  DESTORY_TERMINAL,
  UPDATE_SOCKET_STATUS,
  UPDATE_TRANSFER_STATUS,
}

export interface IAction {
  type: ACTION_TYPES
  xterm: XTerm | null
  socket: HeartBeatSocket | null
  socketStatus?: SOCKET_STATUS
}

export const initialState: IState = {
  xterm: null,
  socket: null,
  socketStatus: SOCKET_STATUS.LOADING,
}

export const TerminalContext = React.createContext<{
  state: IState
  dispatch?: React.Dispatch<IAction>
}>({
  state: initialState,
})
