import * as React from 'react'
import Volumes from './Volumes'
import Environments from './Environments'
import Metrics from './Metrics'

import { IPod } from 'api/types/application/pod'

import { Section } from './style'

interface IOverviewProps {
  pod: IPod
}

const Overview: React.FC<IOverviewProps> = ({ pod }) => {
  return (
    <>
      <Section>
        <Metrics pod={pod} />
      </Section>
      <Section>
        <Environments pod={pod} />
      </Section>
      <Section>
        <Volumes pod={pod} />
      </Section>
    </>
  )
}

export default Overview
