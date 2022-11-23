## RouteLeavingConfirm

`RouteLeavingConfirm` is a component combined with `infrad` [Modal.confirm](https://bolifestudio.com/components/modal-cn/#components-modal-demo-confirm) and `react-router-dom` [Prompt](https://v5.reactrouter.com/web/api/Prompt), used to prompt the user before navigating away from a page.

## Examples

### Basic Usage

```tsx
import React from 'react'
import { RouteLeavingConfirm } from '@infra/components'
import { Link } from 'react-router-dom'

const BasicUsage = () => {

  return (
    <>
      <RouteLeavingConfirm
        title="Notification"
        content="Are you sure to leave?"
        okText="Confirm"
        cancelText="Cancel"
      />
      <Link to="collapsible-space">Click me to change route</Link>
    </>
  )
}
export default BasicUsage
```

<API></API>
Other props are all the same as `infrad` [Modal API](https://bolifestudio.com/components/modal-cn/#API)
