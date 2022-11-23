import * as React from 'react'

import { formatLimitAndRequestText } from 'helpers/deploy'

import HealthCheckComp from './HealthCheck'
import LifeCycleComp from './LifeCycle'
import { Root, Item } from './style'

interface IProps {
  index: number
  phase: any
}

const PhaseCard: React.FC<IProps> = ({ index, phase }) => {
  const { name, image, cpuLimit, memLimit, cpuRequest, memRequest, healthCheck = {}, lifeCycle = {} } = phase

  const items = [
    {
      label: `Container ${index + 1}:`,
      content: name
    },
    {
      label: 'Image:',
      content: image
    },
    {
      label: 'CPU Limit:',
      content: formatLimitAndRequestText(cpuLimit, 'Cores')
    },
    {
      label: 'CPU Requests:',
      content: formatLimitAndRequestText(cpuRequest, 'Cores')
    },
    {
      label: 'Memory Limit:',
      content: formatLimitAndRequestText(memLimit, 'GiB')
    },
    {
      label: 'Memory Requests:',
      content: formatLimitAndRequestText(memRequest, 'GiB')
    }
  ]

  return (
    <Root>
      {items.map(item => (
        <Item key={item.label}>
          <span>{item.label}</span>
          {item.content}
        </Item>
      ))}
      <HealthCheckComp healthCheck={healthCheck} />
      <LifeCycleComp lifeCycle={lifeCycle} />
    </Root>
  )
}

export default PhaseCard
