```jsx
import * as React from 'react'
import { DeleteOutlined, FormOutlined } from 'infra-design-icons'

import Breadcrumbs from 'components/Common/Breadcrumbs'

const editCluster = () => {
  alert('Edit Cluster')
}

<DetailLayout
  breadcrumbs={<Breadcrumbs />}
  title={`Cluster: ClusterName`}
  tags={['env', 'cid']}
  body={<div>Detail body</div>}
  buttons={[
    {
      icon: <FormOutlined />,
      text: 'Edit Cluster',
      click: editCluster
    },
    {
      icon: <DeleteOutlined />,
      text: 'Delete Cluster',
      click: () => {
        alert('Delete Cluster')
      }
    }
  ]}
/>

```
