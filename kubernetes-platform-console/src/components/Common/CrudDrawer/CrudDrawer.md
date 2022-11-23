This component is used for right Drawer in this system.

The right drawer is always used for submitting forms in K8S system.

```jsx
import * as React from 'react'
import { Button } from 'infrad'

const [visible, setVisible] = React.useState(false)

const submit = () => {
  alert('onSubmit')
}

<div>
  <Button onClick={() => {
    setVisible(true)
  }}>
    Open CrudDrawer
  </Button>
  <CrudDrawer
    title='CrudDrawer'
    visible={visible}
    closeDrawer={() => {
      setVisible(false)
    }}
    body={
      <div>CrudDrawer</div>
    }
    onSubmit={submit}
  ></CrudDrawer>
</div>

```
