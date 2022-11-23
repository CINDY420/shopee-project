import { Dispatch } from 'react'
import {
  IState,
  IAction,
  ACTION_TYPES
} from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/useLogTerminalContext/context'
import XTerm from 'helpers/terminal/xterm'
import FileTransfer from 'helpers/terminal/fileTransfer'
import HeartBeatSocket from 'helpers/terminal/heartBeatSocket'
import { SOCKET_STATUS } from 'constants/webSocket'

export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_TERMINAL: {
      const { xterm, socket, fileTransfer } = action

      return {
        ...state,
        xterm,
        socket,
        fileTransfer
      }
    }

    case ACTION_TYPES.DESTORY_TERMINAL: {
      const { xterm, socket, fileTransfer } = state
      xterm?.destory()
      socket?.destroy()
      fileTransfer?.resetFileTransfer()

      return {
        ...state,
        xterm: null,
        socket: null,
        fileTransfer: null,
        socketStatus: SOCKET_STATUS.LOADING,
        isTransfering: false
      }
    }

    case ACTION_TYPES.UPDATE_SOCKET_STATUS: {
      const { socketStatus } = action

      return {
        ...state,
        socketStatus
      }
    }

    case ACTION_TYPES.UPDATE_TRANSFER_STATUS: {
      const { isTransfering } = action

      return {
        ...state,
        isTransfering
      }
    }

    default: {
      return state
    }
  }
}

export const getDispatchers = (dispatch: Dispatch<IAction>) => ({
  updateTerminal: ({
    xterm,
    socket,
    fileTransfer
  }: {
    xterm: XTerm
    socket: HeartBeatSocket
    fileTransfer: FileTransfer
  }) => dispatch({ type: ACTION_TYPES.UPDATE_TERMINAL, xterm, socket, fileTransfer }),
  destoryTerminal: () => dispatch({ type: ACTION_TYPES.DESTORY_TERMINAL }),
  updateSocketStatus: (socketStatus: SOCKET_STATUS) =>
    dispatch({ type: ACTION_TYPES.UPDATE_SOCKET_STATUS, socketStatus }),
  updateTransferStatus: (isTransfering: boolean) =>
    dispatch({ type: ACTION_TYPES.UPDATE_TRANSFER_STATUS, isTransfering })
})
