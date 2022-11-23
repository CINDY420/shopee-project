import * as React from 'react'
import { Link } from 'react-router-dom'

import { Button } from 'infrad'
import { CloseCircleFilled } from 'infra-design-icons'
import { Root, ErrorText } from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/LogError/style'

interface ILogErrorProps {
  loginRetry: () => void
  message?: string
}

const PREVIOUS_WINDOW_LOG_QUERY = '?secondTab=Output&selectedTab=Log&thirdTab=Previous'
const ERROR_MESSAGE = 'Container Login Failed'

const LogError: React.FC<ILogErrorProps> = props => {
  const { loginRetry, message } = props
  const realMessage = typeof message === 'object' ? JSON.stringify(message) : message

  return (
    <Root>
      <CloseCircleFilled style={{ color: '#e43937', fontSize: '5em' }} />
      <ErrorText>{realMessage || ERROR_MESSAGE}</ErrorText>
      <ErrorText>
        Please use the{' '}
        <Link to={{ pathname: location.pathname, search: PREVIOUS_WINDOW_LOG_QUERY }}>previous window</Link> for
        details.
      </ErrorText>
      <Button type='primary' onClick={() => loginRetry()}>
        Try again
      </Button>
    </Root>
  )
}

export default LogError
