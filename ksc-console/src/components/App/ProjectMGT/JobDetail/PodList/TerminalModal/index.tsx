import React from 'react'
import TerminalComponent from 'components/App/ProjectMGT/JobDetail/PodList/TerminalModal/TerminalComponent'
import {
  initialState,
  reducer,
  TerminalContext,
} from 'components/App/ProjectMGT/JobDetail/PodList/TerminalModal/useTerminalContext'
import { Col, Select } from 'infrad'
import { StyledRow } from 'components/App/ProjectMGT/JobDetail/PodList/TerminalModal/style'
import { podControllerListPodContainers } from 'swagger-api/apis/Pod'
import { IPodContainerListItem, IPodListItem } from 'swagger-api/models'
import { openApiGetPodTerminalSessionId } from 'helpers/openApi'

const { Option } = Select
const getWebSocketUrl = (sessionId) => {
  if (sessionId) {
    const host = document.location.host
    return `wss://${host}/ws/api/shell?sessionId=${sessionId}`
  }
  return ''
}
interface ITerminalModalProps {
  selectedPod: IPodListItem
  tenantId: string
  projectId: string
}
const TerminalModal: React.FC<ITerminalModalProps> = ({ selectedPod, tenantId, projectId }) => {
  const { jobId, podName, clusterId } = selectedPod
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [containerOptions, setContainerOptions] = React.useState<IPodContainerListItem[]>([])
  const [selectedContainer, setSelectedContainer] = React.useState<IPodContainerListItem | null>(
    null,
  )
  const [sessionId, setSessionId] = React.useState<string>('')
  const [webSocketUrl, setWebSocketUrl] = React.useState('')

  const handleContainerChange = (containerName: string) => {
    const selectedContainer = containerOptions.find((item) => item.containerName === containerName)
    selectedContainer && setSelectedContainer(selectedContainer)
  }

  const getSessionId = React.useCallback(async ({ containerName, namespace }) => {
    if (containerName && namespace) {
      const { sessionId } = await openApiGetPodTerminalSessionId({
        clusterId,
        namespace,
        podName,
        containerName,
      })
      setSessionId(sessionId)
      const webSocketUrl = getWebSocketUrl(sessionId)
      setWebSocketUrl(webSocketUrl)
    }
  }, [])

  const listContainers = React.useCallback(async () => {
    const { items } = await podControllerListPodContainers({
      tenantId,
      projectId,
      jobId,
      podName,
    })
    setContainerOptions(items ?? [])
    if (items.length > 0) setSelectedContainer(items[0])
  }, [tenantId, projectId, jobId, podName])

  React.useEffect(() => {
    selectedContainer && getSessionId(selectedContainer)
  }, [selectedContainer, getSessionId])

  React.useEffect(() => {
    listContainers()
  }, [listContainers])

  return (
    <TerminalContext.Provider value={{ state, dispatch }}>
      <StyledRow align="middle">
        <Col span={2}>Container:</Col>
        <Col span={4}>
          <Select
            value={selectedContainer?.containerName}
            style={{ width: '100%' }}
            onChange={handleContainerChange}
          >
            {containerOptions.map((item) => (
              <Option value={item.containerName} key={item.containerName}>
                {item.containerName}
              </Option>
            ))}
          </Select>
        </Col>
      </StyledRow>
      <TerminalComponent webSocketUrl={webSocketUrl} sessionId={sessionId} />
    </TerminalContext.Provider>
  )
}

export default TerminalModal
