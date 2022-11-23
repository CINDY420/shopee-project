This component is used for the chart collapse function in Group and Project pages of K8S system.

The layout of this component is adjusted to meet the requirements of UI design, so it is only suitable for chart collapse and display.

example：

```jsx
import * as React from 'react'

import QuotasOverview from 'components/App/ApplicationsManagement/Common/QuotasOverview'

import 'infrad/dist/infrad.css'

const usage = {
  Ready: true,
  alarm: 'none',
  applied: 100,
  total: 300,
  used: 50
}

const quota = {
  cpu: usage,
  filesystem: usage,
  memory: usage
}

const handleEnvChange = (env) => {
  console.log(env)
}

const handleClusterChange = (cluster) => {
  console.log(cluster)
}

<ChartCollapse
  panel={
    <QuotasOverview
      isCollapse={true}
      quota={quota}
      clusters={['cluster1', 'cluster2']}
      envs={['env1', 'env2']}
      selectedCluster={'selectedCluster'}
      selectedEnv={'selectedEnv'}
      onEnvChange={handleEnvChange}
      onClusterChange={handleClusterChange}
    />
  }
/>
```
