## CollapsibleSpace

`CollapsibleSpace` is a component extended from `infrad` [Space](https://bolifestudio.com/components/space-cn/#header), it enable `Space` with collapsible function.

## Examples

### Basic Usage

```tsx
import React from 'react'
import { CollapsibleSpace } from '@infra/components'
import { Tag } from 'infrad'

const BasicUsage = () => {

  return (
    <CollapsibleSpace size={4}>
      {[1, 2, 3, 4, 5, 6].map((number) => <Tag key={number}>{number}</Tag>)}
    </CollapsibleSpace>
  )
}
export default BasicUsage
```

### Direction

```tsx
import React from 'react'
import { CollapsibleSpace } from '@infra/components'
import { Tag } from 'infrad'

const Direction = () => {

  return (
    <CollapsibleSpace direction="vertical" size={1}>
      {[1, 2, 3, 4, 5, 6].map((number) => <Tag key={number}>{number}</Tag>)}
    </CollapsibleSpace>
  )
}
export default Direction
```

### Wrap

Auto wrap line, when horizontal effective

```tsx
import React from 'react'
import { CollapsibleSpace } from '@infra/components'
import { Tag } from 'infrad'
import styled from 'styled-components'

const StyledTag = styled(Tag)`
  margin: 0;
`

const Wrap = () => {

  return (
    <CollapsibleSpace wrap size={[2, 8]}>
      {
        new Array(80).fill(1)
          .map((number, index) => <StyledTag key={`${number}-${index}`}>{index + 1}</StyledTag>)
      }
    </CollapsibleSpace>
  )
}
export default Wrap
```

<API></API>
Other props are all the same as `infrad` [Space API](https://bolifestudio.com/components/space-cn/#API)
