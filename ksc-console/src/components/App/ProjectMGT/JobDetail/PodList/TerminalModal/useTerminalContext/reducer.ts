// copy form kubernetes-platform-console

import { Dispatch } from 'react'

import XTerm from 'helpers/terminal/xterm'
import HeartBeatSocket from 'helpers/terminal/heartBeatSocket'
import { SOCKET_STATUS } from 'constants/webSocket'
import {
  ACTION_TYPES,
  IAction,
  IState,
} from 'components/App/ProjectMGT/JobDetail/PodList/TerminalModal/useTerminalContext/context'

export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_TERMINAL: {
      const { xterm, socket } = action

      return {
        ...state,
        xterm,
        socket,
      }
    }

    case ACTION_TYPES.DESTORY_TERMINAL: {
      const { xterm, socket } = state
      xterm?.destory()
      socket?.destroy()

      return {
        ...state,
        xterm: null,
        socket: null,
        socketStatus: SOCKET_STATUS.LOADING,
      }
    }

    case ACTION_TYPES.UPDATE_SOCKET_STATUS: {
      const { socketStatus = SOCKET_STATUS.SUCCESS } = action

      return {
        ...state,
        socketStatus,
      }
    }

    case ACTION_TYPES.UPDATE_TRANSFER_STATUS: {
      return state
    }

    default: {
      return state
    }
  }
}

export const getDispatchers = (dispatch: Dispatch<IAction>) => ({
  updateTerminal: ({ xterm, socket }: { xterm: XTerm; socket: HeartBeatSocket }) =>
    dispatch({ type: ACTION_TYPES.UPDATE_TERMINAL, xterm, socket }),
  destoryTerminal: () =>
    dispatch({ type: ACTION_TYPES.DESTORY_TERMINAL, xterm: null, socket: null }),
  updateSocketStatus: (socketStatus: SOCKET_STATUS) =>
    dispatch({ type: ACTION_TYPES.UPDATE_SOCKET_STATUS, socketStatus, xterm: null, socket: null }),
})
