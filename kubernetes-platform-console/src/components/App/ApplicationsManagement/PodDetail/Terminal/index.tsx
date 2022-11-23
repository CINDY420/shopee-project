import * as React from 'react'

import PromptCreator from 'components/Common/PromptCreator'
import { getPodContainerRoute } from 'helpers/routes'
import { SOCKET } from 'constants/server'
import { IPod } from 'api/types/application/pod'

import ContainersDropDown from 'components/App/ApplicationsManagement/PodDetail/Common/ContainersDropDown'
import FileTransferGuidePopover from 'components/App/ApplicationsManagement/PodDetail/Common/FileTransferGuidePopover'
import LogTerminal from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal'
import FullScreenButton from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/FullScreen'
import {
  LogTerminalContext,
  reducer,
  initialState
} from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/useLogTerminalContext'
import {
  Root,
  StyleHeader,
  StyledFullScreenHeader
} from 'components/App/ApplicationsManagement/PodDetail/Terminal/style'

const { Confirm } = PromptCreator({
  content: "The downloading/uploading hasn't finished"
})

interface ITerminalProps {
  pod: IPod
}

const Terminal: React.FC<ITerminalProps> = ({ pod }) => {
  const { tenantId, projectName, appName, name: podName, clusterId, containers, environment } = pod

  const [selectedContainer, setSelectedContainer] = React.useState(containers?.[0])
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const { isTransfering } = state

  const getWebSocketUrl = React.useCallback(() => {
    return (
      selectedContainer &&
      `${SOCKET}/api/v3/${getPodContainerRoute(
        tenantId,
        { name: projectName },
        { name: appName },
        { name: podName },
        selectedContainer
      )}/terminal?clusterId=${clusterId}`
    )
  }, [appName, clusterId, tenantId, podName, projectName, selectedContainer])

  const handleContanierChange = (containerName: string) => {
    if (selectedContainer !== containerName) {
      if (isTransfering) {
        Confirm({
          onOk: () => {
            setSelectedContainer(containerName)
          }
        })
      } else {
        setSelectedContainer(containerName)
      }
    }
  }

  const renderFullScreenButton = () => (
    <FullScreenButton
      terminalContainer={containerRef.current}
      isFullScreen={isFullScreen}
      onFullScreenChange={(isFullScreen: boolean) => setIsFullScreen(isFullScreen)}
    />
  )

  const renderHeader = () => {
    const Header = (
      <StyleHeader>
        <ContainersDropDown
          containers={containers}
          selectedContainer={selectedContainer}
          onContainerSelect={handleContanierChange}
        />
        <div>
          <FileTransferGuidePopover />
          {renderFullScreenButton()}
        </div>
      </StyleHeader>
    )

    const FullScreenHeader = (
      <StyledFullScreenHeader>
        {podName}
        {renderFullScreenButton()}
      </StyledFullScreenHeader>
    )

    return isFullScreen ? FullScreenHeader : Header
  }

  return (
    <LogTerminalContext.Provider value={{ state, dispatch }}>
      <Root ref={containerRef} isFullScreen={isFullScreen}>
        {renderHeader()}
        <LogTerminal webSocketUrl={getWebSocketUrl()} environment={environment} />
      </Root>
    </LogTerminalContext.Provider>
  )
}

export default Terminal
