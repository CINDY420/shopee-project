import * as React from 'react'
import { useQueryParam, StringParam } from 'use-query-params'

import { Button, Radio, RadioChangeEvent } from 'infrad'
import { DownloadOutlined, DownOutlined } from 'infra-design-icons'
import { FlexWrapper } from 'common-styles/flexWrapper'
import {
  Root,
  Operations,
  RadioTabs,
  StyledTabs,
  StyledTabPan
} from 'components/App/ApplicationsManagement/PodDetail/Logs/style'

import { getXTermContent } from 'helpers/terminal/xterm'
import { formatTime } from 'helpers/format'
import { getPodContainerRoute } from 'helpers/routes'
import { downloadData } from 'helpers/download'
import { IPod } from 'api/types/application/pod'
import { SOCKET_STATUS } from 'constants/webSocket'
import { SOCKET } from 'constants/server'

import LogTerminal from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal'
import LogDirectoryList from 'components/App/ApplicationsManagement/PodDetail/Common/LogDirectoryList'
import ContainersDropDown from 'components/App/ApplicationsManagement/PodDetail/Common/ContainersDropDown/index'
import PreviousLog from 'components/App/ApplicationsManagement/PodDetail/Logs/PreviousLog'
import {
  LogTerminalContext,
  reducer,
  initialState
} from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/useLogTerminalContext'

interface ILogProps {
  pod: IPod
}

enum LOG_TAB_OPTIONS {
  Output = 'Output',
  Directory = 'Directory'
}

enum OUTPUT_TAB_OPTIONS {
  Current = 'Current',
  Previous = 'Previous'
}

const Logs: React.FC<ILogProps> = ({ pod }) => {
  const { tenantId, projectName, appName, name: podName, clusterId, containers, environment } = pod

  const [routeLogTab, setRouteLogTab] = useQueryParam('logTab', StringParam)
  const [routeOutputTab, setRouteOutputTab] = useQueryParam('outputTab', StringParam)
  const [selectedLogTab, setSelectedLogTab] = React.useState<LOG_TAB_OPTIONS | string>(
    routeLogTab || LOG_TAB_OPTIONS.Output
  )
  const [selectedOutputTab, setSelectedOutputTab] = React.useState<OUTPUT_TAB_OPTIONS | string>(
    routeOutputTab || OUTPUT_TAB_OPTIONS.Current
  )
  const [selectedContainer, setSelectedContainer] = React.useState(containers?.[0])

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const { xterm, socketStatus } = state

  const getWebSocketUrl = () => {
    return (
      selectedContainer &&
      `${SOCKET}/api/v3/${getPodContainerRoute(
        tenantId,
        { name: projectName },
        { name: appName },
        { name: podName },
        selectedContainer
      )}/logs?clusterId=${clusterId}&tailLen=10`
    )
  }

  const handleLogTabChange = (event: RadioChangeEvent) => {
    const tab = event.target.value
    setSelectedLogTab(tab)
    setRouteLogTab(tab)
  }

  const handleOutputTabChange = (activeKey: string) => {
    setSelectedOutputTab(activeKey)
    setRouteOutputTab(activeKey)
  }

  const downloadLog = React.useCallback(() => {
    if (xterm?.buffer) {
      const data = getXTermContent(xterm.buffer)
      const filename = `${podName}-${formatTime(Date.now())}.log`
      downloadData(data, filename)
    }
  }, [podName, xterm])

  const renderLogActionButtons = () => {
    if (
      socketStatus !== SOCKET_STATUS.SUCCESS ||
      selectedLogTab !== LOG_TAB_OPTIONS.Output ||
      selectedOutputTab !== OUTPUT_TAB_OPTIONS.Current
    ) {
      return null
    } else {
      const logActionButtons = (
        <Operations>
          <Button icon={<DownloadOutlined />} onClick={downloadLog} style={{ marginRight: '1em' }}>
            Download
          </Button>
          <Button icon={<DownOutlined />} onClick={() => xterm?.scrollToBottom()}>
            Follow
          </Button>
        </Operations>
      )

      return logActionButtons
    }
  }

  const renderOutputTab = (
    <StyledTabs
      type='card'
      tabPosition='left'
      activeKey={selectedOutputTab}
      onChange={handleOutputTabChange}
      destroyInactiveTabPane={true}
    >
      <StyledTabPan tab={OUTPUT_TAB_OPTIONS.Current} key={OUTPUT_TAB_OPTIONS.Current}>
        <LogTerminal webSocketUrl={getWebSocketUrl()} environment={environment} canXtermInput={false} />
      </StyledTabPan>
      <StyledTabPan tab={OUTPUT_TAB_OPTIONS.Previous} key={OUTPUT_TAB_OPTIONS.Previous}>
        <PreviousLog selectedPod={pod} selectedContainer={selectedContainer} />
      </StyledTabPan>
    </StyledTabs>
  )

  const renderDirecoryTab = <LogDirectoryList currentContainer={selectedContainer} selectedPod={pod} />

  const TAB_MAP = {
    [LOG_TAB_OPTIONS.Output]: renderOutputTab,
    [LOG_TAB_OPTIONS.Directory]: renderDirecoryTab
  }

  return (
    <LogTerminalContext.Provider value={{ state, dispatch }}>
      <Root>
        <FlexWrapper justifyContent='space-between' style={{ marginBottom: '1em' }}>
          <FlexWrapper justifyContent='space-between' style={{ width: '56%' }}>
            <ContainersDropDown
              containers={containers}
              selectedContainer={selectedContainer}
              onContainerSelect={containerName => setSelectedContainer(containerName)}
            />
            <RadioTabs>
              <Radio.Group value={selectedLogTab} onChange={handleLogTabChange}>
                <Radio.Button value={LOG_TAB_OPTIONS.Output}>Standard Output</Radio.Button>
                <Radio.Button value={LOG_TAB_OPTIONS.Directory}>Log Directory</Radio.Button>
              </Radio.Group>
            </RadioTabs>
          </FlexWrapper>
          {renderLogActionButtons()}
        </FlexWrapper>
        {TAB_MAP[selectedLogTab]}
      </Root>
    </LogTerminalContext.Provider>
  )
}

export default Logs
