import React from 'react'
import { Modal, Steps, Form, message } from 'infrad'
import {
  StepsContent,
  StepsAction,
  StyledButton
} from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/CopyRuleModal/style'
import HpaRulesEdit from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/CopyRuleModal/HpaRulesEdit'
import Preview from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/CopyRuleModal/Preview'
import { HorizontalDivider } from 'common-styles/divider'
import DeploymentSelector from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/CopyRuleModal/DeploymentSelector'
import {
  IHpaSpec,
  IHPAWithId,
  IGetApplicationResponse,
  IAzSdu,
  ISduItem,
  IHpaMeta,
  IDeploymentHpa,
  IHpaSpecScaleDirection,
  IHpaThreshold
} from 'swagger-api/v1/models'
import { useRecoilValue } from 'recoil'
import { selectedApplication } from 'states/applicationState/application'
import { sduControllerListAllAzSdus } from 'swagger-api/v1/apis/SDU'
import { hpaControllerBatchCopyHpa } from 'swagger-api/v1/apis/Hpa'
import { IHpaRulesWithSelected } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/RuleCrudDrawer/CreateEditRuleForm/interface'
import { extractCronRulesFromForm } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/helper/cronRules'

const { Step } = Steps
interface ICopyRuleFormProps {
  visible: boolean
  initialValues: IHPAWithId
  onClose: () => void
  onSuccess: () => void
}

enum STEP_LEVEL {
  SELECT_DEPLOYMENT = 0,
  EDIT_HPA_RULE = 1,
  PREVIEW = 2
}

export interface ICopyRuleFormValues {
  notifyChannels: string[]
  rules: IHpaRulesWithSelected
  scaleDirection: IHpaSpecScaleDirection
  autoscalingLogic: 'or' | 'and'
  threshold: IHpaThreshold
  status: boolean
}

export const formatCascaderDataToAzSdus = (allAzSdus: IAzSdu[], formDeploymentValues: string[][]): IAzSdu[] => {
  /**
   * the form deployment fields value is like: [['sg'],['sg', 'zhuye-demo-test-sg'],['sg', 'zhuye-demo-live-sg']]
   * when select all deployments of an az, the cascader only save the first level data, is like ['sg']
   * when select some deployments of an az, the cascader save the first level  data, is like ['sg', 'zhuye-demo-test-sg'],['sg', 'zhuye-demo-live-sg']
   * convert the formDeploymentValues to IAzSdu type
   */

  const selectedAzs = formDeploymentValues.filter(deployment => {
    return deployment.length === 1
  })
  const selectedSdusOfAzs = selectedAzs.flatMap(selectedAz => {
    const azSdus = allAzSdus.filter(azSdus => {
      return azSdus.azName === selectedAz[0] // selectedAz is like ['sg', 'zhuye-demo-test-sg'], the first item is azName
    })

    return azSdus
  })

  const selectedAzSdus = formDeploymentValues.filter(deployment => {
    return deployment.length === 2
  })

  const azSdusMaps: Record<string, ISduItem[]> = {}
  selectedAzSdus.forEach(azSdu => {
    const azName = azSdu[0] // azsdu is like ['sg', 'zhuye-demo-test-sg'], the first item is azName
    const formattedSdu = {
      hasHpa: true,
      sduName: azSdu[1] // azsdu is like ['sg', 'zhuye-demo-test-sg'], the second item is deploymentName(sduName)
    }
    if (!azSdusMaps[azName]) {
      azSdusMaps[azName] = [formattedSdu]
    } else {
      azSdusMaps[azName].push(formattedSdu)
    }
  })

  const formateSelectedAzDeployments = Object.entries(azSdusMaps).map(([azName, azSduList]) => ({
    azName,
    sdus: azSduList
  }))
  return [...selectedSdusOfAzs, ...formateSelectedAzDeployments]
}

