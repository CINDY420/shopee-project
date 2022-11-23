import React, { useState } from 'react'
import { Form, Select } from 'infrad'
import TableFormList from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/TableFormList'
import SectionWrapper from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SectionWrapper'
import RowFormField from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/RowFormField'
import {
  DeployConfigContext,
  FORM_TYPE,
  getDispatchers
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import { NON_NEGATIVE_NUMBER } from 'helpers/validate'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import {
  AutoDisabledInput,
  AutoDisabledSwitch,
  AutoDisabledSelect
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled'
import { find } from 'lodash'
import { normalizeNumber } from 'helpers/normalize'
import { ISelector } from 'swagger-api/v1/models'
import { Hint } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/AssignmentPolicy/style'

const COMPULSORY_FIELD_VALIDATOR = { required: true, message: 'Please fill in your expectations' }
enum OPERATORS {
  EQUAL = '==',
  NOT_EQUAL = '!=',
  IN = 'in',
  NOT_IN = 'not in',
  ALMOST_IN = '~in',
  ALMOST_EQUAL = '~='
}

const AssignmentPolicy: React.FC = () => {
  const [form] = Form.useForm()
  const [status, setStatus] = useState(true)

  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])

  const { newDeployConfig, componentType, nameMap } = state
  const { scheduler } = newDeployConfig
  const displayNameArray = componentType?.bromo?.map(name => nameMap[name])
  const bromoComponent = displayNameArray?.join(', ')

  const dataColumns = [
    {
      title: 'Key',
      dataIndex: 'key',
      width: '43%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item name={[record.name, 'key']} rules={[COMPULSORY_FIELD_VALIDATOR]}>
          <AutoDisabledInput />
        </Form.Item>
      )
    },
    {
      title: 'Operator',
      dataIndex: 'operator',
      width: '14%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item name={[record.name, 'operator']} rules={[COMPULSORY_FIELD_VALIDATOR]}>
          <AutoDisabledSelect>
            {Object.values(OPERATORS).map(operator => (
              <Select.Option key={operator} value={operator}>
                {operator}
              </Select.Option>
            ))}
          </AutoDisabledSelect>
        </Form.Item>
      )
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: '43%',
      render: (_: unknown, record: FormListFieldData) => {
        const formLength = form.getFieldValue('selectors').length
        return (
          <>
            <Form.Item name={[record.name, 'value']} rules={[COMPULSORY_FIELD_VALIDATOR]}>
              <AutoDisabledSelect mode='tags' tokenSeparators={[',']} />
            </Form.Item>
            {formLength === record.name + 1 && (
              <Hint>Separate values with commas (AA,BB). Don&apos;t enter quotes(&quot;&quot;) </Hint>
            )}
          </>
        )
      }
    }
  ]

  const notice = <>Only the following Components will be affected by Assignment Policy: {bromoComponent}</>
  const initialAssignmentPolicies = scheduler?.assignment_policies
  React.useEffect(() => {
    form.setFieldsValue({ selectors: undefined, unique_key: undefined, max_instances: undefined })
    if (initialAssignmentPolicies) {
      const agentSelectors = find(initialAssignmentPolicies, ['name', 'AGENT_SELECTORS'])
      const agentSelectorsParameters = agentSelectors?.parameters
      if (agentSelectorsParameters && 'selectors' in agentSelectorsParameters) {
        const selectorArray = agentSelectorsParameters?.selectors?.map((selector: ISelector) => {
          const { key, operator, value, values } = selector
          return {
            key,
            operator,
            value: value ? [value] : values
          }
        })
        form.setFieldsValue({ selectors: selectorArray })
      }

      const maxPerUniqueKey = find(initialAssignmentPolicies, ['name', 'MAX_PER_UNIQUE_KEY'])
      const maxPerUniqueKeyParameters = maxPerUniqueKey?.parameters
      if (maxPerUniqueKeyParameters && 'unique_key' in maxPerUniqueKeyParameters) {
        const uniqueKey = maxPerUniqueKeyParameters?.unique_key
        const maxInstance = maxPerUniqueKeyParameters?.max_instances
        form.setFieldsValue({ unique_key: uniqueKey, max_instances: maxInstance })
      }
    }
    dispatchers.updateDeployConfigForms({ [FORM_TYPE.ASSIGNMENT_POLICIES]: form })
    dispatchers.updateErrors(FORM_TYPE.ASSIGNMENT_POLICIES)
  }, [dispatchers, form, initialAssignmentPolicies])

  return (
    <Form form={form} onFieldsChange={() => dispatchers.updateErrors(FORM_TYPE.ASSIGNMENT_POLICIES)}>
      <SectionWrapper title='Assignment Policies' notice={notice} anchorKey={FORM_TYPE.ASSIGNMENT_POLICIES}>
        <RowFormField rowKey='Status' hasBackground={false}>
          <AutoDisabledSwitch onChange={checked => setStatus(checked)} checked={status} />
        </RowFormField>
        {status ? (
          <>
            <RowFormField rowKey='Agent Selector' tooltip='Schedule instance to specific mesos-agents / kube-worker'>
              <Form.List name='selectors'>
                {(fields, { add, remove }) => (
                  <TableFormList
                    dataColumns={dataColumns}
                    dataSource={fields}
                    onAdd={add}
                    onRemove={remove}
                    formType={FORM_TYPE.ASSIGNMENT_POLICIES}
                  />
                )}
              </Form.List>
            </RowFormField>
            <RowFormField rowKey='Max Per Unique Key' tooltip='Max instance count in every mesos-agent / kube-worker'>
              <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 24 }} name={['unique_key']} label='unique_key'>
                <AutoDisabledInput />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 4 }}
                name={['max_instances']}
                rules={[
                  {
                    pattern: NON_NEGATIVE_NUMBER,
                    message: 'Please input a non-negative number'
                  }
                ]}
                label='max_instances'
                normalize={value => normalizeNumber(value)}
              >
                <AutoDisabledInput />
              </Form.Item>
            </RowFormField>
          </>
        ) : null}
      </SectionWrapper>
    </Form>
  )
}

export default AssignmentPolicy
