import * as React from 'react'
import { Form, Input, message } from 'infrad'
import { isEmpty } from 'lodash'
import { fetch } from 'src/rapper'
import StageModal, { Stage } from 'src/components/Common/StageModal'
import difference from 'src/helpers/difference'
import { useRequest } from 'ahooks'
import { DeploymentActions, DEPLOY_ENGINE } from 'src/constants/deployment'
import Formula from 'src/components/Container/Action/Scale/Common/Formula'
import ScaleNotice from 'src/components/Container/Action/Scale/Common/ScaleNotice'
import {
  ChangedTag,
  DiffContent,
  DiffInner,
  InstancesFormItem,
  Version,
  VersionFormHeader,
} from 'src/components/Deployment/Action/Scale/style'
import { DeploymentContext, getDispatchers } from 'src/components/Deployment/useDeploymentContext'

interface IScaleProps {
  sduName: string
  deployId: string
  env: string
}

type InstancesData = {
  releaseReplicas: number
  canaryReplicas?: number
  canaryValid?: boolean
}

const VERSION = {
  BEFORE: 'Before',
  AFTER: 'After',
}

const Scale: React.FC<IScaleProps> = (props) => {
  const { sduName, deployId, env } = props
  const [editForm] = Form.useForm()
  const [beforeForm] = Form.useForm()
  const [afterForm] = Form.useForm()
  const [stage, setStage] = React.useState<Stage>(Stage.EDIT)
  const [originalInstancesData, setOriginalInstancesData] = React.useState<InstancesData>()
  const [enabledHpa, setEnabledHpa] = React.useState<boolean>(false)
  const [enabledAutoScale, setEnabledAutoScale] = React.useState(false)
  const [diffData, setDiffData] = React.useState<InstancesData>()

  const { state, dispatch } = React.useContext(DeploymentContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { action } = state
  const modalVisible = action === DeploymentActions.SCALE

  const {
    data: deployment,
    loading: getDeploymentLoading,
    mutate: setDeployment,
  } = useRequest(
    async () => {
      if (modalVisible) {
        const deployment = await fetch[
          'GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/meta'
        ]({
          sduName,
          deployId,
        })
        const { releaseInstances: releaseReplicas, canaryInstances: canaryReplicas } = deployment
        setOriginalInstancesData({
          releaseReplicas,
          canaryReplicas,
        })
        editForm.setFieldsValue({
          releaseReplicas,
          canaryReplicas,
        })
        return deployment
      }
    },
    {
      refreshDeps: [modalVisible, deployId, editForm, sduName],
    },
  )
  const {
    project,
    module,
    azV1: az,
    containers,
    deployEngine,
    componentType,
    cluster,
  } = deployment || {}

  const getEnabledHpaAZs = React.useCallback(async () => {
    if (!az) return
    const { azs } = await fetch['GET/api/ecp-cmdb/sdus/{sduName}/hpa:enabledAZs']({ sduName })
    setEnabledHpa(azs.includes(az))
  }, [az, sduName])

  const getEnabledAutoScale = React.useCallback(async () => {
    if (!project || !module) return
    if (env !== 'live' && env !== 'liveish') return
    const { enabledAutoScale } = await fetch['GET/api/ecp-cmdb/sdus/{sduName}/autoScale:enabled']({
      sduName,
      project,
      module,
    })
    setEnabledAutoScale(enabledAutoScale)
  }, [module, project, sduName])

  React.useEffect(() => {
    if (modalVisible) {
      getEnabledHpaAZs()
      getEnabledAutoScale()
    }
  }, [getEnabledAutoScale, getEnabledHpaAZs, modalVisible])

  const handleCancel = () => {
    editForm.resetFields()
    setStage(Stage.EDIT)
    dispatchers.exitEdit()
    setDeployment()
  }

  const handleNextStage = async () => {
    const editedInstancesData = await editForm.validateFields()
    const diffData = difference(editedInstancesData, originalInstancesData)
    setDiffData(diffData)
    beforeForm.setFieldsValue(originalInstancesData)
    afterForm.setFieldsValue(editedInstancesData)
    setStage(Stage.CONFIRM)
  }

  const { runAsync: scaleDeployment, loading: scaleDeploymentLoading } = useRequest(
    async () => {
      await fetch['POST/api/ecp-cmdb/sdus/{sduName}/deploys/{deployId}:scale']({
        sduName,
        deployId,
        ...diffData,
      })
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('Scale succeeded.')
        dispatchers.requestRefresh()
        handleCancel()
      },
    },
  )

  const handleConfirm = async () => {
    if (!isEmpty(diffData)) {
      if (diffData.canaryReplicas !== undefined) {
        diffData.canaryValid = true

        if (diffData.releaseReplicas === undefined) {
          diffData.releaseReplicas = originalInstancesData.releaseReplicas
        }
      }
      await scaleDeployment()
    } else {
      message.info('No changed instances.')
      handleCancel()
    }
  }

  const renderEditForm = (
    <Form form={editForm} labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
      <Form.Item label="SDU Name">
        <Input disabled value={sduName} style={{ width: 400 }} />
      </Form.Item>
      <Form.Item label="AZ">
        <Input disabled value={`${az}(${cluster})`} style={{ width: 400 }} />
      </Form.Item>
      <Form.Item label="Workload Type">
        <Input disabled value={componentType} style={{ width: 400 }} />
      </Form.Item>
      <InstancesFormItem label="Target Instance">
        {containers?.length ? (
          <Formula
            formItemPath={[]}
            containers={containers}
            stage={Stage.EDIT}
            isBromo={deployEngine === DEPLOY_ENGINE.BROMO}
            enabledAutoScale={enabledAutoScale}
          />
        ) : null}
      </InstancesFormItem>
    </Form>
  )

  const renderDiffForm = (
    <>
      <Form.Item label="SDU Name">
        <Input disabled value={sduName} style={{ width: 400 }} />
      </Form.Item>
      <div>
        {Object.values(VERSION).map((version) => {
          const isBefore = version === VERSION.BEFORE
          return (
            <DiffInner key={version}>
              <Form form={isBefore ? beforeForm : afterForm}>
                <VersionFormHeader>
                  <Version>{version}</Version>
                  {!isBefore && <ChangedTag>Changed</ChangedTag>}
                </VersionFormHeader>
                {containers?.length ? (
                  <DiffContent>
                    <div style={{ marginLeft: '16px' }}>Target Instance:</div>
                    <Formula
                      formItemPath={[]}
                      containers={containers}
                      stage={Stage.CONFIRM}
                      isBromo={deployEngine === DEPLOY_ENGINE.BROMO}
                      diffData={isBefore ? null : diffData}
                    />
                  </DiffContent>
                ) : null}
              </Form>
            </DiffInner>
          )
        })}
      </div>
    </>
  )

  return (
    <StageModal
      title="Scale SDU"
      visible={modalVisible}
      stage={stage}
      onCancel={handleCancel}
      onNextStage={handleNextStage}
      onReturn={() => setStage(Stage.EDIT)}
      onConfirm={handleConfirm}
      loading={getDeploymentLoading}
      handbookLink="https://confluence.shopee.io/pages/viewpage.action?pageId=1084134803"
      notice="Change instance count, will update the deploy config at the same time."
      width={1024}
      confirmLoading={scaleDeploymentLoading}
    >
      <ScaleNotice
        isBromoDeployment={deployEngine === DEPLOY_ENGINE.BROMO}
        enabledHpa={enabledHpa}
        enabledAutoScale={enabledAutoScale}
        style={{ marginTop: '12px' }}
      />
      <div style={{ marginTop: '32px' }}>
        {stage === Stage.EDIT ? renderEditForm : renderDiffForm}
      </div>
    </StageModal>
  )
}

export default Scale
