import * as React from 'react'
import { Modal, message } from 'infrad'
import { QuestionCircleOutlined } from 'infra-design-icons'

import useAsyncFn from 'hooks/useAsyncFn'
import { DEPLOYMENT_ACTIONS, BATCH_SCALE_FORM } from 'constants/deployment'
import { IGetApplicationResponse } from 'swagger-api/v1/models'
import {
  deploymentsControllerFullReleaseApplicationDeploys,
  deploymentsControllerRolloutRestartDeployment,
  deploymentsControllerScaleApplicationDeploys
} from 'swagger-api/v3/apis/Deployments'
import { ApplicationContext, EDIT_TYPES, getDispatchers } from '../../useApplicationContext'

import BatchOperations from 'components/Common/BatchOperations'
import BatchScaleForm from './BatchScaleForm'
import DeployConfigNotice from 'components/App/ApplicationsManagement/Common/DeployConfigNotice'
import { selectedApplication } from 'states/applicationState/application'
import { useRecoilValue } from 'recoil'
interface IProps {
  application: IGetApplicationResponse
  onSuccess?: () => void
}

const DeploymentBatchOperations: React.FC<IProps> = ({ application, onSuccess }) => {
  const { tenantId, projectName, name: appName } = application
  const { state, dispatch } = React.useContext(ApplicationContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { editingObject } = state

  const { editingRows } = editingObject
  const isBatchEditing = !!(editingObject && editingObject.editType === EDIT_TYPES.BATCH)
  const editingAction = (editingObject && editingObject.actionType) || ''
  const isScale = editingAction === DEPLOYMENT_ACTIONS.SCALE
  const isRestart = editingAction === DEPLOYMENT_ACTIONS.ROLLOUT_RESTART
  const applicationState = useRecoilValue(selectedApplication)

  const batchUpdates = React.useMemo(
    () => ({
      [DEPLOYMENT_ACTIONS.SCALE]: deploymentsControllerScaleApplicationDeploys,
      [DEPLOYMENT_ACTIONS.FULL_RELEASE]: deploymentsControllerFullReleaseApplicationDeploys,
      [DEPLOYMENT_ACTIONS.ROLLOUT_RESTART]: deploymentsControllerRolloutRestartDeployment
    }),
    []
  )

  const [, fetchFn] = useAsyncFn(batchUpdates[editingAction])

  const handleScale = React.useCallback(
    values => {
      const deploys = editingRows.map(deploy => {
        const { canaryCount, clusterId, sduName: deploymentName, releaseCount, appInstanceName } = deploy
        const payload = { canaryCount, clusterId, name: deploymentName, releaseCount, appInstanceName }
        return {
          ...payload,
          ...values,
          canaryValid: false
        }
      })

      fetchFn({
        tenantId,
        projectName,
        appName,
        payload: {
          deploys
        }
      }).then(() => {
        message.success('Scale these deploys successful!')
        onSuccess && onSuccess()
      })
      dispatchers.exitEdit()
    },
    [appName, dispatchers, editingRows, fetchFn, tenantId, onSuccess, projectName]
  )

  const handleRestart = React.useCallback(() => {
    const deploys = editingRows.map(deploy => {
      const { phase, clusterId, sduName, appInstanceName } = deploy
      const body = { clusterId, name: sduName, appInstanceName }
      return {
        ...body,
        phases: phase.split('/')
      }
    })

    fetchFn({
      tenantId,
      projectName,
      appName,
      payload: {
        deploys
      }
    }).then(() => message.success('Rollout Restart these deploys successful!'))
    dispatchers.exitEdit()
  }, [appName, dispatchers, editingRows, fetchFn, tenantId, projectName])

  const noticeMap = React.useMemo(
    () => ({
      [DEPLOYMENT_ACTIONS.ROLLOUT_RESTART]:
        'Restart sequence is consistent with the deployment strategy, this operation cannot be canceled.',
      [DEPLOYMENT_ACTIONS.SCALE]: (
        <DeployConfigNotice
          // deployConfigEnable={true}
          deployConfigEnable={false}
          notice='This operation cannot be canceled.'
          // notice='Once-through operation only! If you want to modify the number of desired pods permanently, please modify the config at '
          application={applicationState}
        />
      ),
      [DEPLOYMENT_ACTIONS.FULL_RELEASE]: 'This operation cannot be canceled.'
    }),
    [applicationState]
  )

  const confirm = React.useCallback(
    (values?: any) =>
      Modal.confirm({
        title: `${editingAction} these deployments?`,
        icon: <QuestionCircleOutlined />,
        content: noticeMap[editingAction],
        okText: 'Confirm',
        cancelText: 'Cancel',
        onOk() {
          if (isScale) {
            return handleScale(values)
          }

          if (isRestart) {
            return handleRestart()
          }

          fetchFn({
            tenantId,
            projectName,
            appName,
            payload: {
              deploys: editingRows.map(az => ({
                name: az.sduName,
                clusterId: az.clusterId,
                appInstanceName: az.appInstanceName
              }))
            }
          }).then(() => message.success(`${editingAction} these deploys successful!`))
          dispatchers.exitEdit()
        }
      }),
    [
      editingAction,
      noticeMap,
      isScale,
      isRestart,
      fetchFn,
      tenantId,
      projectName,
      appName,
      editingRows,
      dispatchers,
      handleScale,
      handleRestart
    ]
  )

  const handleSubmit = React.useCallback(() => {
    if (isScale) {
      return
    }

    confirm()
  }, [confirm, isScale])

  const body = React.useMemo(() => {
    if (isScale) {
      return <BatchScaleForm onFinish={confirm} />
    }

    return ''
  }, [confirm, isScale])
  const desc = React.useMemo(() => {
    if (editingAction === DEPLOYMENT_ACTIONS.ROLLOUT_RESTART) {
      return 'Restart sequence is consistent with the deployment strategy, all Phase in the deployment will be restarted.'
    }

    return ''
  }, [editingAction])
  const formId = isScale ? BATCH_SCALE_FORM : null

  return (
    <BatchOperations
      desc={desc}
      formId={formId}
      title={`Batch-${editingAction}`}
      visible={isBatchEditing}
      selectedCount={editingRows.length}
      disabled={editingRows.length === 0}
      onSubmit={handleSubmit}
      onCancel={() => dispatchers.exitEdit()}
    >
      {body}
    </BatchOperations>
  )
}

export default DeploymentBatchOperations
