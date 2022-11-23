React component example:

```jsx
import * as React from 'react'
import { RadiosTabPane } from '../RadiosTabs'

const envs = ['a', 'b', 'c', 'd']

const [selectedEnv, setSelectedEnv] = React.useState(envs[0])

const handleChange = env => { setSelectedEnv(env) }

<div>
  <RadiosTabs activeKey={selectedEnv} onChange={handleChange}>
    {envs.map(env => (
      <RadiosTabPane key={env} name={env} value={env} />
    ))}
  </RadiosTabs>
</div>
```
