import * as React from 'react'

import {
  Root,
  LoadingImage,
  LoadingText
} from 'components/App/ApplicationsManagement/PodDetail/Common/LogTerminal/Loading/style'

const Loading: React.FC = () => {
  return (
    <Root>
      <LoadingImage />
      <LoadingText>Container logging into...</LoadingText>
    </Root>
  )
}

export default Loading
