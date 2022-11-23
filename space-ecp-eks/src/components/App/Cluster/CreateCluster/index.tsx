import React, { useState } from 'react'
import { StyledPageHeader } from 'src/common-styles/layout'
import { useHistory } from 'react-router'
import { CLUSTER, buildProvisioningHistoryRoute } from 'src/constants/routes/routes'
import { Steps, Form, FormInstance, message } from 'infrad'
import { FormProps } from 'infrad/lib/form'

import {
  Root,
  ContentWrapper,
  StepWrapper,
  FormWrapper,
} from 'src/components/App/Cluster/CreateCluster/style'
import {
  STEP,
  FORM_WRAPPER_ID,
  IServerForm,
  IBasicInfoForm,
} from 'src/components/App/Cluster/CreateCluster/constant'
import SubmitButtons from 'src/components/App/Cluster/CreateCluster/SubmitButtons'
import ServerForm from 'src/components/App/Cluster/CreateCluster/ServerForm'
import BasicInfoForm from 'src/components/App/Cluster/CreateCluster/BasicInfoForm'
import Confirm from 'src/components/App/Cluster/CreateCluster/Confirm'
import { eksClusterController_createEKSCluster } from 'src/swagger-api/apis/EksCluster'
import { eksEnumsController_getTemplateDetail } from 'src/swagger-api/apis/EksEnums'

import {
  formatFormValue,
  parseExtraArg,
  parseIPCidr,
  buildNameIdValue,
} from 'src/components/App/Cluster/CreateCluster/helper'
import { HTTPError } from '@space/common-http'
import RouteLeavingConfirm from 'src/components/Common/RouteLeavingConfirm'
import { IEKSClusterETCD } from 'src/swagger-api/models'

const SYNCHRONOUS_FORM_VALUES = ['authority', 'certification', 'key']

