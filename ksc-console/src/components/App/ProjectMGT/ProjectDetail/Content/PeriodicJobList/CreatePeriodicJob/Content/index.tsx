import React from 'react'
import {
  StyledForm,
  StyledRoot,
  StyledStep,
  StyledSteps,
} from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/style'
import Footer from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Footer'
import { useForm } from 'infrad/lib/form/Form'
import BasicsStepContent from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Basics'
import WorkflowStepContent from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Workflow'
import PreviewStepContent from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Preview'
import { useNavigate, useParams } from 'react-router'
import { BASIC_INFORMATION } from 'constants/periodicJob'
import { IOpenApiCreatePeriodicJobBody, IPeriodicJobTemplateTask } from 'swagger-api/models'
import {
  periodicJobControllerCreatePeriodicJob,
  periodicJobControllerGetPeriodicJob,
  periodicJobControllerUpdatePeriodicJob,
} from 'swagger-api/apis/PeriodicJob'
import { message } from 'infrad'
import { removeUnitOfMemory } from 'helpers/format'
import { generateOvertime, generateSubmitTask, hasContainer, ITasks } from 'helpers/job'

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

const generateEditTask = (tasks: IPeriodicJobTemplateTask[]): ITasks[] =>
  tasks.map((task) => {
    const { containers = [], initContainers = [], ...restTask } = task
    const formatInitContainers = initContainers.map((container) => ({
      ...container,
      isInitContainer: true,
    }))
    return {
      ...restTask,
      containers: containers.concat(formatInitContainers).map((container) => {
        const { env = {}, resource, command, ...restContainer } = container
        const { requests } = resource
        return {
          isInitContainer: false,
          ...restContainer,
          command: command.join(','),
          env: Object.entries(env)
            .map((entry) => entry.join(':'))
            .join(';'),
          resource: {
            requests: {
              ...requests,
              memory: removeUnitOfMemory(requests?.memory || '0'),
            },
          },
        }
      }),
    }
  })

const CreatePeriodicJobContent = () => {
  const params = useParams()
  const { tenantId, projectId, periodicJobId } = params
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
        jobTemplate,
        runningOvertime,
        runningOvertimeUnit,
        pendingOvertime,
        pendingOvertimeUnit,
        ...rest
      } = value
      const { tasks, ...jobTemplateRest } = jobTemplate

      const payload: IOpenApiCreatePeriodicJobBody = {
        ...rest,
        ...generateOvertime({
          runningOvertime,
          runningOvertimeUnit,
          pendingOvertime,
          pendingOvertimeUnit,
        }),
        jobTemplate: {
          ...jobTemplateRest,
          tasks: generateSubmitTask(tasks),
        },
      }
      try {
        if (periodicJobId) {
          await periodicJobControllerUpdatePeriodicJob({
            tenantId,
            projectId,
            periodicJobId,
            payload,
          })
          message.success('Edit periodic job successfully')
        } else {
          await periodicJobControllerCreatePeriodicJob({ tenantId, projectId, payload })
          message.success('Create periodic job successfully')
        }
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

  const getPeriodicJobDetail = React.useCallback(async () => {
    if (tenantId && projectId && periodicJobId) {
      const details = await periodicJobControllerGetPeriodicJob({
        tenantId,
        projectId,
        periodicJobId,
      })
      const { jobTemplate, ...restDetails } = details
      const { tasks, ...restJobTemplate } = jobTemplate
      form.setFieldsValue({
        ...restDetails,
        jobTemplate: { ...restJobTemplate, tasks: generateEditTask(tasks) },
      })
    }
  }, [tenantId, projectId, periodicJobId])

  React.useEffect(() => {
    getPeriodicJobDetail()
  }, [])

  const renderStepContent = (form, Component) => <Component form={form} isEdit={!!periodicJobId} />

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

export default CreatePeriodicJobContent
