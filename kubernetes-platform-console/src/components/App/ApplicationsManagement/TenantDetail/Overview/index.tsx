/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { Empty } from 'infrad'

import ChartCollapse from 'components/Common/ChartCollapse'
import { Card } from 'common-styles/cardWrapper'

import Metrics from './Metrics'

const Overview: React.FC = () => {
  const [isCollapseOpen, setIsCollapseOpen] = React.useState(false)

  const handleCollapseOpen = (param: string[]) => {
    if (param.length) {
      setIsCollapseOpen(true)
    } else {
      setIsCollapseOpen(false)
    }
  }

  return (
    <Card padding='24px'>
      <ChartCollapse handleCollapseOpen={handleCollapseOpen} panel={isCollapseOpen ? <Metrics /> : <Empty />} />
    </Card>
  )
}

export default Overview
