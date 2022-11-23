import { Modal, Result, Select, Space, Spin, Typography } from 'infrad'
import React from 'react'
import { RadiosTabPane, RadiosTabs } from 'src/components/Common/RadiosTabs'
import { Pod } from 'src/components/Deployment/PodList'
import {
  CenterTextWrapper,
  Container,
  Line,
  ModalBody,
  Title,
} from 'src/components/Deployment/PodList/Action/Stdout/style'
import { ReloadOutlined } from 'infra-design-icons'
import AnsiUp from 'ansi_up'
import { fetch } from 'src/rapper'

const { Text } = Typography
const ansiUp = new AnsiUp()

enum LogMode {
  CURRENT = 'Current',
  PREVIOUS = 'Previous',
}

type IContainer = Pod['podStatus']['containerStatuses'][0]

interface ILogLine {
  type: string
  content: string
}

interface IStdoutProps {
  sduName: string
  deployId: string
  isLogsVisible: boolean
  selectedPod: Pod
  onLogsVisibleChange: (visible: boolean) => void
}

const parseLogs = (logString: string) =>
  logString
    .split('\n')
    .slice(0, -1)
    .map((content) => ({
      type: 'STDOUT',
      content,
    }))

export const Stdout: React.FC<IStdoutProps> = ({
  sduName,
  deployId,
  isLogsVisible,
  selectedPod,
  onLogsVisibleChange: handleLogsVisibleChange,
}) => {
  const {
    containerInfo: containerList = [],
    clusterName,
    namespace,
    podStatus,
    podName,
  } = selectedPod ?? {}
  const { containerStatuses = [] } = podStatus ?? {}
  const defaultContainer =
    containerStatuses.find((containerStatus) => containerStatus.name === sduName) ??
    containerStatuses[0]
  const [currentContainer, setCurrentContainer] = React.useState<IContainer>()
  const [currnetLogMode, setCurrentLogMode] = React.useState(LogMode.CURRENT)
  const [logLines, setLogLines] = React.useState<ILogLine[]>([])
  const [loading, setLoading] = React.useState(true)

  const getPodLogs = React.useCallback(async () => {
    setLoading(true)
    const { data } = await fetch[
      'GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}/logs'
    ]({
      sduName,
      deployId,
      isPrevious: currnetLogMode === LogMode.PREVIOUS,
      namespace,
      cluster: clusterName,
      podName,
    })
    setLogLines(data === '' ? [] : parseLogs(data))
    setLoading(false)
  }, [clusterName, currnetLogMode, deployId, namespace, podName, sduName])

  React.useEffect(() => {
    if (isLogsVisible) {
      void getPodLogs()
    }
  }, [getPodLogs, isLogsVisible])

  React.useEffect(() => {
    setCurrentContainer(defaultContainer)
  }, [defaultContainer])

  const handleContainerSelected = (containerId: string) => {
    const newContainer = containerStatuses.find(
      (containerStatus) => containerStatus.containerId === containerId,
    )
    setCurrentContainer(newContainer)
  }
  const viewLogs = (
    <Container direction="vertical">
      <Title>View Logs</Title>
      <Space size={8}>
        Containter:
        <Select
          value={currentContainer?.containerId}
          dropdownMatchSelectWidth={false}
          onSelect={(containerId: string) => handleContainerSelected(containerId)}
          style={{ minWidth: '160px', marginLeft: '8px' }}
        >
          {containerList?.map((container) => (
            <Select.Option value={container.containerId} key={container.containerId}>
              {container.contianerName}
            </Select.Option>
          ))}
        </Select>
      </Space>
      <RadiosTabs
        activeKey={currnetLogMode}
        onChange={(newLogMode: LogMode) => setCurrentLogMode(newLogMode)}
      >
        {Object.values(LogMode).map((mode) => (
          <RadiosTabPane key={mode} name={mode} value={mode} />
        ))}
      </RadiosTabs>
    </Container>
  )

  const currentLogErrorSubTitle = (
    <Space direction="vertical" size={1}>
      Your container has encountered some problems,
      <Space size={4}>
        please use the
        <Text
          style={{ color: '#2673DD', cursor: 'pointer' }}
          underline
          onClick={() => setCurrentLogMode(LogMode.PREVIOUS)}
        >
          previous window
        </Text>
        for details.
      </Space>
    </Space>
  )
  const previousLogErrorSubTitle = (
    <Space direction="vertical" size={1}>
      <Space size={4}>
        inner http exception: previous terminated container {currentContainer?.name} in pod
      </Space>
      <Space size={4}>{`"${selectedPod?.podName}"`} not found</Space>
    </Space>
  )
  return (
    <Modal
      title={viewLogs}
      visible={isLogsVisible}
      okButtonProps={{ icon: <ReloadOutlined /> }}
      okText="Reload"
      onOk={() => void getPodLogs()}
      onCancel={() => handleLogsVisibleChange(false)}
      width="1200px"
      style={{ height: '1144px' }}
      destroyOnClose
    >
      {loading ? (
        <CenterTextWrapper>
          <Spin />
        </CenterTextWrapper>
      ) : (
        <ModalBody>
          {logLines.length === 0 ? (
            <Result
              status="error"
              title="Error"
              subTitle={
                currnetLogMode === LogMode.CURRENT
                  ? currentLogErrorSubTitle
                  : previousLogErrorSubTitle
              }
            />
          ) : (
            logLines.map((line) => (
              <Line
                key={line.content}
                dangerouslySetInnerHTML={{
                  __html: ansiUp.ansi_to_html(`${line.type} ${line.content}`),
                }}
              />
            ))
          )}
        </ModalBody>
      )}
    </Modal>
  )
}
