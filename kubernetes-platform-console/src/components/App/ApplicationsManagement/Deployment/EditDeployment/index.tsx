import * as React from 'react'
import { message, Form, Alert } from 'infrad'

import { deploymentsControllerUpdateDeployLimit } from 'swagger-api/v3/apis/Deployments'
import useAsyncFn from 'hooks/useAsyncFn'
import { IPhase } from 'swagger-api/v3/models'

import CrudDrawer from 'components/Common/CrudDrawer'
import DeploymentForm from './DeploymentForm'
import { flavorControllerGetClusterFlavors } from 'swagger-api/v3/apis/Flavor'
import { IClusterFlavor } from 'api/types/cluster/cluster'
import { FLAVOR_OPTION } from 'constants/deployment'
import DeployConfigNotice from 'components/App/ApplicationsManagement/Common/DeployConfigNotice'
import GotItModal from 'components/Common/GotItModal'
import { deployConfigControllerGetDeployConfig } from 'swagger-api/v3/apis/DeployConfig'
import { IInformationFilled } from 'infra-design-icons'
import { FTE_CONTAINER_NAME } from 'constants/application'

interface IProps {
  visible: boolean
  onRefresh?: () => void
  onCancel: () => void
  deployment: IDeployment
  clusterName: string
  clusters: string[]
}

interface IDeployment {
  tenantId: number
  projectName: string
  appName: string
  appInstanceName: string
  [key: string]: any
}

interface IContainerDetail {
  name: string
  cpuLimit: number
  memLimit: number
}
interface IFormPhaseResource {
  flavorOption: FLAVOR_OPTION
  flavor: string
  container: string
  cpuLimit: number
  memLimit: number
}
interface IFormPhase {
  phase: string
  resource: IFormPhaseResource[]
}

interface IFormDetail {
  phases: IFormPhase[]
}

type TransformContainerDetailsToFormDetailFn = (containerDetails: Record<string, IContainerDetail[]>) => IFormDetail

const transformContainerDetailsToFormDetail: TransformContainerDetailsToFormDetailFn = containerDetails => {
  const phaseContainerList = Object.entries(containerDetails)
  const phases = phaseContainerList.map(([phaseName, containerDetailList]) => {
    const resource = containerDetailList.map(({ name, cpuLimit, memLimit }) => ({
      flavorOption: FLAVOR_OPTION.DEFAULT_CONFIGURATION,
      flavor: name === FTE_CONTAINER_NAME ? 'No-Limit Cores/No-Limit GiB' : `${cpuLimit} Cores/${memLimit} GiB`,
      container: name,
      cpuLimit,
      memLimit
    }))
    return {
      phase: phaseName,
      resource
    }
  })
  return { phases }
}

const parseFlavor = (flavor: string) => {
  const flavorItems = flavor.split('/')
  const [cpuItem, memItem] = flavorItems
  const cpuStrings = cpuItem.split(' Cores')
  const memStrings = memItem.split(' GiB')

  const cpuLimit = Number(cpuStrings[0])
  const memLimit = Number(memStrings[0])
  return { cpuLimit, memLimit }
}

const transformPhasesFlavorToLimit = (phases: IFormPhase[]) => {
  const transformedPhases = phases.map(({ resource, ...others }) => {
    const transformedResource = resource.map(({ cpuLimit, memLimit, flavor, flavorOption, ...others }) => {
      let transformedCpuLimit = Number(cpuLimit)
      let transformedMemLimit = Number(memLimit)

      if (flavorOption === FLAVOR_OPTION.DEFAULT_CONFIGURATION) {
        const { cpuLimit, memLimit } = parseFlavor(flavor)
        transformedCpuLimit = cpuLimit
        transformedMemLimit = memLimit
      }

      return { ...others, cpuLimit: transformedCpuLimit, memLimit: transformedMemLimit }
    })
    return { ...others, resource: transformedResource }
  })
  return transformedPhases
}

const transformFormFlavorsToString = (formValues: IFormDetail): string[] => {
  const { phases } = formValues
  const flavors = []
  phases.forEach(({ phase, resource }) => {
    resource.forEach(({ container, cpuLimit, memLimit, flavor, flavorOption }) => {
      let transformedCpuLimit = Number(cpuLimit)
      let transformedMemLimit = Number(memLimit)

      if (flavorOption === FLAVOR_OPTION.DEFAULT_CONFIGURATION) {
        const { cpuLimit, memLimit } = parseFlavor(flavor)
        transformedCpuLimit = cpuLimit
        transformedMemLimit = memLimit
      }
      const flavorString = `${phase}-${container}-${transformedCpuLimit}-${transformedMemLimit}`
      flavors.push(flavorString)
    })
  })

  return flavors
}

