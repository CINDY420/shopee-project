import React from 'react'
import { selectedProfile } from 'states/applicationState/profile'
import { useRecoilValue } from 'recoil'

import BaseDetailLayout from 'components/Common/DetailLayout'
import { Root, StyledIframe } from './style'

import { addProtocol } from 'helpers/routes'

interface IIFrame {
  src: string
}
const IFrame: React.FC<IIFrame> = ({ src }) => (
  <Root>
    <StyledIframe src={addProtocol(src)} />
  </Root>
)

const FlameGraph: React.FC = () => {
  const { data: profileDetail } = useRecoilValue(selectedProfile)
  const { profileId = '', podName = '', graphs = [] } = profileDetail || {}

  const tabs = graphs.map((src, index) => ({
    name: index === 0 ? 'Flame Graph' : `Graph ${index + 1}`,
    Component: IFrame,
    props: { src }
  }))

  return (
    <BaseDetailLayout
      title={`Profile ID: ${profileId}`}
      tags={[`Pod Name: ${podName}`]}
      tabs={tabs}
      headerBodyStyle={{ marginTop: '16px' }}
    />
  )
}

export default FlameGraph