const CreateCluster: React.FC = () => {
  const history = useHistory()
  const handleClose = () => history.push(CLUSTER)

  const [currentStep, setCurrentStep] = useState(STEP.SERVER)
  const [confirmValue, setConfirmValue] = useState<IServerForm & IBasicInfoForm>()
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [confirmElementEnabled, setConfirmElementEnabled] = useState(true)

  const [serverForm] = Form.useForm<IServerForm>()
  const [clusterBasicInfoForm] = Form.useForm<IBasicInfoForm>()
  const handleServerValuesChange = async (changedValues: IServerForm & IBasicInfoForm) => {
    // Set default service name if template is chosen
    const selectedTemplateId = changedValues?.resourceInfo?.templateId
    if (selectedTemplateId) {
      const templateResponse = await eksEnumsController_getTemplateDetail({
        templateId: String(selectedTemplateId),
      })
      const { clusterNetwork, advance, clusterSpec, ...others } = templateResponse || {}
      const {
        controllerManagementExtraArgs = [],
        apiServerExtraArgs = [],
        schedulerExtraArgs = [],
        eventEtcd,
        ...otherAdvance
      } = advance || {}
      const serviceCidr = clusterNetwork.servicesCidrBlocks
      const podCidr = clusterNetwork.podCidrBlocks
      const nodeMask = clusterNetwork.nodeMask
      const serviceCidrBlock = parseIPCidr(serviceCidr)
      const podCidrBlock = parseIPCidr(podCidr)
      const { platformId, platformName, ...otherClusterSpec } = clusterSpec
      const templateValue = {
        clusterNetwork: {
          serviceCidrBlock,
          podCidrBlock,
          nodeMask,
        },
        clusterSpec: { ...otherClusterSpec, platform: buildNameIdValue(platformName, platformId) },
        advance: {
          apiServerExtraArgs: apiServerExtraArgs?.map((arg) => parseExtraArg(arg)),
          controllerManagementExtraArgs: controllerManagementExtraArgs?.map((arg) =>
            parseExtraArg(arg),
          ),
          schedulerExtraArgs: schedulerExtraArgs?.map((arg) => parseExtraArg(arg)),
          eventEtcd,
          ...otherAdvance,
        },
        ...others,
      }
      setConfirmValue((currentValue) => ({ ...currentValue, ...templateValue }))
    }
  }

  const handleBasicInfoValuesChange: FormProps['onValuesChange'] = (changedValues) => {
    // sync etcd values to event etcd
    if (changedValues?.etcd) {
      SYNCHRONOUS_FORM_VALUES.forEach((changedKey: keyof IEKSClusterETCD) => {
        const changedValue = changedValues.etcd[changedKey]
        changedValue &&
          clusterBasicInfoForm.setFieldsValue({
            advance: { eventEtcd: { [changedKey]: changedValue } },
          })
      })
    }
    // validate cluster network value
    if (changedValues?.clusterNetwork) {
      clusterBasicInfoForm.validateFields()
    }
  }

  const stepComponentMap: Record<
    STEP,
    {
      title: string
      content: React.ReactElement<unknown>
      form?: FormInstance<IServerForm | IBasicInfoForm>
    }
  > = {
    [STEP.SERVER]: {
      title: 'Server',
      content: <ServerForm form={serverForm} onValuesChange={handleServerValuesChange} />,
      form: serverForm,
    },
    [STEP.CLUSTER_BASIC_INFO]: {
      title: 'Cluster Basic Info',
      content: (
        <BasicInfoForm
          form={clusterBasicInfoForm}
          initialValues={confirmValue}
          onValuesChange={handleBasicInfoValuesChange}
        />
      ),
      form: clusterBasicInfoForm,
    },
    [STEP.CONFIRM]: {
      title: 'Confirm',
      content: <Confirm previewValue={confirmValue} />,
    },
  }

  const handleNextStep = async () => {
    const currentForm = stepComponentMap[currentStep]?.form
    if (currentForm) {
      const currentFormValue = await currentForm.validateFields()
      setConfirmValue((currentValue) => ({ ...currentValue, ...currentFormValue }))
    }
    setCurrentStep(currentStep + 1)
    if (currentStep + 1 === STEP.CONFIRM) {
      setConfirmElementEnabled(false)
    }
  }
  const handleBackStep = () => setCurrentStep(currentStep - 1)
  const handleSubmit = async () => {
    const formattedValue = formatFormValue(confirmValue)
    try {
      setSubmitDisabled(true)
      const response = await eksClusterController_createEKSCluster({
        payload: formattedValue,
      })
      void message.success('Submit successfully!')
      const { id: clusterId } = response || {}
      const provisioningHistoryRoute = buildProvisioningHistoryRoute(clusterId)
      history.push(provisioningHistoryRoute)
    } catch (err) {
      if (err instanceof HTTPError) {
        void message.error(err.message)
      } else {
        console.error(err?.stack)
      }
    }
    setSubmitDisabled(false)
  }

  return (
    <Root>
      <RouteLeavingConfirm
        when={confirmElementEnabled}
        title="Notification"
        content="Your configuration will be cleared, are you sure to exit?"
        okText="Confirm"
        cancelText="Cancel"
      />
      <StyledPageHeader
        style={{ boxShadow: '8px 2px 8px rgba(0, 0, 0, 0.15)' }}
        title="Create Cluster"
        onBack={handleClose}
      />
      <ContentWrapper>
        <StepWrapper>
          <Steps current={currentStep}>
            {Object.values(stepComponentMap).map(({ title }) => (
              <Steps.Step key={title} title={title} />
            ))}
          </Steps>
        </StepWrapper>
        <FormWrapper id={FORM_WRAPPER_ID}>{stepComponentMap[currentStep]?.content}</FormWrapper>
      </ContentWrapper>
      <SubmitButtons
        currentStep={currentStep}
        disableSubmit={submitDisabled}
        onNext={handleNextStep}
        onBack={handleBackStep}
        onSubmit={handleSubmit}
      />
    </Root>
  )
}

export default CreateCluster
