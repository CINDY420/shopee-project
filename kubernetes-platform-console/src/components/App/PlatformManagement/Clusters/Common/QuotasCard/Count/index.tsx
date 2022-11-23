import * as React from 'react'
import { Root, Circle, Desc, StyleCount, Name } from './style'

interface IUsagecardParams {
  name: string
  count?: number
  desc?: string
  color?: string
  unit?: string
  isNoLimited?: boolean
}

const Count = ({ color, name, unit, count, desc, isNoLimited }: IUsagecardParams) => {
  return (
    <Root>
      <Circle color={color} />
      <div>
        <Name>{name}</Name>
        {count !== undefined && (
          <StyleCount>
            {count}
            <span>{unit}</span>
          </StyleCount>
        )}
        {isNoLimited ? <Desc top='1em'>No limited</Desc> : <Desc>{desc}</Desc>}
      </div>
    </Root>
  )
}

export default Count
