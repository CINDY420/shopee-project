import { Button } from 'infrad'
import { StyledRoot } from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Footer/style'

interface IFooterProps {
  stepsLength: number
  currentStep: number
  setCurrentStep: (step: number) => void
  onCancel: () => void
  onOk: () => void
}
const Footer: React.FC<IFooterProps> = ({
  stepsLength,
  currentStep,
  setCurrentStep,
  onCancel,
  onOk,
}) => {
  const handleNext = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleCancel = () => {
    onCancel()
  }
  const handleSubmit = () => {
    onOk()
  }
  return (
    <StyledRoot>
      <div>{currentStep > 0 && <Button onClick={handlePrev}>Previous</Button>}</div>
      <div>
        <Button style={{ marginRight: '16px' }} onClick={handleCancel}>
          Cancel
        </Button>
        {currentStep < stepsLength - 1 && (
          <Button type="primary" onClick={handleNext}>
            Next Step
          </Button>
        )}
        {currentStep === stepsLength - 1 && (
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </StyledRoot>
  )
}

export default Footer
