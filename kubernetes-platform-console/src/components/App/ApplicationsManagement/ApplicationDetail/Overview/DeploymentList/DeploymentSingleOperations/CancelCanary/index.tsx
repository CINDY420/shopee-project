import * as React from 'react'
import { Modal, message } from 'infrad'
import { QuestionCircleOutlined } from 'infra-design-icons'

import useAsyncFn from 'hooks/useAsyncFn'
import { DEPLOYMENT_ACTIONS } from 'constants/deployment'
import { deploymentsControllerCancelCanaryApplicationDeploys } from 'swagger-api/v3/apis/Deployments'

import { IDeploymentSingleEditProps } from '../index'

interface IProps extends IDeploymentSingleEditProps {
  onCancel: () => void
}

const CancelCanary: React.FC<IProps> = ({ initialValues, application, onCancel }) => {
  const { sduName: deployName, clusterId, releaseCount, canaryCount, appInstanceName = '' } = initialValues || {}
  const { tenantId, projectName, name: appName } = application

  const [, cancelCanaryDeploymentFn] = useAsyncFn(deploymentsControllerCancelCanaryApplicationDeploys)

  const confirm = React.useCallback(() => {
    return Modal.confirm({
      title: `${DEPLOYMENT_ACTIONS.CANCEL_CANARY} state of deployment ${deployName}`,
      icon: <QuestionCircleOutlined />,
      content: 'This operation cannot be canceled',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk() {
        cancelCanaryDeploymentFn({
          tenantId: Number(tenantId),
          projectName,
          appName,
          payload: {
            deploys: [
              {
                clusterId,
                name: deployName,
                canaryCount: 0,
                releaseCount: releaseCount + canaryCount,
                canaryValid: true,
                appInstanceName
              }
            ]
          }
        }).then(() => message.success(`${DEPLOYMENT_ACTIONS.CANCEL_CANARY} of ${deployName} successful!`))
        onCancel()
      },
      onCancel: onCancel
    })
  }, [
    deployName,
    onCancel,
    cancelCanaryDeploymentFn,
    tenantId,
    projectName,
    appName,
    clusterId,
    releaseCount,
    canaryCount,
    appInstanceName
  ])

  React.useEffect(() => {
    confirm()
  }, [confirm])

  return null
}

export default CancelCanary
