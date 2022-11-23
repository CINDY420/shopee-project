import * as React from 'react'

import { Card } from 'common-styles/cardWrapper'
import { VerticalDivider } from 'common-styles/divider'
import NodeList from './NodeList'
import Statistics from './Statistics'

const Overview: React.FC = (props: any) => {
  const { isDeleting } = props
  return (
    <div>
      <Card>
        <Statistics isDeleting={isDeleting} />
      </Card>
      <VerticalDivider size='15px' />
      <Card>
        <NodeList isDeleting={isDeleting} />
      </Card>
    </div>
  )
}

export default Overview
