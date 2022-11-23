import * as React from 'react'
import { Alert } from 'infrad'

import { Root, Text, StyledButton } from './style'

interface IErrorTryAgainProps {
  tryAgain: () => void
  message?: string
  btnText?: string
}

const ErrorTryAgain: React.FC<IErrorTryAgainProps> = props => {
  const { tryAgain, message, btnText } = props
  const realMessage = typeof message === 'object' ? JSON.stringify(message) : message

  return (
    <Root>
      <Text>
        <Alert message={realMessage || 'Something wrong happened'} type='error' showIcon />
      </Text>
      <StyledButton type='primary' onClick={() => tryAgain()}>
        {btnText || 'Try again'}
      </StyledButton>
    </Root>
  )
}

export default ErrorTryAgain
