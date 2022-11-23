import React from 'react'
import { STEP } from 'src/components/App/Cluster/CreateCluster/constant'
import { Root } from 'src/components/App/Cluster/CreateCluster/SubmitButtons/style'
import { Button, Space } from 'infrad'

interface ISubmitBButtonsProps {
  currentStep: STEP
  disableSubmit: boolean
  onBack: () => void
  onNext: () => void | Promise<void>
  onSubmit: () => void | Promise<void>
}

const SubmitButtons: React.FC<ISubmitBButtonsProps> = ({
  currentStep,
  disableSubmit,
  onBack,
  onNext,
  onSubmit,
}) => {
  const isSubmitStep = currentStep === STEP.CONFIRM
  const isServerStep = currentStep === STEP.SERVER
  return (
    <Root>
      <Space size={8}>
        {!isServerStep && (
          <Button style={{ width: 240 }} onClick={onBack}>
            Back
          </Button>
        )}
        <Button
          style={{ width: isServerStep ? 488 : 240 }}
          type="primary"
          onClick={isSubmitStep ? onSubmit : onNext}
          disabled={isSubmitStep && disableSubmit}
        >
          {isSubmitStep ? 'Submit' : 'Next'}
        </Button>
      </Space>
    </Root>
  )
}

export default SubmitButtons