const hasFormFlavorsChange = (initialValues: IFormDetail, changedValues: IFormDetail): boolean => {
  const preFlavors = transformFormFlavorsToString(initialValues)
  const curFlavors = transformFormFlavorsToString(changedValues)
  for (let i = 0; i < preFlavors.length; i++) {
    const flavor = preFlavors[i]
    if (!curFlavors.includes(flavor)) {
      return true
    }
  }
  return false
}

const DeploymentCrudDrawer: React.FC<IProps> = ({
  onRefresh,
  visible,
  onCancel,
  deployment,
  clusterName,
  clusters
}) => {
  const formRef = React.createRef<any>()
  const [, updateDeployFn] = useAsyncFn(deploymentsControllerUpdateDeployLimit)
  const [disabled, setDisabled] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)
  const [deployConfigEnable, setDeployConfigEnable] = React.useState(false)
  const [flavors, setFlavors] = React.useState<IClusterFlavor[]>([])
  const handleFetchFlavors = React.useCallback(async () => {
    const res = await flavorControllerGetClusterFlavors({ clusterName })
    const { flavors = [] } = res || {}
    setFlavors(flavors)
  }, [clusterName])

  const flavorOptions = flavors.map(flavor => {
    const { cpu, memory } = flavor || {}
    return {
      key: `${cpu} Cores / ${memory} GiB`,
      ...flavor
    }
  })

  React.useEffect(() => {
    handleFetchFlavors()
  }, [handleFetchFlavors])

  const [form] = Form.useForm()

  const { containerDetails } = deployment
  const formInitialValues = transformContainerDetailsToFormDetail(containerDetails)
  const handleSubmit = async () => {
    const { tenantId, projectName, appName, appInstanceName } = deployment
    setIsLoading(true)

    try {
      const values = await form.validateFields()
      const { phases } = values
      const phasesAfterFilter = phases.map((phase: IPhase, index: number) => {
        return {
          phase: phase.phase,
          resource: phase.resource.filter(item => {
            return item.container !== FTE_CONTAINER_NAME
          })
        }
      })

      const transformedValues = transformPhasesFlavorToLimit(phasesAfterFilter)

      await updateDeployFn({
        tenantId,
        projectName,
        appName,
        deployName: values.deployName,
        clusterName: values.clusterName,
        payload: {
          phases: transformedValues as IPhase[],
          appInstanceName
        }
      })

      message.success('success')
      onRefresh && onRefresh()
      onCancel()
    } catch (err) {
      console.error('error: ', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldsChange = () => {
    const values = form.getFieldsValue()
    const hasInputChanged = hasFormFlavorsChange(formInitialValues, values as IFormDetail)
    setDisabled(!hasInputChanged)
  }

  const [modalVisible, setModalVisible] = React.useState<boolean>()

  const handleOk = () => {
    handleSubmit()
    setModalVisible(false)
  }

  const getDeployConfigData = React.useCallback(async () => {
    const { tenantId, projectName, appName, info } = deployment
    const { data } =
      (await deployConfigControllerGetDeployConfig({
        tenantId,
        projectName,
        appName,
        env: info.env
      })) || {}
    setDeployConfigEnable(data.enable)
  }, [deployment])

  React.useEffect(() => {
    getDeployConfigData()
  }, [getDeployConfigData])

  const Title = (
    <>
      <div style={{ marginBottom: 8 }}>Edit Resource</div>
      {deployConfigEnable && (
        <Alert
          showIcon={true}
          icon={<IInformationFilled />}
          type='info'
          message={
            <DeployConfigNotice
              deployConfigEnable={false}
              notice='This operation cannot be canceled!'
              // notice='Once-through operation only! If you want to modify the pod flavor permanently, please modify the config at '
            />
          }
        />
      )}
    </>
  )

  return (
    <>
      <CrudDrawer
        title={Title}
        visible={visible}
        onCancel={onCancel}
        onSubmit={() => setModalVisible(true)}
        body={
          <>
            <DeploymentForm
              ref={formRef}
              deploymentDetail={deployment}
              clusterName={clusterName}
              clusters={clusters}
              form={form}
              initialValues={formInitialValues}
              onFieldsChange={handleFieldsChange}
              flavorOptions={flavorOptions.map(item => item.key)}
            />
          </>
        }
        closeDrawer={onCancel}
        isSubmitDisabled={disabled}
        isLoading={isLoading}
      />
      <GotItModal
        visible={modalVisible}
        title='Notice'
        okText='Confirm'
        cancelText='Cancel'
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        getContainer={() => document.body}
        deployConfigEnable={deployConfigEnable}
      >
        <DeployConfigNotice
          deployConfigEnable={false}
          notice='This operation will be applied at once!'
          // notice={
          //   deployConfigEnable
          //     ? 'Once-through operation only! If you want to modify the pod flavor permanently, please modify the config at '
          //     : 'This operation will be applied at once!'
          // }
        />
      </GotItModal>
    </>
  )
}

export default DeploymentCrudDrawer