const CopyRuleModal: React.FC<ICopyRuleFormProps> = ({
  visible,
  initialValues,
  onClose: handleCloseModal,
  onSuccess: handleSuccess
}) => {
  const [currentStep, setCurrentStep] = React.useState<STEP_LEVEL>(STEP_LEVEL.SELECT_DEPLOYMENT)
  const [allAzSdus, setAllAzSdus] = React.useState<IAzSdu[]>([])
  const [selectedAzSdus, setSelectedAzSdus] = React.useState<IAzSdu[]>([])
  const [deploymentsHpas, setDeploymentsHpas] = React.useState<IDeploymentHpa[]>([])
  const [currentEditSelectedDeployment, setCurrentEditSelectedDeployment] = React.useState<IHpaMeta>()

  const application: IGetApplicationResponse = useRecoilValue(selectedApplication)
  const { name: appName, tenantId, projectName } = application

  const { spec } = initialValues || {}
  const { updator, updatedTime } = spec || {}

  const listAllAzSdus = React.useCallback(async () => {
    const { items } = await sduControllerListAllAzSdus({ tenantId, projectName, appName })
    setAllAzSdus(items)
  }, [appName, projectName, tenantId])

  React.useEffect(() => {
    listAllAzSdus()
  }, [listAllAzSdus])

  const getAllSelectedDeploymentsHpas = (selectedAzSdus: IAzSdu[], spec: IHpaSpec): IDeploymentHpa[] => {
    const selectedDeploymentWithHpas: IDeploymentHpa[] = selectedAzSdus.flatMap(azSdu => {
      const { azName, sdus } = azSdu
      return sdus.map(sduItem => {
        return {
          meta: {
            az: azName,
            sdu: sduItem.sduName
          },
          spec
        }
      })
    })
    return selectedDeploymentWithHpas
  }

  const getCurrentEditSelectedDeployment = (azSdu: IHpaMeta) => {
    setCurrentEditSelectedDeployment(azSdu)
  }
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1)
    if (currentStep === STEP_LEVEL.SELECT_DEPLOYMENT) {
      const allDeploymentsHaps = getAllSelectedDeploymentsHpas(selectedAzSdus, spec)
      setDeploymentsHpas(allDeploymentsHaps)
    }
    if (currentStep === STEP_LEVEL.EDIT_HPA_RULE) {
      handleDeploymentHpaChange(currentEditSelectedDeployment)
    }
  }
  const [form] = Form.useForm()

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSelectDeploymentChange = () => {
    const formDeploymentValues = form.getFieldValue('deployment')
    const azSdus = formatCascaderDataToAzSdus(allAzSdus, formDeploymentValues)
    setSelectedAzSdus(azSdus)
  }

  const handleSelectAllDeployments = () => {
    const allAzs = allAzSdus.map(azSdus => {
      return [azSdus.azName]
    })
    form.setFieldsValue({ deployment: allAzs })
    setSelectedAzSdus(allAzSdus)
  }

  const handleClearCascader = () => {
    form.setFieldsValue({ deployment: [] })
    setSelectedAzSdus([])
  }

  const extractDeploymentHpaSpecFromForm = (formValues: ICopyRuleFormValues): IHpaSpec => {
    const { rules, scaleDirection, autoscalingLogic, threshold, status } = formValues
    const { autoscalingRules, cronRules: formCronRules = [] } = rules || {}
    const cronRules = extractCronRulesFromForm(formCronRules)

    const spec: IHpaSpec = {
      notifyChannels: initialValues.spec.notifyChannels,
      autoscalingLogic,
      rules: { autoscalingRules, cronRules },
      scaleDirection,
      threshold,
      status,
      updator,
      updatedTime
    }
    return spec
  }

  const handleDeploymentHpaChange = (currentSelectedDeployment: IHpaMeta) => {
    const allDeploymentsHpas = [...deploymentsHpas]

    const selectedDeploymentHpa = allDeploymentsHpas.find(item => {
      return item.meta.az === currentSelectedDeployment.az && item.meta.sdu === currentSelectedDeployment.sdu
    })
    const changedDeploymentHpaFormValues = form.getFieldsValue()
    selectedDeploymentHpa.spec = extractDeploymentHpaSpecFromForm(changedDeploymentHpaFormValues)
    setDeploymentsHpas(allDeploymentsHpas)
  }

  const handleSubmit = async () => {
    const payload = { deploymentsHpas }
    const requests = await hpaControllerBatchCopyHpa({
      tenantId,
      projectName,
      appName,
      payload
    })

    const isAllCopyRequestsSuccess = requests.every(request => request === null)

    if (isAllCopyRequestsSuccess) {
      message.success('Copy hpa rule successfully!')
    } else {
      const messageErrorContent = requests.map(request => {
        if (request) {
          return (
            <div
              style={{ textAlign: 'left' }}
              key={`${request.azSdu.az}|${request.azSdu.sdu}`}
            >{`${request.azSdu.az}|${request.azSdu.sdu} copy hpa rule failed: ${request.errorMessage}`}</div>
          )
        } else {
          return undefined
        }
      })
      message.error(messageErrorContent)
    }

    handleCloseModal()
    handleSuccess()
  }

  const steps = [
    {
      title: 'Select Deployments',
      content: (
        <DeploymentSelector
          form={form}
          allAzSdus={allAzSdus}
          selectedAzSdus={selectedAzSdus}
          onSelectDeploymentChange={handleSelectDeploymentChange}
          onSelectAll={handleSelectAllDeployments}
          onClearCascader={handleClearCascader}
        />
      )
    },
    {
      title: 'Edit HPA Rule ',
      content: (
        <HpaRulesEdit
          form={form}
          selectedAzSdus={selectedAzSdus}
          deploymentsHpas={deploymentsHpas}
          onDeploymentHpaRulesChange={handleDeploymentHpaChange}
          getCurrentEditSelectedDeployment={getCurrentEditSelectedDeployment}
        />
      )
    },
    {
      title: 'Preview',
      content: <Preview selectedAzSdus={selectedAzSdus} deploymentsHpas={deploymentsHpas} />
    }
  ]

  const isNotFirstStep = currentStep !== STEP_LEVEL.SELECT_DEPLOYMENT
  const isLastStep = currentStep === STEP_LEVEL.PREVIEW
  const isNotLastStep = currentStep !== STEP_LEVEL.PREVIEW

  return (
    <Modal
      title='Copy HPA Rule'
      visible={visible}
      getContainer={document.body}
      width={1024}
      destroyOnClose
      footer={
        <StepsAction>
          <StyledButton onClick={handleCloseModal}>Cancel</StyledButton>
          {isNotFirstStep && (
            <StyledButton style={{ margin: '0 8px' }} onClick={() => handlePrevStep()}>
              Return
            </StyledButton>
          )}
          {isNotLastStep && (
            <>
              <HorizontalDivider size='16px' />
              <StyledButton
                type='primary'
                onClick={() => handleNextStep()}
                disabled={currentStep === STEP_LEVEL.SELECT_DEPLOYMENT && selectedAzSdus.length < 1}
              >
                Next
              </StyledButton>
            </>
          )}
          {isLastStep && (
            <>
              <HorizontalDivider size='16px' />
              <StyledButton type='primary' onClick={handleSubmit}>
                Confirm
              </StyledButton>
            </>
          )}
        </StepsAction>
      }
      onCancel={handleCloseModal}
    >
      <Steps current={currentStep} style={{ marginLeft: '48px', marginRight: '48px', width: 'auto' }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <StepsContent>{steps[currentStep].content}</StepsContent>
    </Modal>
  )
}

export default CopyRuleModal
