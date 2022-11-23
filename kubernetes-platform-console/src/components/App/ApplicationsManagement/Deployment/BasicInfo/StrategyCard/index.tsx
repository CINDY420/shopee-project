import * as React from 'react'

import { Root, Item } from '../PhaseCard/style'

interface IProps {
  strategy: any
}

const StrategyCard: React.FC<IProps> = ({ strategy }) => {
  const { maxSurge, maxUnavailable } = strategy

  const items = [
    {
      label: 'MaxSurge:',
      content: maxSurge
    },
    {
      label: 'MaxUnavailable:',
      content: maxUnavailable
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

export default StrategyCard
