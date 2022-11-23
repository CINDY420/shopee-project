import { INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE, NON_NEGATIVE_NUMBER } from 'helpers/validate'
import { Form, Input, Radio, Select } from 'infrad'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import React from 'react'
import RowFormField from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/RowFormField'
import SubSectionWrapper from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SubSectionWrapper'
import TableFormList from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/TableFormList'
import {
  AutoDisabledInput,
  AutoDisabledRadioGroup,
  AutoDisabledSelect
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled'
import { ContentWrapper } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Strategy/style'
import {
  DeployConfigContext,
  FORM_TYPE,
  STRATEGY_TYPE
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'

interface IStrategyAProps {
  countryAzsOptions: Record<string, string[]>
}
const COMPULSORY_FIELD_VALIDATOR = { required: true, message: 'Please fill in your expectations' }
const StrategyA: React.FC<IStrategyAProps> = ({ countryAzsOptions }) => {
  const { state } = React.useContext(DeployConfigContext)
  const { componentType, nameMap } = state
  const displayNameArray = componentType?.nonBromo?.map(name => nameMap[name])
  const nonBromoComponent = displayNameArray?.join(', ')

  const notice = <>Only the following Components will be affected by Strategy: {nonBromoComponent}</>

  const Columns = [
    {
      title: 'Country',
      dataIndex: 'cid',
      key: 'cid',
      width: '11%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key, name, ...restField } = record

        return (
          <Form.Item {...restField} name={[name, 'cid']} rules={[COMPULSORY_FIELD_VALIDATOR]}>
            <AutoDisabledSelect>
              {Object.keys(countryAzsOptions).map(cid => (
                <Select.Option value={cid} key={cid}>
                  {cid}
                </Select.Option>
              ))}
            </AutoDisabledSelect>
          </Form.Item>
        )
      }
    },
    {
      title: 'AZ',
      dataIndex: 'azs',
      key: 'azs',
      width: '40%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key, name, ...restField } = record
        return (
          <Form.Item
            shouldUpdate={(prevValue, curValue) => prevValue.override?.[name]?.cid !== curValue.override?.[name]?.cid}
          >
            {({ getFieldValue }) => {
              const cid = getFieldValue(['override', name, 'cid'])
              const azs = countryAzsOptions[cid] || []
              return (
                <Form.Item {...restField} name={[name, 'idcs']} rules={[COMPULSORY_FIELD_VALIDATOR]}>
                  <AutoDisabledSelect mode='multiple'>
                    {azs.map(az => (
                      <Select.Option value={az} key={az}>
                        {az}
                      </Select.Option>
                    ))}
                  </AutoDisabledSelect>
                </Form.Item>
              )
            }}
          </Form.Item>
        )
      }
    },
    {
      title: 'Strategy Type',
      dataIndex: 'strategyType',
      key: 'strategyType',
      width: '17%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item name={[record.name, 'data', 'name']} initialValue={STRATEGY_TYPE.RECREATE}>
          <AutoDisabledSelect>
            <Select.Option value={STRATEGY_TYPE.ROLLING_UPDATE}>RollingUpdate</Select.Option>
            <Select.Option value={STRATEGY_TYPE.RECREATE}>Recreate</Select.Option>
          </AutoDisabledSelect>
        </Form.Item>
      )
    },
    {
      title: 'Max Surge',
      dataIndex: 'maxSurge',
      key: 'maxSurge',
      width: '14%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) =>
            prevValues.override?.[record.name]?.data?.name !== curValues.override?.[record.name]?.data?.name
          }
        >
          {({ getFieldValue }) => {
            const type = getFieldValue(['override', record.name, 'data', 'name'])
            return type === STRATEGY_TYPE.ROLLING_UPDATE ? (
              <Form.Item
                name={[record.name, 'data', 'parameters', 'max_surge']}
                initialValue='25%'
                rules={[
                  {
                    pattern: INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE,
                    message: 'Input integer or percentage'
                  }
                ]}
              >
                <AutoDisabledInput style={{ width: '100%' }} />
              </Form.Item>
            ) : (
              <Form.Item>
                <Input disabled={true} value='-' />
              </Form.Item>
            )
          }}
        </Form.Item>
      )
    },
    {
      title: 'Max Unavailable',
      dataIndex: 'maxUnavailable',
      key: 'maxUnavailable',
      width: '13%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) =>
            prevValues.override?.[record.name]?.data?.name !== curValues.override?.[record.name]?.data?.name
          }
        >
          {({ getFieldValue }) => {
            const type = getFieldValue(['override', record.name, 'data', 'name'])
            return type === STRATEGY_TYPE.ROLLING_UPDATE ? (
              <Form.Item
                name={[record.name, 'data', 'parameters', 'max_unavailable']}
                initialValue='0'
                rules={[
                  {
                    pattern: NON_NEGATIVE_NUMBER,
                    message: 'Please input a non-negative number'
                  }
                ]}
              >
                <AutoDisabledInput />
              </Form.Item>
            ) : (
              <Form.Item>
                <Input disabled={true} value='-' />
              </Form.Item>
            )
          }}
        </Form.Item>
      )
    }
  ]

  return (
    <SubSectionWrapper subTitle='Deployment Strategy A' notice={notice}>
      <RowFormField rowKey='Default' tooltip='This configuration will take effect globally unless it is overridden'>
        <ContentWrapper>
          <Form.Item label='Type' name='k8sStrategy' labelCol={{ span: 4 }} initialValue={STRATEGY_TYPE.RECREATE}>
            <AutoDisabledRadioGroup>
              <Radio value={STRATEGY_TYPE.ROLLING_UPDATE}>RollingUpdate</Radio>
              <Radio value={STRATEGY_TYPE.RECREATE}>Recreate</Radio>
            </AutoDisabledRadioGroup>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => prevValues.multiStageType !== curValues.multiStageType}
          >
            {({ getFieldValue }) => {
              const strategyType = getFieldValue('k8sStrategy')
              return strategyType === STRATEGY_TYPE.ROLLING_UPDATE ? (
                <>
                  <Form.Item
                    name='max_surge'
                    label='Max Surge'
                    initialValue='25%'
                    labelCol={{ span: 4 }}
                    rules={[
                      {
                        pattern: INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE,
                        message: 'Input integer or percentage'
                      }
                    ]}
                  >
                    <AutoDisabledInput style={{ width: 212 }} />
                  </Form.Item>
                  <Form.Item
                    name='max_unavailable'
                    label='Max Unavailable'
                    initialValue='0'
                    labelCol={{ span: 4 }}
                    rules={[
                      {
                        pattern: NON_NEGATIVE_NUMBER,
                        message: 'Please input a non-negative number'
                      }
                    ]}
                  >
                    <AutoDisabledInput placeholder='Input number or percentage' style={{ width: 212 }} />
                  </Form.Item>{' '}
                </>
              ) : null
            }}
          </Form.Item>
        </ContentWrapper>
      </RowFormField>

      <RowFormField rowKey='Override' tooltip='You can override the default configuration with this function'>
        <Form.List name='override'>
          {(fields, { add, remove }) => (
            <TableFormList
              dataColumns={Columns}
              dataSource={fields}
              onAdd={add}
              onRemove={remove}
              addButtonText='Add Override'
              formType={FORM_TYPE.STRAEGY}
            />
          )}
        </Form.List>
      </RowFormField>
    </SubSectionWrapper>
  )
}

export default StrategyA
