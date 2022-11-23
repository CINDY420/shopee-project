import * as React from 'react'
import { EnabledAlertWrapper, StyledDiv, Icon, Message, Description } from './style'
import { CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons'

interface IProps {
  enable: boolean
}
enum AlertInfo {
  ENABLE_MESSAGE = 'Enabled',
  ENABLE_DESCRIPTION = 'Deployment for your application will follow the config here.',
  DISABLE_MESSAGE = 'Disabled',
  DISABLE_DESCRIPTION = 'This config will not affect your deployment now, please contact Platform SRE to enable this config.'
}

export const EnabledAlert: React.FC<IProps> = ({ enable }) => {
  return (
    <EnabledAlertWrapper theme={enable}>
      <StyledDiv>
        <Icon>
          {enable === true ? (
            <CheckCircleFilled style={{ color: '#55CC77' }} />
          ) : (
            <CloseCircleFilled style={{ color: '#FF4742' }} />
          )}
        </Icon>
        <Message>{enable === true ? AlertInfo.ENABLE_MESSAGE : AlertInfo.DISABLE_MESSAGE}</Message>
      </StyledDiv>
      <Description>{enable === true ? AlertInfo.ENABLE_DESCRIPTION : AlertInfo.DISABLE_DESCRIPTION}</Description>
    </EnabledAlertWrapper>
  )
}
