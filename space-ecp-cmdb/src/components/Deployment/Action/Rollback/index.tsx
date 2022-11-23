import { Form, Input, message, Select } from 'infrad'
import * as React from 'react'
import StageModal, { Stage } from 'src/components/Common/StageModal'
import { DeploymentContext, getDispatchers } from 'src/components/Deployment/useDeploymentContext'
import { DeploymentActions, DEPLOYMENT_CANARY_PHASE } from 'src/constants/deployment'
import { IModels } from 'src/rapper/request'
import { fetch } from 'src/rapper'
import { flatten, groupBy, intersection, map, isEmpty, isEqual, xorWith } from 'lodash'
import { StyledContainer, StyledItem } from 'src/components/Deployment/Action/Rollback/style'
import { InstancesFormItem } from 'src/components/Deployment/Action/Scale/style'
import { formatTime } from 'src/helpers/format'
import ContainerTable from 'src/components/Deployment/Action/Rollback/ContainerTable'
import { useRequest } from 'ahooks'
import { tryCatch } from '@infra/utils'

type DeploymentHistory =
  IModels['GET/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}/history']['Res']
export type Container = DeploymentHistory['items'][0]['containers'][0]

interface IRollbackFromInstance {
  containers: Container[]
}

interface IRollbackProps {
  sduName: string
  deployId: string
}

