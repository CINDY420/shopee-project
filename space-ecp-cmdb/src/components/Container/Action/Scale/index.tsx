import * as React from 'react'
import { Form, Input, message } from 'infrad'
import { fetch } from 'src/rapper'
import { IModels } from 'src/rapper/request'
import difference from 'src/helpers/difference'
import { pickBy, isEmpty, reduce } from 'lodash'
import StageModal, { Stage } from 'src/components/Common/StageModal'
import { useRequest } from 'ahooks'
import ScaleFormItem from 'src/components/Container/Action/Scale/Common/ScaleFormItem'
import { ChangedTag } from 'src/components/Container/Action/Scale/style'

type Sdu = IModels['GET/api/ecp-cmdb/services/{serviceName}/sdus']['Res']['items'][0]

interface IScaleProps {
  modalVisible: boolean
  onModalVisibleChange: (visible: boolean) => void
  sdu: Sdu
  onRefresh: () => void
}

type InstancesData = {
  instances: {
    releaseReplicas: number
    canaryReplicas?: number
    canaryValid?: boolean
  }
  meta: {
    componentType: string
    az: string
  }
}

export type DiffData = Record<string, InstancesData>

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
}

export type SDUInstancesData = {
  [key: string]: InstancesData
}

const Scale: React.FC<IScaleProps> = (props) => {
  const { modalVisible, onModalVisibleChange, sdu, onRefresh } = props
  const { sdu: sduName, identifier, env } = sdu || {}
  const [form] = Form.useForm()
  const [stage, setStage] = React.useState<Stage>(Stage.EDIT)
  const [originalInstancesData, setOriginalInstancesData] = React.useState<SDUInstancesData>()
  const [editedInstancesData, setEditedInstancesData] = React.useState<SDUInstancesData>()
  const [hpaAZs, setHpaAZs] = React.useState<string[]>([])
  const [enabledAutoScale, setEnabledAutoScale] = React.useState(false)
  const [disabledScaleClusters, setDisabledScaleClusters] = React.useState<string[]>([])
  const [diffData, setDiffData] = React.useState<DiffData>()

  const {
    data: deployments,
    loading: getDeploymentsLoading,
    mutate: setDeployments,
  } = useRequest(
    async () => {
      if (modalVisible) {
        const { items } = await fetch['GET/api/ecp-cmdb/sdus/{sduName}/deploys']({
          sduName,
          withDetail: true,
        })
        const originalInstancesData = items.reduce((instancesData: SDUInstancesData, item) => {
          const {
            deployId,
            azV1,
            componentType,
            summary: { releaseInstances, canaryInstances },
          } = item
          const data = {
            instances: {
              releaseReplicas: releaseInstances,
              canaryReplicas: canaryInstances,
            },
            meta: {
              componentType,
              az: azV1,
            },
          }

          instancesData[deployId] = data
          return instancesData
        }, {})
        setOriginalInstancesData(originalInstancesData)
        setEditedInstancesData(originalInstancesData)
        form.setFieldsValue({
          ...originalInstancesData,
        })

        return items
      }
    },
    {
      refreshDeps: [sduName, modalVisible, form],
    },
  )

  const getHpaAZs = React.useCallback(async () => {
    const { azs } = await fetch['GET/api/ecp-cmdb/sdus/{sduName}/hpa:enabledAZs']({ sduName })
    setHpaAZs(azs)
  }, [sduName])

  const getEnabledAutoScale = React.useCallback(async () => {
    const { project, module } = identifier
    if (!project || !module) return
    if (env !== 'live' && env !== 'liveish') return
    const { enabledAutoScale } = await fetch['GET/api/ecp-cmdb/sdus/{sduName}/autoScale:enabled']({
      sduName,
      project,
      module,
    })
    setEnabledAutoScale(enabledAutoScale)
  }, [identifier, sduName])

  const getDisabledScaleClusters = React.useCallback(async () => {
    const { clusters } = await fetch['GET/api/ecp-cmdb/cluster:disabledScaleClusters']()
    setDisabledScaleClusters(clusters)
  }, [])

  React.useEffect(() => {
    if (modalVisible) {
      getHpaAZs()
      getEnabledAutoScale()
      getDisabledScaleClusters()
    }
  }, [getDisabledScaleClusters, getEnabledAutoScale, getHpaAZs, modalVisible])

  const handleReturn = () => {
    setStage(Stage.EDIT)
    form.setFieldsValue({ ...editedInstancesData })
  }

  const handleCancel = () => {
    form.resetFields()
    setStage(Stage.EDIT)
    onModalVisibleChange(false)
    setDeployments([])
  }

  const handleNextStage = async () => {
    setStage(Stage.CONFIRM)
    const instancesData = await form.validateFields()
    const diffData = difference(instancesData, originalInstancesData)
    setDiffData(diffData)
    setEditedInstancesData(instancesData)
    const editedData = reduce(
      instancesData,
      (result, value, key) => {
        const beforeInstances = originalInstancesData?.[key]?.instances
        const mergeData = {
          [key]: {
            ...value,
            beforeInstances,
          },
        }
        return Object.assign(result, mergeData)
      },
      {},
    )
    form.setFieldsValue({ ...editedData })
  }

  const { runAsync: scaleSDU, loading: scaleSDULoading } = useRequest(
    async (data: SDUInstancesData) => {
      await fetch['POST/api/ecp-cmdb/sdus/{sduName}:scale']({
        sduName,
        deployments: data,
      })
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('Scale succeeded.')
        onRefresh()
        handleCancel()
      },
    },
  )

  const handleConfirm = async () => {
    const filterdData = pickBy(diffData, (value) => !isEmpty(value?.instances))

    if (!isEmpty(filterdData)) {
      const instancesData = reduce(
        filterdData,
        (result: SDUInstancesData, value: InstancesData, key: string) => {
          const { instances } = value
          if (instances?.canaryReplicas !== undefined) {
            value.instances.canaryValid = true

            if (instances?.releaseReplicas === undefined) {
              value.instances.releaseReplicas = originalInstancesData[key].instances.releaseReplicas
            }
          }
          value.meta = originalInstancesData[key].meta
          result[key] = value

          return result
        },
        {},
      )
      await scaleSDU(instancesData)
    } else {
      message.info('No changed instances.')
      handleCancel()
    }
  }

  return (
    <StageModal
      title="Scale SDU"
      visible={modalVisible}
      stage={stage}
      onCancel={handleCancel}
      onNextStage={handleNextStage}
      onReturn={handleReturn}
      onConfirm={handleConfirm}
      loading={getDeploymentsLoading}
      handbookLink="https://confluence.shopee.io/pages/viewpage.action?pageId=1084134803"
      notice="Change instance count, will update the deploy config at the same time."
      width={1024}
      confirmLoading={scaleSDULoading}
    >
      <Form form={form} colon={false} style={{ marginTop: '32px' }}>
        <Form.Item label="SDU Name" {...formItemLayout}>
          <Input disabled value={sduName} style={{ width: 400 }} />
        </Form.Item>
        {stage === Stage.CONFIRM && <ChangedTag>Changed</ChangedTag>}
        {deployments?.map((deployment) => {
          const {
            deployId,
            status: { containers },
          } = deployment
          return containers?.length ? (
            <ScaleFormItem
              key={deployId}
              deployment={deployment}
              stage={stage}
              hpaAZs={hpaAZs}
              enabledAutoScale={enabledAutoScale}
              disabledScaleClusters={disabledScaleClusters}
              diffData={diffData}
            />
          ) : null
        })}
      </Form>
    </StageModal>
  )
}

export default Scale
