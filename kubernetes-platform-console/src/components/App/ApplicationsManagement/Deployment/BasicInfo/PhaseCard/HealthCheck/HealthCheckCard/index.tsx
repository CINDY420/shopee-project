import * as React from 'react'

import { HEALTH_CHECK_TYPE_TEXT } from 'constants/application'
import { Root, Item } from './style'

interface IProps {
  probe: any
}

const renderSeconds = seconds => (seconds !== undefined ? seconds : '-')

const HealthCheckCard: React.FC<IProps> = ({ probe }) => {
  const { type, typeValue, initialDelaySeconds, periodSeconds, successThreshold, timeoutSeconds } = probe

  const items = [
    {
      label: 'Type:',
      content: type
    },
    {
      label: `${HEALTH_CHECK_TYPE_TEXT[type] || 'Command'}:`,
      content: typeValue
    },
    {
      label: 'initialDelaySeconds:',
      content: renderSeconds(initialDelaySeconds)
    },
    {
      label: 'periodSeconds:',
      content: renderSeconds(periodSeconds)
    },
    {
      label: 'successThreshold:',
      content: renderSeconds(successThreshold)
    },
    {
      label: 'timeoutSeconds:',
      content: renderSeconds(timeoutSeconds)
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
    </Root>
  )
}

export default HealthCheckCard
