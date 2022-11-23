import * as React from 'react'
import { Modal, message } from 'infrad'
import { QuestionCircleOutlined } from 'infra-design-icons'

import useAsyncFn from 'hooks/useAsyncFn'
import { DEPLOYMENT_ACTIONS } from 'constants/deployment'
import { deploymentsControllerFullReleaseApplicationDeploys } from 'swagger-api/v3/apis/Deployments'

import { IDeploymentSingleEditProps } from '../index'

interface IProps extends IDeploymentSingleEditProps {
  onCancel: () => void
}

const FullRelease: React.FC<IProps> = ({ initialValues, application, onCancel }) => {
  const { sduName: deployName, clusterId, appInstanceName = '' } = initialValues || {}
  const { tenantId, projectName, name: appName } = application

  const [, fullReleaseDeploymentFn] = useAsyncFn(deploymentsControllerFullReleaseApplicationDeploys)

  const confirm = React.useCallback(() => {
    return Modal.confirm({
      title: `${DEPLOYMENT_ACTIONS.FULL_RELEASE} the deployment ${deployName}`,
      icon: <QuestionCircleOutlined />,
      content: 'This operation cannot be canceled',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk() {
        fullReleaseDeploymentFn({
          tenantId: Number(tenantId),
          projectName,
          appName,
          payload: {
            deploys: [
              {
                clusterId,
                name: deployName,
                appInstanceName
              }
            ]
          }
        }).then(() => message.success(`${DEPLOYMENT_ACTIONS.FULL_RELEASE} ${deployName} successful!`))
        onCancel()
      },
      onCancel: onCancel
    })
  }, [deployName, onCancel, fullReleaseDeploymentFn, tenantId, projectName, appName, clusterId, appInstanceName])

  React.useEffect(() => {
    confirm()
  }, [confirm])

  return null
}

export default FullRelease
