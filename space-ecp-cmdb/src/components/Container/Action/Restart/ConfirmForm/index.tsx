import React from 'react'
import { Form } from 'infrad'
import { Sdu } from 'src/components/Container/SduTable'
import DeploymentLabel from 'src/components/Common/DeploymentLabel'
import { RestartItem } from 'src/components/Container/Action/Restart/ConfirmForm/style'
import { RestartEditForm } from 'src/components/Container/Action'
interface IConfirmFormProps {
  initialValues: Sdu
  restartSduData: RestartEditForm
}

const ConfirmForm: React.FC<IConfirmFormProps> = (props) => {
  const { initialValues, restartSduData } = props
  const { sdu, deployments } = initialValues
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13 },
  }
  return (
    <Form {...formItemLayout}>
      <Form.Item label="SDU Name">
        <div>{sdu}</div>
      </Form.Item>
      <Form.Item label="Restart Items">
        <div>
          {deployments.map((deployment) => {
            const { deployId, status } = deployment
            const { containers } = status
            const isChecked =
              restartSduData[deployId] &&
              ((containers.length !== 0 && restartSduData[deployId].length !== 0) ||
                (containers.length === 0 && restartSduData[deployId].length === 0))
            const phases = restartSduData[deployId]
            return (
              isChecked && (
                <RestartItem key={deployId}>
                  <DeploymentLabel
                    deployment={deployment}
                    extraContent={{ 'Phase/Stragegy': phases }}
                  />
                </RestartItem>
              )
            )
          })}
        </div>
      </Form.Item>
    </Form>
  )
}

export default ConfirmForm
