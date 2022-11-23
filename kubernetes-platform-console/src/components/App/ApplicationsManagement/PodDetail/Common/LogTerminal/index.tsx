import * as React from 'react'
import { useResizeDetector } from 'react-resize-detector'

import PromptCreator from 'components/Common/PromptCreator'
import Loading from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/Loading'
import LogError from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/LogError'
import LogClose from 'components/Common/ErrorTryAgain'
import PermissionDenied from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/PermissionDenied'
import Search from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/Search'
import {
  LogTerminalContext,
  getDispatchers
} from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/useLogTerminalContext'

import accessControl from 'hocs/accessControl'
import { AccessControlContext } from 'hooks/useAccessControl'
import XTerm from 'helpers/terminal/xterm'
import HeartBeatSocket from 'helpers/terminal/heartBeatSocket'
import FileTransfer from 'helpers/terminal/fileTransfer'

import { PERMISSION_SCOPE, RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'
import { KEY_F } from 'constants/keyBoardCode'
import { SOCKET_STATUS } from 'constants/webSocket'
import { Root, Content, Container } from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/style'
import 'xterm/css/xterm.css'

interface ILogTerminalProps {
  webSocketUrl: string
  environment: string
  isFullScreen?: boolean
  canXtermInput?: boolean
}

const { Prompt } = PromptCreator({
  content: "The downloading/uploading hasn't finished"
})

const LogTerminal: React.FC<ILogTerminalProps> = props => {
  const { webSocketUrl, isFullScreen, environment, canXtermInput = true } = props

  const accessControlContext = React.useContext(AccessControlContext)
  const podTerminalActions = accessControlContext[RESOURCE_TYPE.POD_TERMINAL] || []
  const canViewPodTerminalLive = podTerminalActions.includes(RESOURCE_ACTION.ViewLive)
  const canViewPodTerminalNonLive = podTerminalActions.includes(RESOURCE_ACTION.ViewNonLive)

  const isLive = environment === 'LIVE'
  const canViewPodTerminal = isLive ? canViewPodTerminalLive : canViewPodTerminalNonLive

  const terminalContainerRef = React.useRef<HTMLDivElement>(null)
  const uploadFileRef = React.useRef<HTMLInputElement>(null)
  const searchRef = React.useRef<HTMLInputElement>(null)

  const [hasPermission, setHasPermission] = React.useState(true)
  const [isSearching, setIsSearching] = React.useState(false)
  const [socketStatus, setSocketStatus] = React.useState<SOCKET_STATUS>(SOCKET_STATUS.LOADING)
  const [isTransfering, setIsTransfering] = React.useState(false)

  const shouldRenderTerminal = hasPermission || canViewPodTerminal

  const { state, dispatch } = React.useContext(LogTerminalContext)
  const { xterm, socket, fileTransfer } = state
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])

  React.useEffect(() => {
    dispatchers.updateSocketStatus(socketStatus)
  }, [dispatchers, socketStatus])

  React.useEffect(() => {
    dispatchers.updateTransferStatus(isTransfering)
  }, [dispatchers, isTransfering])

  const handleAttachCustomKey = (event: KeyboardEvent) => {
    const keyCode = event.code
    const ctrlKey = event.ctrlKey || event.metaKey

    if (ctrlKey && keyCode === KEY_F) {
      setIsSearching(true)
      searchRef.current.focus()
      event.preventDefault()
      return false
    }
    return true
  }

  const initXTerm = React.useCallback(
    (xterm: XTerm, socket: HeartBeatSocket) => {
      if (canXtermInput) {
        const disposable = xterm.onData((data: string) => {
          socket.sendWebSocketMessage('input', data)
        })
        const { dispose } = disposable
        xterm.disposeOnData = dispose
      }
      xterm.attachCustomKeyEventHandler(handleAttachCustomKey)
    },
    [canXtermInput]
  )

  const createFileTransfer = React.useCallback(
    (xterm: XTerm) => {
      if (canXtermInput) {
        const transfer = new FileTransfer({ xterm, uploadElement: uploadFileRef.current })
        transfer.getIsTransfering = setIsTransfering
        return transfer
      } else {
        return null
      }
    },
    [canXtermInput]
  )

  const destoryLastCreation = React.useCallback(() => {
    dispatchers.destoryTerminal()
  }, [dispatchers])

  const create = React.useCallback(() => {
    if (!webSocketUrl || !terminalContainerRef.current) return
    destoryLastCreation()

    const xterm = new XTerm({ parent: terminalContainerRef.current })
    const fileTransfer = createFileTransfer(xterm)
    const socket = new HeartBeatSocket({ url: webSocketUrl, xterm, fileTransfer })
    socket.getStatus = setSocketStatus
    socket.getPermission = setHasPermission

    initXTerm(xterm, socket)
    dispatchers.updateTerminal({ xterm, socket, fileTransfer })
  }, [webSocketUrl, destoryLastCreation, createFileTransfer, dispatchers, initXTerm])

  React.useEffect(() => {
    create()

    return () => {
      dispatchers.destoryTerminal()
    }
  }, [create, dispatchers])

  const sendResizeMessage = React.useCallback(() => {
    if (!xterm || !socket || socket.readyState !== WebSocket.OPEN) return
    if (shouldRenderTerminal) {
      xterm.fitAddon.fit()
    }
    socket.sendWebSocketMessage('resize', '')
  }, [shouldRenderTerminal, socket, xterm])

  React.useEffect(() => {
    sendResizeMessage()
  }, [isFullScreen, sendResizeMessage])

  useResizeDetector({
    onResize: sendResizeMessage,
    skipOnMount: true,
    handleHeight: true,
    handleWidth: true,
    refreshMode: 'throttle',
    refreshRate: 100,
    targetRef: terminalContainerRef
  })

  const noticeMap = {
    [SOCKET_STATUS.LOADING]: <Loading />,
    [SOCKET_STATUS.FAILED]: <LogError message={socket?.socketErrorMessage} loginRetry={create} />,
    [SOCKET_STATUS.CLOSED]: <LogClose message={socket?.socketErrorMessage} tryAgain={create} />,
    [SOCKET_STATUS.SUCCESS]: null
  }

  return (
    <LogTerminalContext.Provider value={{ state, dispatch }}>
      <Root>
        {shouldRenderTerminal ? (
          <Prompt when={isTransfering} onlyPathname={false}>
            <Content>
              {noticeMap[socketStatus]}
              <Container ref={terminalContainerRef}>
                <Search show={isSearching} inputRef={searchRef} onClose={() => setIsSearching(false)} />
              </Container>
              <input
                type='file'
                multiple={true}
                ref={uploadFileRef}
                style={{ display: 'none' }}
                onChange={fileTransfer?.handleFileChange}
              />
            </Content>
          </Prompt>
        ) : (
          <PermissionDenied />
        )}
      </Root>
    </LogTerminalContext.Provider>
  )
}

export default accessControl(LogTerminal, PERMISSION_SCOPE.TENANT, [RESOURCE_TYPE.POD_TERMINAL])
