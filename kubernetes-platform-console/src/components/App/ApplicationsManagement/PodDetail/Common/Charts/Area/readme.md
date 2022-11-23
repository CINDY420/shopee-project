React component example:

```jsx
import * as React from 'react'

import { formatAreaChartData } from 'helpers/chart'
import { formatFloat } from 'helpers/format'

const graph = [
  {x: "2020-10-27T11:04:27Z", y: 39.98985290527344},
  {x: "2020-10-27T11:09:27Z", y: 39.98985290527344},
  {x: "2020-10-27T11:14:27Z", y: 39.98985290527344},
  {x: "2020-10-27T11:19:27Z", y: 39.98985290527344},
  {x: "2020-10-27T11:24:27Z", y: 39.98985290527344},
  {x: "2020-10-27T11:29:27Z", y: 39.98985290527344},
  {x: "2020-10-27T11:34:27Z", y: 39.98985290527344},
  {x: "2020-10-27T11:39:27Z", y: 39.98985290527344},
  {x: "2020-10-27T11:44:27Z", y: 39.98985290527344}
]


// 这个函数是为了解决style guide的报错，没实际用处
const noUse = () => {}


<Area
  empty={!graph.length}
  dataMap={formatAreaChartData(graph, formatFloat)}
  wrapperMinWidth='20em'
  yAxisName='y'
/>
```
