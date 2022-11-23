import * as React from 'react'
import {
  InfoWrapper,
  InfoDiv,
  AlertWrapper,
  StyledIcon,
  Message,
  PlayWrapper,
  StyledDiv,
  StyledTag,
  StyledText,
  Footer
} from './style'
import { Typography, Button, Modal, Select, message } from 'infrad'
import { formatTime } from 'helpers/format'
import { IInformationFilled } from 'infra-design-icons'
import { ITerminalReplayInfo } from 'api/types/application/terminalReplayInfo'
import {
  applicationsControllerGetApplicationTerminalCommandReplayDetail,
  applicationsControllerGetApplicationTerminalCommandReplayFileData
} from 'swagger-api/v3/apis/Applications'
import { useQueryParam, StringParam } from 'use-query-params'
import AsciinemaPlayer from 'components/App/ApplicationsManagement/Common/AsciinemaPlayer'
import { IApplication } from 'api/types/application/application'

import moment from 'moment'

const { Link } = Typography

const { Option } = Select
interface IReplayModalProps {
  application: IApplication
  onCancel: () => void
}

const REPLAY_SPEED = {
  HALF_SPEED: 0.5,
  x1_SPEED: 1,
  x2_SPEED: 2,
  x4_SPEED: 4
} as const

const ReplayModal: React.FC<IReplayModalProps> = ({ onCancel, application }) => {
  const [sessionId] = useQueryParam('selectedPlay', StringParam)
  const [createdTime] = useQueryParam('selectedTime', StringParam)
  const [terminalReplayData, setTerminalReplayData] = React.useState<ITerminalReplayInfo | undefined>()
  const [terminalReplayStream, setTerminalReplayStream] = React.useState<string | undefined>()
  const [replaySpeed, setReplaySpeed] = React.useState<number>(REPLAY_SPEED.x1_SPEED)

  const { tenantId, projectName, name: appName } = application

  const getTerminalReplayData = React.useCallback(async () => {
    const value = await applicationsControllerGetApplicationTerminalCommandReplayDetail({
      tenantId,
      projectName,
      appName,
      sessionId: sessionId ?? '',
      createdTime: createdTime ?? ''
    })
    setTerminalReplayData(value)
  }, [appName, createdTime, projectName, sessionId, tenantId])

  const getTerminalReplay = React.useCallback(async () => {
    try {
      const value = await applicationsControllerGetApplicationTerminalCommandReplayFileData({
        tenantId,
        projectName,
        appName,
        sessionId: sessionId ?? '',
        createdTime: createdTime ?? ''
      })
      setTerminalReplayStream(value.toString())
    } catch {
      message.error("You don't have permission to watch this video ")
    }
  }, [appName, createdTime, projectName, sessionId, tenantId])

  React.useEffect(() => {
    if (sessionId && createdTime) {
      getTerminalReplayData()
      getTerminalReplay()
    }
  }, [createdTime, getTerminalReplay, getTerminalReplayData, sessionId])

  const handleChange = (speed: { value: number; key: string; label: string }) => {
    setReplaySpeed(speed.value)
  }

  const handleResetReplaySpeed = () => {
    setReplaySpeed(REPLAY_SPEED.x1_SPEED)
  }

  const getGenerateFileName = (terminalReplayData: ITerminalReplayInfo) => {
    const generateTimeForFileName = (time: moment.Moment) => `${time.format('YYYYMMDD')}[${time.format('HH_mm_ss')}]`
    const beginTime = moment.utc(terminalReplayData.time).local()

    const endTime = moment
      .utc(terminalReplayData?.time)
      .local()
      .add(terminalReplayData.duration)

    return `${terminalReplayData.operator}${generateTimeForFileName(beginTime)}-${generateTimeForFileName(endTime)}`
  }

  const downloadReplay = () => {
    applicationsControllerGetApplicationTerminalCommandReplayFileData({
      tenantId,
      projectName,
      appName,
      sessionId: sessionId ?? '',
      createdTime: createdTime ?? ''
    }).then(res => {
      const fileName = getGenerateFileName(terminalReplayData)
      const blob = new Blob([res.toString()], { type: 'text/plain;charset=UTF-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', `${fileName}.cast`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const options = [REPLAY_SPEED.HALF_SPEED, REPLAY_SPEED.x1_SPEED, REPLAY_SPEED.x2_SPEED, REPLAY_SPEED.x4_SPEED]

  return (
    <Modal
      title={<div style={{ color: '#333333', fontSize: '26px' }}>Replay</div>}
      width='80%'
      visible={sessionId !== '' && createdTime !== ''}
      getContainer={false}
      centered={true}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Footer key='footer'>
          <div style={{ display: 'block', textAlign: 'center', marginRight: '10px', lineHeight: '32px' }}>Speed</div>
          <Select
            labelInValue
            value={{ value: replaySpeed, key: replaySpeed.toString(), label: `x${replaySpeed.toString()}` }}
            style={{ width: '120px', height: '32px', textAlign: 'left', marginRight: '8px' }}
            onChange={handleChange}
          >
            {options.map((speed: number) => {
              return <Option key={speed.toString()} label={`x${speed.toString()}`} value={speed}>{`x${speed}`}</Option>
            })}
          </Select>
          <Button style={{ marginRight: '8px' }} onClick={handleResetReplaySpeed}>
            Reset
          </Button>
          <Button key='submit' type='primary' onClick={downloadReplay}>
            Download
          </Button>
        </Footer>
      ]}
    >
      <InfoWrapper>
        <InfoDiv>
          <StyledDiv>
            <StyledText type='secondary'>Operator: </StyledText>
            <StyledText>{terminalReplayData?.operator}</StyledText>
          </StyledDiv>
          <StyledDiv>
            <StyledText type='secondary'> Node:</StyledText>
            <StyledText>{terminalReplayData?.nodeName} </StyledText>
            <StyledTag> IP: {terminalReplayData?.nodeIP}</StyledTag>
          </StyledDiv>
        </InfoDiv>
        <InfoDiv>
          <StyledDiv>
            <StyledText type='secondary'>Container: </StyledText>
            <StyledText>{terminalReplayData?.container}</StyledText>
          </StyledDiv>
          <StyledDiv>
            <StyledText type='secondary'> Pod: </StyledText>
            <StyledText>{terminalReplayData?.podName} </StyledText>
            <StyledTag>IP: {terminalReplayData?.podIP}</StyledTag>
          </StyledDiv>
        </InfoDiv>
        <InfoDiv>
          <StyledDiv>
            <StyledText type='secondary'>Created Time: </StyledText>
            <StyledText>
              {terminalReplayData ? `${formatTime(terminalReplayData.time).replace(/(-)/g, '/')} (GMT+8)` : ''}
            </StyledText>
          </StyledDiv>
          <StyledDiv>
            <StyledText type='secondary'> Duration: </StyledText>
            <StyledText>{terminalReplayData?.duration}</StyledText>
          </StyledDiv>
        </InfoDiv>
      </InfoWrapper>
      <AlertWrapper>
        <StyledIcon>
          <IInformationFilled style={{ color: '#2673DD' }} />
        </StyledIcon>
        <Message>
          Web Terminal player may fail when terminal log is very large. Alternatively, you can download the log file and
          run it on your local. To run on your local, you need to set up{' '}
          <Link href='https://asciinema.org/docs/installation' target='_blank'>
            Asciinema
          </Link>
          . Then, play the log with command “Asciinema play /path/to/command.Iog” Any issues, please contact our lovely
          Infra Dev Team.{' '}
        </Message>
      </AlertWrapper>
      <PlayWrapper>
        <AsciinemaPlayer key={replaySpeed.toString()} data={terminalReplayStream} loading={true} speed={replaySpeed} />
      </PlayWrapper>
    </Modal>
  )
}

export default ReplayModal
