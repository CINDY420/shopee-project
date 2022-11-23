React component example:

```jsx
import * as React from 'react'
import { CLUSTER_STATUS as STATUS } from 'constants/cluster'

// 这个函数是为了解决style guide的报错，没实际用处
const noUse = () => {}

<div>
  <HealthyStatus status={STATUS.healthy} />

  <HealthyStatus status={STATUS.unhealthy} />

  <HealthyStatus status={STATUS.unknown} />
</div>
```
