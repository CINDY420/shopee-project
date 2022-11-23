import * as React from 'react'
import XTerm from 'helpers/terminal/xterm'
import FileTransfer from 'helpers/terminal/fileTransfer'
import HeartBeatSocket from 'helpers/terminal/heartBeatSocket'
import { SOCKET_STATUS } from 'constants/webSocket'

export interface IState {
  xterm: XTerm
  socket: HeartBeatSocket
  fileTransfer: FileTransfer
  socketStatus: SOCKET_STATUS
  isTransfering: boolean
}

export enum ACTION_TYPES {
  UPDATE_TERMINAL,
  DESTORY_TERMINAL,
  UPDATE_SOCKET_STATUS,
  UPDATE_TRANSFER_STATUS
}

export interface IAction {
  type: ACTION_TYPES
  xterm?: XTerm
  socket?: HeartBeatSocket
  fileTransfer?: FileTransfer
  socketStatus?: SOCKET_STATUS
  isTransfering?: boolean
}

export const initialState: IState = {
  xterm: null,
  socket: null,
  fileTransfer: null,
  socketStatus: SOCKET_STATUS.LOADING,
  isTransfering: false
}

export const LogTerminalContext = React.createContext<{ state: IState; dispatch?: React.Dispatch<IAction> }>({
  state: initialState
})
