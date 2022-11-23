import * as React from 'react'
import { Form, Input, Checkbox, Row, Col, message } from 'infrad'

import useAsyncFn from 'hooks/useAsyncFn'
import { IDeploymentSingleEditProps } from '../index'
import { DEPLOYMENT_ACTIONS, PHASE_CANARY, CANARY_PHASE } from 'constants/deployment'
import { deploymentsControllerRolloutRestartDeployment } from 'swagger-api/v3/apis/Deployments'

import BaseForm from '../Common/BaseForm'

import { Label } from '../style'

const { Item } = Form
const { Group } = Checkbox

const RolloutRestartForm: React.FC<IDeploymentSingleEditProps> = ({
  initialValues,
  onValuesChange,
  application,
  afterFinished
}) => {
  const [form] = Form.useForm()

  const { phase, sduName: deployName, appInstanceName = '' } = initialValues || {}
  const { tenantId, projectName, name: appName } = application

  const [, fetchFn] = useAsyncFn(deploymentsControllerRolloutRestartDeployment)

  const worker = {
    ...initialValues,
    phases: phase.split('/')
  }

  return (
    <BaseForm
      form={form}
      initialValues={worker}
      id={DEPLOYMENT_ACTIONS.ROLLOUT_RESTART}
      onFinish={values => {
        const { sduName: name, ...others } = values
        fetchFn({
          tenantId: Number(tenantId),
          projectName,
          appName,
          payload: {
            deploys: [
              {
                appInstanceName,
                name,
                ...others
              }
            ]
          }
        }).then(() => message.success(`${DEPLOYMENT_ACTIONS.ROLLOUT_RESTART} ${values.name} successful!`))
        afterFinished()
      }}
      onValuesChange={onValuesChange}
      confirmConfig={{
        title: `${DEPLOYMENT_ACTIONS.ROLLOUT_RESTART} the deployment ${deployName}`,
        content: 'Restart sequence is consistent with the deployment strategy, this operation cannot be canceled'
      }}
    >
      <Item label={<Label>Deployment Name</Label>} name='sduName'>
        <Input disabled />
      </Item>
      <Item label={<Label>Cluster</Label>} name='clusterId'>
        <Input disabled />
      </Item>
      <Item shouldUpdate={true} noStyle>
        {form => {
          const phase = form.getFieldValue('phase')
          const isCanary = phase === PHASE_CANARY || phase === CANARY_PHASE

          return (
            <Item name='phases' label='Phase'>
              {isCanary ? (
                <Group style={{ width: '100%' }}>
                  <Row>
                    <Col span={5}>
                      <Checkbox value='RELEASE'>RELEASE</Checkbox>
                    </Col>
                    <Col span={5}>
                      <Checkbox value='CANARY'>CANARY</Checkbox>
                    </Col>
                  </Row>
                </Group>
              ) : (
                <Group style={{ width: '100%' }}>
                  <Row>
                    <Col span={5}>
                      <Checkbox value={phase}>{phase}</Checkbox>
                    </Col>
                  </Row>
                </Group>
              )}
            </Item>
          )
        }}
      </Item>
    </BaseForm>
  )
}

export default RolloutRestartForm
