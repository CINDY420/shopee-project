import * as React from 'react'

import { DEPLOYMENT_ACTIONS } from 'constants/deployment'
import { deployConfigControllerGetDeployConfig } from 'swagger-api/v3/apis/DeployConfig'
import { IGetApplicationResponse } from 'swagger-api/v1/models'

import ScaleForm from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/ScaleForm'
import RollbackForm from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/RollbackForm'
import CrudDrawer from 'components/Common/CrudDrawer'
import RolloutRestartForm from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/RolloutRestartForm'
import FullRelease from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/FullRelease'
import CancelCanary from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/CancelCanary'
import DeleteDeployment from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/Delete'
import { ApplicationContext } from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/useApplicationContext'
import { ISpannedAz } from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/helper'

export interface IDeploymentSingleEditProps {
  initialValues: ISpannedAz
  onValuesChange?: (flag: boolean) => void
  application: IGetApplicationResponse
  afterFinished?: () => void
  onSuccess?: () => void
  deployConfigEnable?: boolean
}

interface IProps {
  application: IGetApplicationResponse
  deploy: ISpannedAz
  visible: boolean
  action: DEPLOYMENT_ACTIONS
  onCancel: () => void
  onSuccess?: () => void
}

const confirmActions = [DEPLOYMENT_ACTIONS.FULL_RELEASE, DEPLOYMENT_ACTIONS.CANCEL_CANARY, DEPLOYMENT_ACTIONS.DELETE]

const DeploymentSingleOperations: React.FC<IProps> = ({
  application,
  deploy,
  visible,
  action,
  onCancel,
  onSuccess
}) => {
  const [isDisable, setIsDisable] = React.useState(true)

  const showConfirmAction = confirmActions.includes(action)

  const handleValuesChange = React.useCallback((isError: boolean) => setIsDisable(isError), [])
  const [deployConfigEnable, setDeployConfigEnable] = React.useState(false)

  const handleCancel = React.useCallback(() => {
    setIsDisable(true)
    onCancel()
  }, [onCancel])

  const forms = React.useMemo(
    () => ({
      [DEPLOYMENT_ACTIONS.SCALE]: (
        <ScaleForm
          initialValues={deploy}
          onValuesChange={handleValuesChange}
          application={application}
          afterFinished={handleCancel}
          onSuccess={onSuccess}
          deployConfigEnable={deployConfigEnable}
        />
      ),
      [DEPLOYMENT_ACTIONS.ROLLBACK]: (
        <RollbackForm
          initialValues={deploy}
          onValuesChange={handleValuesChange}
          application={application}
          afterFinished={handleCancel}
        />
      ),
      [DEPLOYMENT_ACTIONS.ROLLOUT_RESTART]: (
        <RolloutRestartForm
          initialValues={deploy}
          onValuesChange={handleValuesChange}
          application={application}
          afterFinished={handleCancel}
        />
      )
    }),
    [deploy, handleValuesChange, application, handleCancel, onSuccess, deployConfigEnable]
  )

  const confirms = React.useMemo(
    () => ({
      [DEPLOYMENT_ACTIONS.FULL_RELEASE]: (
        <FullRelease
          initialValues={deploy}
          onValuesChange={handleValuesChange}
          application={application}
          onCancel={handleCancel}
        />
      ),
      [DEPLOYMENT_ACTIONS.CANCEL_CANARY]: (
        <CancelCanary
          initialValues={deploy}
          onValuesChange={handleValuesChange}
          application={application}
          onCancel={handleCancel}
        />
      ),
      [DEPLOYMENT_ACTIONS.DELETE]: (
        <DeleteDeployment
          initialValues={deploy}
          onValuesChange={handleValuesChange}
          application={application}
          onCancel={handleCancel}
        />
      )
    }),
    [deploy, handleValuesChange, application, handleCancel]
  )

  const { state } = React.useContext(ApplicationContext)
  const { selectedEnvironment } = state

  const getDeployConfigData = React.useCallback(async () => {
    const { tenantId, projectName, name: appName } = application
    const { data } =
      (await deployConfigControllerGetDeployConfig({
        tenantId: Number(tenantId),
        projectName,
        appName,
        env: selectedEnvironment
      })) || {}
    setDeployConfigEnable(data.enable)
  }, [application, selectedEnvironment])

  React.useEffect(() => {
    if (action === DEPLOYMENT_ACTIONS.SCALE) {
      getDeployConfigData()
    }
  }, [action, getDeployConfigData])

  const title = React.useMemo(() => {
    if (action === DEPLOYMENT_ACTIONS.ROLLOUT_RESTART) {
      return (
        <>
          <div>{action}</div>
          <div style={{ fontSize: '14px', color: '#999999' }}>
            Restart sequence is consistent with the deployment strategy
          </div>
        </>
      )
    } else if (action === DEPLOYMENT_ACTIONS.SCALE) {
      return (
        <>
          <div style={{ marginBottom: 8 }}>{action}</div>
          {/* {deployConfigEnable && (
            <Alert
              showIcon={true}
              icon={<IInformationFilled />}
              type='info'
              message={
                <DeployConfigNotice
                  // deployConfigEnable={deployConfigEnable}
                  deployConfigEnable={false}
                  notice='This operation cannot be canceled.'
                  // notice='Once-through operation only! If you want to modify the number of desired pods permanently, please modify the config at '
                />
              }
            />
          )} */}
        </>
      )
    }
    return action as string
  }, [action])

  React.useEffect(() => {
    if (action === DEPLOYMENT_ACTIONS.ROLLOUT_RESTART) {
      setIsDisable(false)
    }
  }, [action])

  return visible ? (
    showConfirmAction ? (
      confirms[action]
    ) : (
      <CrudDrawer
        title={title}
        formId={action}
        visible={visible && !showConfirmAction}
        body={forms[action]}
        closeDrawer={handleCancel}
        isSubmitDisabled={isDisable}
      />
    )
  ) : null
}

export default DeploymentSingleOperations
