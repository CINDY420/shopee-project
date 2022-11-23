import * as React from 'react'

import { Button } from 'infrad'
import { CloseCircleFilled } from 'infra-design-icons'
import {
  Root,
  ErrorText,
} from 'components/App/ProjectMGT/JobDetail/PodList/TerminalModal/TerminalComponent/TerminalError/style'

interface ILogErrorProps {
  loginRetry: () => void
  message?: string
}

const ERROR_MESSAGE = 'Container Login Failed'

const LogError: React.FC<ILogErrorProps> = (props) => {
  const { loginRetry, message } = props
  const realMessage = typeof message === 'object' ? JSON.stringify(message) : message

  return (
    <Root>
      <CloseCircleFilled style={{ color: '#e43937', fontSize: '5em' }} />
      <ErrorText>{realMessage || ERROR_MESSAGE}</ErrorText>
      <Button type="primary" onClick={() => loginRetry()}>
        Try again
      </Button>
    </Root>
  )
}

export default LogError
