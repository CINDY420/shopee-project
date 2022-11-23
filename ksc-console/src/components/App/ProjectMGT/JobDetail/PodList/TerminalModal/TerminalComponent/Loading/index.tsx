import * as React from 'react'
import {
  Root,
  LoadingImage,
  LoadingText,
} from 'components/App/ProjectMGT/JobDetail/PodList/TerminalModal/TerminalComponent/Loading/style'

const Loading: React.FC = () => (
  <Root>
    <LoadingImage />
    <LoadingText>loading...</LoadingText>
  </Root>
)

export default Loading
