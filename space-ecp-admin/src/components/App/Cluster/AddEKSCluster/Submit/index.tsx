import React from 'react'
import { Root } from 'src/components/App/Cluster/AddEKSCluster/Submit/style'
import { Button, Space } from 'infrad'

interface ISubmitProps {
  onCancel: () => void
  onSubmit: () => void
  disableSubmit?: boolean
}

const Submit: React.FC<ISubmitProps> = ({ onCancel, onSubmit, disableSubmit }) => (
  <Root>
    <Space size={8}>
      <Button style={{ width: 240, height: 40 }} onClick={onCancel}>
        Cancel
      </Button>
      <Button
        style={{ width: 240, height: 40 }}
        type="primary"
        onClick={onSubmit}
        disabled={disableSubmit}
      >
        Submit
      </Button>
    </Space>
  </Root>
)

export default Submit