const Rollback: React.FC<IRollbackProps> = ({ sduName, deployId }) => {
  const [stage, setStage] = React.useState<Stage>(Stage.EDIT)
  const [deploymentHistory, setDeploymentHistory] = React.useState<DeploymentHistory['items']>([])
  const [editContainers, setEditContainers] = React.useState<Container[]>([])
  const [isNextStageDisabled, setIsNestStageDisabled] = React.useState<boolean>(true)

  const { state, dispatch } = React.useContext(DeploymentContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { action } = state
  const [editForm] = Form.useForm<IRollbackFromInstance>()

  const handleCancel = () => {
    editForm.resetFields()
    setStage(Stage.EDIT)
    dispatchers.exitEdit()
  }

  const handleNextStage = async () => {
    const [_, error] = await tryCatch(editForm.validateFields())
    if (!error) {
      setStage(Stage.CONFIRM)
    }
  }

  const handleConfirm = async () => {
    const { containers } = editForm.getFieldsValue()

    const [, error] = await tryCatch(
      fetch['POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:rollback']({
        sduName,
        deployId,
        deploymentId: deployId,
        containers,
      }),
    )

    if (!error) {
      void message.success('Rollback succeeded')
      dispatchers.requestRefresh()
    }

    handleCancel()
  }

  const {
    data: deploymentMeta,
    loading: deploymentMetaLoading,
    run: getDeploymentMetaRun,
  } = useRequest(
    () =>
      fetch['GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/meta']({
        sduName,
        deployId,
      }),
    {
      onSuccess: (deploymentMeta) => {
        const { containers } = deploymentMeta
        editForm.setFieldsValue({ containers })
      },
    },
  )

  const { loading: deploymentHistoryLoading, run: listDeploymentHistoryRun } = useRequest(
    () =>
      fetch['GET/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}/history']({
        sduName,
        deployId,
      }),
    {
      onSuccess: (result: DeploymentHistory) => {
        setDeploymentHistory(result.items)
      },
    },
  )

  const { azV1: az, containers = [], componentType, cluster } = deploymentMeta || {}

  const deDuplicatedPhases = React.useMemo(() => {
    const phases = containers.map((item) => item.phase)
    return Array.from(new Set(phases))
  }, [containers])

  const containerHistoryMap: Record<string, Container[]> = React.useMemo(() => {
    const containers = flatten(map(deploymentHistory, 'containers'))
    return groupBy(containers, 'name')
  }, [deploymentHistory])

  const isCanary = intersection([DEPLOYMENT_CANARY_PHASE], deDuplicatedPhases).length > 0
  const isEditing = stage === Stage.EDIT
  const isConfirming = stage === Stage.CONFIRM

  const renderEditForm = (
    <Form
      form={editForm}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 14 }}
      onValuesChange={(_, allValues) => {
        const { containers: editContainers } = allValues
        setEditContainers(editContainers)
        const isChanged = !isEmpty(xorWith(containers, editContainers, isEqual))
        setIsNestStageDisabled(!isChanged)
      }}
    >
      <Form.Item label="SDU Name">
        <Input disabled value={sduName} style={{ width: 400 }} />
      </Form.Item>
      <Form.Item label="AZ">
        <Input disabled value={`${az}(${cluster})`} style={{ width: 400 }} />
      </Form.Item>
      <Form.Item label="Workload Type">
        <Input disabled value={componentType} style={{ width: 400 }} />
      </Form.Item>
      <Form.Item label="Phase">
        <Input
          disabled
          value={isCanary ? DEPLOYMENT_CANARY_PHASE : deDuplicatedPhases[0]}
          style={{ width: 400 }}
        />
      </Form.Item>
      <InstancesFormItem label="Containers" hidden={!isEditing}>
        <StyledContainer>
          <Form.List name="containers">
            {(fields) =>
              fields.map((field, index) => {
                const { key, name, ...restField } = field
                const container = containers[key]
                const { name: label } = container
                const containerHistory = containerHistoryMap[label] || []

                return (
                  <StyledItem
                    key={key}
                    {...restField}
                    label={label}
                    labelAlign="right"
                    name={[name, 'tag']}
                  >
                    <Select
                      onChange={(value: string) => {
                        const [tagName, image, timestamp] = value.split(',')
                        const selectedContainerHistory = containerHistory.find(
                          (container) =>
                            container.tag === tagName &&
                            container.image === image &&
                            container.timestamp === timestamp,
                        )

                        const containers = editForm.getFieldValue('containers') as Container[]
                        const editingContainer = containers[index]

                        editingContainer.image = selectedContainerHistory.image
                        editingContainer.tag = tagName

                        editForm.setFieldsValue({
                          containers,
                        })
                      }}
                      style={{ width: 364 }}
                      loading={deploymentHistoryLoading}
                      disabled={deploymentHistoryLoading}
                    >
                      {containerHistory.map((container) => {
                        const { image, tag, timestamp } = container
                        const value = `${tag},${image},${timestamp}`
                        return (
                          <Select.Option key={value} value={value}>
                            <div>{tag}</div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#bfbfbf',
                                wordBreak: 'break-all',
                                whiteSpace: 'break-spaces',
                              }}
                            >{`image: ${image}`}</div>
                            <div
                              style={{ fontSize: '12px', color: '#bfbfbf' }}
                            >{`timestamp: ${formatTime(Number(timestamp))}`}</div>
                          </Select.Option>
                        )
                      })}
                    </Select>
                  </StyledItem>
                )
              })
            }
          </Form.List>
        </StyledContainer>
      </InstancesFormItem>
      {isConfirming && (
        <ContainerTable currentContainers={containers} targetContainers={editContainers} />
      )}
    </Form>
  )

  const isVisible = action === DeploymentActions.ROLLBACK

  React.useEffect(() => {
    if (isVisible) {
      getDeploymentMetaRun()
      listDeploymentHistoryRun()
    }
  }, [getDeploymentMetaRun, isVisible, listDeploymentHistoryRun])

  return (
    <StageModal
      title="Rollback"
      visible={isVisible}
      stage={stage}
      onCancel={handleCancel}
      onNextStage={handleNextStage}
      onReturn={() => setStage(Stage.EDIT)}
      onConfirm={handleConfirm}
      loading={deploymentMetaLoading}
      handbookLink="https://confluence.shopee.io/pages/viewpage.action?pageId=1084134803"
      width={1024}
      nextButtonDisabled={isNextStageDisabled}
    >
      <div>{renderEditForm}</div>
    </StageModal>
  )
}

export default Rollback
