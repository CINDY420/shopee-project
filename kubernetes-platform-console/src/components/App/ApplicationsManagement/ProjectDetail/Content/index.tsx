import * as React from 'react'

import { Card } from 'common-styles/cardWrapper'
import { StyledTitle } from 'common-styles/title'

import ApplicationTable from './ApplicationTable'

const Content: React.FC<any> = () => {
  return (
    <Card>
      <StyledTitle>Application List</StyledTitle>
      <ApplicationTable />
    </Card>
  )
}

export default Content
