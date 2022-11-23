import React from 'react'
import { useResizeDetector } from 'react-resize-detector'
import XTerm from 'helpers/terminal/xterm'
import HeartBeatSocket, { SOCKET_OPERATION } from 'helpers/terminal/heartBeatSocket'
import 'xterm/css/xterm.css'
import { SOCKET_STATUS } from 'constants/webSocket'
import {
  Root,
  StyledContainer,
} from 'components/App/ProjectMGT/JobDetail/PodList/TerminalModal/TerminalComponent/style'
import {
  getDispatchers,
  TerminalContext,
} from 'components/App/ProjectMGT/JobDetail/PodList/TerminalModal/useTerminalContext'
import Loading from 'components/App/ProjectMGT/JobDetail/PodList/TerminalModal/TerminalComponent/Loading'
import LogError from 'components/App/ProjectMGT/JobDetail/PodList/TerminalModal/TerminalComponent/TerminalError'

interface ITerminalComponentProps {
  webSocketUrl: string
  sessionId: string
}
const TerminalComponent: React.FC<ITerminalComponentProps> = ({ webSocketUrl, sessionId }) => {
  const terminalContainerRef = React.useRef<HTMLDivElement>(null)
  const [socketStatus, setSocketStatus] = React.useState<SOCKET_STATUS>(SOCKET_STATUS.LOADING)

  const { state, dispatch } = React.useContext(TerminalContext)
  const { xterm, socket } = state ?? {}
  const dispatchers = React.useMemo(() => dispatch && getDispatchers(dispatch), [dispatch])

  React.useEffect(() => {
    dispatchers?.updateSocketStatus(socketStatus)
  }, [dispatchers, socketStatus])

  const initXTerm = React.useCallback((xterm: XTerm, socket: HeartBeatSocket) => {
    const disposable = xterm.onData((data: string) => {
      socket.sendWebSocketMessage(SOCKET_OPERATION.STDIN, data)
    })
    // eslint-disable-next-line @typescript-eslint/unbound-method -- Third-party library returns
    const { dispose } = disposable
    xterm.disposeOnData = dispose
  }, [])

  const destoryLastCreation = React.useCallback(() => {
    dispatchers?.destoryTerminal()
  }, [dispatchers])

  const create = React.useCallback(() => {
    if (webSocketUrl && terminalContainerRef.current) {
      destoryLastCreation()
      const xterm = new XTerm({ parent: terminalContainerRef.current })
      const socket = new HeartBeatSocket({ url: webSocketUrl, xterm, sessionId })
      socket.getStatus = setSocketStatus

      initXTerm(xterm, socket)
      dispatchers?.updateTerminal({ xterm, socket })
    }
  }, [webSocketUrl, destoryLastCreation, dispatchers, initXTerm, sessionId])

  React.useEffect(() => {
    create()

    return () => {
      dispatchers?.destoryTerminal()
    }
  }, [create, dispatchers])

  const sendResizeMessage = React.useCallback(() => {
    if (!xterm || !socket || socket.readyState !== WebSocket.OPEN) return
    xterm.fitAddon.fit()

    socket.sendWebSocketMessage(SOCKET_OPERATION.RESIZE, '')
  }, [socket, xterm])

  useResizeDetector({
    onResize: sendResizeMessage,
    skipOnMount: true,
    handleHeight: true,
    handleWidth: true,
    refreshMode: 'throttle',
    refreshRate: 100,
    targetRef: terminalContainerRef,
  })

  const noticeMap = {
    [SOCKET_STATUS.LOADING]: <Loading />,
    [SOCKET_STATUS.FAILED]: <LogError message={socket?.socketErrorMessage} loginRetry={create} />,
    [SOCKET_STATUS.CLOSED]: <LogError message={socket?.socketErrorMessage} loginRetry={create} />,
    [SOCKET_STATUS.SUCCESS]: null,
  }

  return (
    <TerminalContext.Provider value={{ state, dispatch }}>
      <Root>
        {noticeMap[socketStatus]}
        <StyledContainer ref={terminalContainerRef} />
      </Root>
    </TerminalContext.Provider>
  )
}

export default TerminalComponent
