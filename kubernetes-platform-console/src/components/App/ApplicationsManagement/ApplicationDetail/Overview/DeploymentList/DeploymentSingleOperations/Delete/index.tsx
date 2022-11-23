import * as React from 'react'
import { Modal, message } from 'infrad'

import useAsyncFn from 'hooks/useAsyncFn'
import { DEPLOYMENT_ACTIONS } from 'constants/deployment'
import { deploymentsControllerDeleteDeploymeny } from 'swagger-api/v3/apis/Deployments'

import { IDeploymentSingleEditProps } from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations'

interface IDeleteDeploymentProps extends IDeploymentSingleEditProps {
  onCancel: () => void
}

const DeleteDeployment: React.FC<IDeleteDeploymentProps> = ({ initialValues, application, onCancel }) => {
  const { sduName: deployName, phase, clusterId } = initialValues || {}
  const { tenantId, projectName, name: appName } = application

  const [, deleteDeploymentFn] = useAsyncFn(deploymentsControllerDeleteDeploymeny)

  const confirm = React.useCallback(() => {
    return Modal.confirm({
      title: 'Notice',
      icon: null,
      content: `Are you sure to delete this deployment(${deployName})?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {
        deleteDeploymentFn({
          tenantId: Number(tenantId),
          projectName,
          appName,
          deployName,
          payload: {
            phase,
            cluster: clusterId
          }
        }).then(() => message.success(`${DEPLOYMENT_ACTIONS.DELETE} ${deployName} successful!`))
        onCancel()
      },
      onCancel
    })
  }, [appName, clusterId, deleteDeploymentFn, deployName, onCancel, phase, projectName, tenantId])

  React.useEffect(() => {
    confirm()
  }, [confirm])

  return null
}

export default DeleteDeployment
