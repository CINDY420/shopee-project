import { Alert, Form, Select } from 'infrad'
import React from 'react'
import RowFormField from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/RowFormField'
import SubSectionWrapper from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SubSectionWrapper'
import {
  AutoDisabledInput,
  AutoDisabledSelect,
  AutoDisabledSwitch
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled'
import {
  ContentWrapper,
  HintWrapper
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Strategy/style'
import { INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE } from 'helpers/validate'
import {
  DeployConfigContext,
  IN_PLACE_TYPE
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import { normalizeNumber } from 'helpers/normalize'

enum DEPLOYMENT_STRATEGY_TYPE {
  BLUE_GREEN_STRATEGY = 'BLUE_GREEN_STRATEGY',
  REPLACEMENT_STRATEGY = 'REPLACEMENT_STRATEGY',
  HYBRID_STRATEGY = 'HYBRID_STRATEGY'
}

const StrategyB: React.FC = () => {
  const { state } = React.useContext(DeployConfigContext)
  const { componentType, nameMap } = state

  const displayNameArray = componentType?.bromo?.map(name => nameMap[name])
  const bromoComponent = displayNameArray?.join(', ')

  const notice = <>Only the following Components will be affected by Strategy: {bromoComponent}</>
  return (
    <SubSectionWrapper subTitle='Deployment Strategy B' notice={notice}>
      <RowFormField rowKey='Default'>
        <ContentWrapper>
          <Form.Item label='Deployment Strategy' labelCol={{ span: 6 }}>
            <Form.Item name='deploymentStrategy' initialValue={DEPLOYMENT_STRATEGY_TYPE.BLUE_GREEN_STRATEGY}>
              <AutoDisabledSelect style={{ width: '400px' }}>
                {Object.values(DEPLOYMENT_STRATEGY_TYPE).map(deployment => (
                  <Select.Option value={deployment} key={deployment}>
                    {deployment}
                  </Select.Option>
                ))}
              </AutoDisabledSelect>
            </Form.Item>

            <Alert
              showIcon
              type='warning'
              message='It is also highly recommended to use replacement deployment strategy if multiple-stage canary is selected.'
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => prevValues.deploymentStrategy !== curValues.deploymentStrategy}
          >
            {({ getFieldValue }) => {
              const deploymentStrategy = getFieldValue('deploymentStrategy')
              return deploymentStrategy === DEPLOYMENT_STRATEGY_TYPE.REPLACEMENT_STRATEGY ? (
                <Form.Item
                  label='In place'
                  name='in_place'
                  initialValue={IN_PLACE_TYPE.IN_PLACE}
                  labelCol={{ span: 6 }}
                >
                  <AutoDisabledSelect style={{ width: '400px' }}>
                    {Object.values(IN_PLACE_TYPE).map(type => (
                      <Select.Option value={type} key={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </AutoDisabledSelect>
                </Form.Item>
              ) : null
            }}
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => prevValues.deploymentStrategy !== curValues.deploymentStrategy}
          >
            {({ getFieldValue }) => {
              const deploymentStrategy = getFieldValue('deploymentStrategy')
              return deploymentStrategy !== DEPLOYMENT_STRATEGY_TYPE.BLUE_GREEN_STRATEGY ? (
                <>
                  <Form.Item label='Step Down' labelCol={{ span: 6 }}>
                    <Form.Item
                      name='step_down'
                      initialValue='25'
                      rules={[
                        { pattern: INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE, message: 'Input integer or percentage' }
                      ]}
                      normalize={value => normalizeNumber(value)}
                      noStyle
                    >
                      <AutoDisabledInput style={{ width: '120px' }} />
                    </Form.Item>
                    <Form.Item noStyle>
                      <HintWrapper>Please enter a non-negative number or percentage</HintWrapper>
                    </Form.Item>
                  </Form.Item>
                  <Form.Item
                    label='Enable Canary Replacement'
                    name='enable_canary_replacement'
                    valuePropName='checked'
                    initialValue={false}
                    labelCol={{ span: 6 }}
                  >
                    <AutoDisabledSwitch />
                  </Form.Item>
                </>
              ) : null
            }}
          </Form.Item>
        </ContentWrapper>
      </RowFormField>
    </SubSectionWrapper>
  )
}

export default StrategyB
