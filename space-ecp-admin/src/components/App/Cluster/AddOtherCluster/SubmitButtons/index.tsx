import React from 'react'
import { Button, Space } from 'infrad'
import { Root } from 'src/components/App/Cluster/AddOtherCluster/SubmitButtons/style'

interface ISubmitBButtonsProps {
  isSubmitStep: boolean
  onCancel: () => void
  onNext: () => void | Promise<void>
  onSubmit: () => void | Promise<void>
}

const SubmitButtons: React.FC<ISubmitBButtonsProps> = ({
  isSubmitStep,
  onCancel,
  onNext,
  onSubmit,
}) => (
  <Root>
    <Space size={8}>
      <Button style={{ width: 240 }} onClick={onCancel}>
        Cancel
      </Button>
      <Button style={{ width: 240 }} type="primary" onClick={isSubmitStep ? onSubmit : onNext}>
        {isSubmitStep ? 'Submit' : 'Next'}
      </Button>
    </Space>
  </Root>
)

export default SubmitButtons
