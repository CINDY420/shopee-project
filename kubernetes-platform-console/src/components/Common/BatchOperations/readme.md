React component example:

```jsx
import * as React from 'react'
import { Table, Button, message } from 'infrad'
import 'infrad/dist/infrad.css'

const [isBatchEditing, setBatchEditing] = React.useState(false)
const [selectedRowKeys, setSelectedRowKeys] = React.useState([])
const divRef = React.useRef(null)
const [divSt, setDivSt]= React.useState()

const columns = [{
  title: 'Name',
  dataIndex: 'key',
  key: 'key'
},
{
  title: 'Value',
  dataIndex: 'value',
  key: 'value'
}]

const data = [{key: 'key1', value: 'value1'}, {key: 'key2', value: 'value2'}, {key: 'key3', value: 'value3'}]

const handleCancelBatchKill = () => {
  setBatchEditing(false)
  resetSelectedRowKeys()
}

const resetSelectedRowKeys = () => {
  setSelectedRowKeys([])
}

const handleBatchKillPod = () => {
  message.info('kill pod!')
  setBatchEditing(false)
}

<div
ref={(current) => {
  divRef.current = current
  setDivSt(divRef.current)
}}
>
  <Button onClick={() => { setBatchEditing(true) }}>Batch-kill Resource</Button>
  <Table
    rowKey='key'
    columns={columns}
    dataSource={data}
    rowSelection={isBatchEditing && {
      selectedRowKeys,
      onChange: selectedRowKeys => setSelectedRowKeys(selectedRowKeys)
    }}
    pagination={false}
  />
  <BatchOperations
    title='Batch-Kill Resources'
    visible={isBatchEditing}
    parent={divRef && divRef.current}
    selectedCount={selectedRowKeys.length}
    disabled={!selectedRowKeys.length}
    onSubmit={handleBatchKillPod}
    onCancel={handleCancelBatchKill}
  />
</div>
```
