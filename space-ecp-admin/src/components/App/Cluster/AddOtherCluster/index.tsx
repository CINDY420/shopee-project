import { Form, message, Steps } from 'infrad'
import { useState } from 'react'
import AddToECPAdminForm from 'src/components/App/Cluster/AddOtherCluster/AddToECPAdminForm'
import AddToEksClusterForm, {
  IEKSForm,
} from 'src/components/App/Cluster/AddOtherCluster/AddToEKSClusterForm'
import Finish from 'src/components/App/Cluster/AddOtherCluster/Finish'
import { FormWrapper, Root, StyledSteps } from 'src/components/App/Cluster/AddOtherCluster/style'
import SubmitButtons from 'src/components/App/Cluster/AddOtherCluster/SubmitButtons'
import RouteLeavingConfirm from 'src/components/Common/RouteLeavingConfirm'
import { useHistory } from 'react-router'
import { STEP } from 'src/constants/cluster'
import { CLUSTER } from 'src/constants/routes/routes'
import { StyledPageHeader } from 'src/common-styles/layout'
import {
  clusterController_addCluster,
  clusterController_addToEKSCluster,
} from 'src/swagger-api/apis/Cluster'
import { IAddClusterBody, IAddToEKSClusterBody } from 'src/swagger-api/models'
import { parseProductValue } from 'src/components/App/Cluster/AddOtherCluster/ServiceNameCascader/helper'

const routeLeavingConfirmMap: Record<
  STEP,
  {
    title: string
    content: string
    okText: string
    cancelText: string
  }
> = {
  [STEP.ADD_TO_EKS_CLUSTER]: {
    title: 'Are you sure to leave?',
    content: 'The process will be cancelled.',
    okText: 'Confirm',
    cancelText: 'Cancel',
  },
  [STEP.ADD_TO_ECP_ADMIN]: {
    title: 'Are you sure to leave?',
    content:
      'Your cluster has been added to EKS cluster and the following process will be cancelled.',
    okText: 'Confirm',
    cancelText: 'Cancel',
  },
  [STEP.CONFIRM]: {
    title: 'Are you sure to leave?',
    content: 'The process will be cancelled.',
    okText: 'Confirm',
    cancelText: 'Cancel',
  },
}

const addToEKSCluster = async (formValue: IEKSForm) => {
  if (!formValue) return
  const { productId, productName } = parseProductValue(formValue.serviceName[1])

  const { azName: azv2, azKey: azv2Key } = JSON.parse(formValue.azv2)
  const { segmentKey, segmentName: segment } = JSON.parse(formValue.segment)

  const payload: IAddToEKSClusterBody = {
    serviceName: productName!,
    serviceId: parseInt(productId!),
    displayName: formValue.displayName,
    azv2,
    azv2Key,
    segment,
    segmentKey,
    etcdConfig: {
      etcdIPs: formValue.etcdIPs,
      sslCA: formValue.sslCA,
      sslCertificate: formValue.sslCertificate,
      sslKey: formValue.sslKey,
    },
    labels: formValue.labels,
    description: formValue.description,
    kubeConfig: formValue.kubeConfig,
    env: formValue.env,
    uuid: formValue.uuid,
    deployedGalio: formValue.deployedGalio,
    monitoringName: formValue.monitoringName,
  }
  const id = await clusterController_addToEKSCluster({ payload })
  return id
}

const AddOtherCluster: React.FC = () => {
  const history = useHistory()
  const handleClose = () => history.push(CLUSTER)
  const [currentStep, setCurrentStep] = useState(STEP.ADD_TO_EKS_CLUSTER)
  const [eksForm] = Form.useForm<IEKSForm>()
  const [ecpAdminForm] = Form.useForm<IAddClusterBody>()

  const [eksClusterId, setEKSClusterId] = useState<string>()

  const stepComponentMap: Record<
    STEP,
    {
      title: string
      content?: React.ReactElement<unknown>
    }
  > = {
    [STEP.ADD_TO_EKS_CLUSTER]: {
      title: 'Add to EKS Cluster',
      content: <AddToEksClusterForm form={eksForm} />,
    },
    [STEP.ADD_TO_ECP_ADMIN]: {
      title: 'Add to ECP Admin',
      content: <AddToECPAdminForm form={ecpAdminForm} />,
    },
    [STEP.CONFIRM]: {
      title: 'Confirm',
    },
  }

  const handleNextStep = async () => {
    if (currentStep === STEP.ADD_TO_EKS_CLUSTER) {
      const currentFormValue = await eksForm?.validateFields()
      await addToEKSCluster(currentFormValue)
      setEKSClusterId(currentFormValue.uuid)
    }
    void message.success('Submit successfully!')
    setCurrentStep((step) => step + 1)
  }

  const handleSubmit = async () => {
    if (currentStep === STEP.ADD_TO_ECP_ADMIN) {
      const currentFormValue = await ecpAdminForm?.validateFields()
      await clusterController_addCluster({
        payload: {
          ...currentFormValue,
          clusterId: eksClusterId || '',
        },
      })
    }
    void message.success('Submit successfully!')
    setCurrentStep((step) => step + 1)
  }

  return (
    <>
      <StyledPageHeader title="Add Other Cluster" onBack={handleClose} />
      <Root>
        <RouteLeavingConfirm {...routeLeavingConfirmMap[currentStep]} />
        <StyledSteps current={currentStep}>
          {Object.values(stepComponentMap).map(({ title }) => (
            <Steps.Step key={title} title={title} />
          ))}
        </StyledSteps>
        {currentStep !== STEP.CONFIRM ? (
          <>
            <FormWrapper>{stepComponentMap[currentStep].content}</FormWrapper>
            <SubmitButtons
              isSubmitStep={currentStep === STEP.ADD_TO_ECP_ADMIN}
              onNext={handleNextStep}
              onCancel={handleClose}
              onSubmit={handleSubmit}
            />
          </>
        ) : (
          <Finish onConfirm={handleClose} />
        )}
      </Root>
    </>
  )
}

export default AddOtherCluster
