import React from 'react'
import {
  StyledForm,
  StyledRoot,
  StyledStep,
  StyledSteps,
} from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/CreateJob/Content/style'
import { useForm } from 'infrad/lib/form/Form'
import BasicsStepContent from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/CreateJob/Content/Basics'
import WorkflowStepContent from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/CreateJob/Content/Workflow'
import PreviewStepContent from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/CreateJob/Content/Preview'
import { useNavigate, useParams } from 'react-router'
import { BASIC_INFORMATION } from 'constants/job'
import { IOpenApiCreateJobBody } from 'swagger-api/models'

import { message } from 'infrad'
import Footer from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Footer'
import { jobControllerCreateJob } from 'swagger-api/apis/Job'
import { generateOvertime, generateSubmitTask, hasContainer } from 'helpers/job'

const WRAPPER_COL = { span: 14 }
const LABEL_COL = { span: 5 }
const STEPS = [
  {
    title: 'Basics',
    Component: BasicsStepContent,
  },
  {
    title: 'Workflow',
    Component: WorkflowStepContent,
  },
  {
    title: 'Preview',
    Component: PreviewStepContent,
  },
]

const CreateJobContent = () => {
  const params = useParams()
  const { tenantId, projectId, jobId } = params
  const navigate = useNavigate()
  const [form] = useForm()
  const [currentStep, setCurrentStep] = React.useState(0)

  const handleCancel = () => {
    navigate(-1)
  }
  const handleSubmit = async () => {
    if (tenantId && projectId) {
      const value = form.getFieldsValue(true)
      const {
        runningOvertime,
        runningOvertimeUnit,
        pendingOvertime,
        pendingOvertimeUnit,
        tasks,
        ...rest
      } = value

      const payload: IOpenApiCreateJobBody = {
        ...rest,
        ...generateOvertime({
          runningOvertime,
          runningOvertimeUnit,
          pendingOvertime,
          pendingOvertimeUnit,
        }),
        tasks: generateSubmitTask(tasks),
      }
      try {
        await jobControllerCreateJob({ tenantId, projectId, payload })
        message.success('Create job successfully')
        handleCancel()
      } catch (error) {
        message.error(error?.message)
      }
    }
  }

  const handleStepChange = async (step: number) => {
    if (currentStep < step) {
      if (currentStep === 0) {
        const namePathLists = BASIC_INFORMATION.map((item) => item.formNamePath)
        await form.validateFields(namePathLists)
      }
      if (currentStep === 1) {
        const formValues = await form.validateFields()
        const tasks = formValues?.jobTemplate?.tasks ?? []
        if (!hasContainer(tasks)) {
          return false
        }
      }
    }
    setCurrentStep(step)
  }

  const renderStepContent = (form, Component) => <Component form={form} isEdit={!!jobId} />

  return (
    <StyledRoot>
      <StyledSteps current={currentStep}>
        {STEPS.map((item) => (
          <StyledStep key={item.title} title={item.title} />
        ))}
      </StyledSteps>
      <StyledForm
        name="createPeriodicJob"
        form={form}
        labelCol={LABEL_COL}
        wrapperCol={WRAPPER_COL}
      >
        {renderStepContent(form, STEPS[currentStep].Component)}
      </StyledForm>
      <Footer
        stepsLength={STEPS.length}
        currentStep={currentStep}
        setCurrentStep={handleStepChange}
        onCancel={handleCancel}
        onOk={handleSubmit}
      />
    </StyledRoot>
  )
}

export default CreateJobContent
