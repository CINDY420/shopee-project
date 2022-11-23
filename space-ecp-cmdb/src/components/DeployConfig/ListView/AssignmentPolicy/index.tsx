import React from 'react'
import { Form, Select } from 'infrad'
import TableFormList from 'src/components/DeployConfig/ListView/Common/TableFormList'
import SectionWrapper from 'src/components/DeployConfig/ListView/Common/SectionWrapper'
import RowFormField from 'src/components/DeployConfig/ListView/Common/RowFormField'
import {
  DeployConfigContext,
  FormType,
  getDispatchers,
} from 'src/components/DeployConfig/useDeployConfigContext'
import { NON_NEGATIVE_NUMBER } from 'src/helpers/validate'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import {
  AutoDisabledInput,
  AutoDisabledSwitch,
  AutoDisabledSelect,
} from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import { find } from 'lodash'
import { normalizeNumber } from 'src/helpers/normalize'
import { CustomStyle } from 'src/components/DeployConfig/ListView/AssignmentPolicy/style'
import { HorizonCenterWrapper } from 'src/common-styles/flexWrapper'

export interface IMaxPerUniqueKey {
  unique_key: string
  max_instances: number
}

interface IFormAgentSelectors {
  selectors: {
    key: string
    operator: string
    value: string | string[]
  }[]
}

export interface ISelector {
  key: string
  operator: string
  value?: string
  values?: string[]
}

export interface IAgentSelectors {
  selectors: ISelector[]
}

export interface IAssignmentPolice {
  parameters: IAgentSelectors | IMaxPerUniqueKey
  name: string
}

export interface IScheduler {
  orchestrator: {}
  assignment_policies: IAssignmentPolice[]
}

const COMPULSORY_FIELD_VALIDATOR = { required: true, message: 'Please fill in your expectations' }
const RANGE_VALIDATOR = {
  min: 1,
  max: 63,
  message: 'Up to 63 characters.',
}
const VALUE_VALIDATOR = {
  pattern: /^[a-zA-Z0-9\.\-\_]*$/,
  message: 'Must only consist of letters, numbers, dashes(-), underscores(_) and dots(.).',
}
const KEY_VALIDATOR = {
  pattern: /^[a-zA-Z0-9\.\/\-\_]*$/,
  message:
    'Must only consist of letters, numbers, dashes(-), underscores(_), slash(/) and dots(.).',
}
enum OPERATORS {
  EQUAL = '==',
  NOT_EQUAL = '!=',
  IN = 'in',
  NOT_IN = 'not in',
  ALMOST_IN = '~in',
  ALMOST_EQUAL = '~=',
}

const ArrayOperators = [OPERATORS.IN, OPERATORS.NOT_IN, OPERATORS.ALMOST_IN]

const isInValid = (value: string) =>
  !value.match(VALUE_VALIDATOR.pattern) ||
  value.length < RANGE_VALIDATOR.min ||
  value.length > RANGE_VALIDATOR.max

const AssignmentPolicy: React.FC = () => {
  const [form] = Form.useForm()
  const status = Form.useWatch(['enable'], form)
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])

  const { newDeployConfig, componentType } = state
  const { scheduler } = newDeployConfig

  const [errorList, setErrorList] = React.useState<Record<number, number[]>>({})
  const handleTagChanged = (rowIndex: number, values: string[]) => {
    const list: number[] = []
    values.forEach((value, errorIndex) => {
      if (isInValid(value)) {
        list.push(errorIndex + 1)
      }
    })
    setErrorList({ ...errorList, [rowIndex + 1]: list })
  }

  const handleOperatorChange = (index: number) => {
    const data = form.getFieldsValue()
    const { selectors } = data
    if (selectors) {
      selectors[index].value = undefined
      form.setFieldsValue({ selectors: [...selectors] })
    }
  }
  const dataColumns = [
    {
      title: 'Key',
      dataIndex: 'key',
      width: '43%',
      ellipsis: true,
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item
          name={[record.name, 'key']}
          validateFirst
          rules={[COMPULSORY_FIELD_VALIDATOR, RANGE_VALIDATOR, KEY_VALIDATOR]}
        >
          <AutoDisabledInput />
        </Form.Item>
      ),
    },
    {
      title: 'Operator',
      dataIndex: 'operator',
      width: '14%',
      ellipsis: true,
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item name={[record.name, 'operator']} rules={[COMPULSORY_FIELD_VALIDATOR]}>
          <AutoDisabledSelect onChange={() => handleOperatorChange(record.name)}>
            {Object.values(OPERATORS).map((operator) => (
              <Select.Option key={operator} value={operator}>
                {operator}
              </Select.Option>
            ))}
          </AutoDisabledSelect>
        </Form.Item>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: '43%',
      ellipsis: true,
      render: (_: unknown, record: FormListFieldData) => {
        const operator: OPERATORS = form.getFieldValue(['selectors', record.name, 'operator'])
        return ArrayOperators.includes(operator) ? (
          <>
            <Form.Item
              name={[record.name, 'value']}
              validateFirst
              rules={[
                COMPULSORY_FIELD_VALIDATOR,
                {
                  validator: (_, values: string[]) => {
                    const inValidValues = values.some(
                      (value) => !value.match(VALUE_VALIDATOR.pattern),
                    )
                    const isOutOfRange = values.some(
                      (value) =>
                        value.length < RANGE_VALIDATOR.min || value.length > RANGE_VALIDATOR.max,
                    )
                    if (inValidValues) {
                      return Promise.reject(VALUE_VALIDATOR.message)
                    }
                    if (isOutOfRange) {
                      return Promise.reject(RANGE_VALIDATOR.message)
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <AutoDisabledSelect
                mode="tags"
                tokenSeparators={[',']}
                onChange={(values: string[]) => handleTagChanged(record.name, values)}
              />
            </Form.Item>
          </>
        ) : (
          <Form.Item
            name={[record.name, 'value']}
            validateFirst
            rules={[COMPULSORY_FIELD_VALIDATOR, RANGE_VALIDATOR, VALUE_VALIDATOR]}
          >
            <AutoDisabledInput
              placeholder={
                ArrayOperators.includes(operator)
                  ? 'Separate values with commas (AA,BB). Don\'t enter quotes("")'
                  : 'Contain letters, numbers, dashes (-), underscores (_), dots (.)'
              }
            />
          </Form.Item>
        )
      },
    },
  ]

  const initialAssignmentPolicies = scheduler?.assignment_policies
  React.useEffect(() => {
    form.setFieldsValue({
      enabled: false,
      selectors: undefined,
      unique_key: undefined,
      max_instances: undefined,
    })
    if (initialAssignmentPolicies?.length > 0 || status) {
      const agentSelectors = find(initialAssignmentPolicies, ['name', 'AGENT_SELECTORS'])
      const agentSelectorsParameters = agentSelectors?.parameters
      form.setFieldsValue({ enable: true })
      if (agentSelectorsParameters && 'selectors' in agentSelectorsParameters) {
        // @ts-expect-error rapper cannot handle complex object type
        const selectorArray = agentSelectorsParameters?.selectors?.map((selector: ISelector) => {
          const { key, operator, value, values } = selector
          return {
            key,
            operator,
            value: value ?? values,
          }
        })
        form.setFieldsValue({ selectors: selectorArray })
      } else {
        form.setFieldsValue({ enable: false })
      }

      const maxPerUniqueKey = find(initialAssignmentPolicies, ['name', 'MAX_PER_UNIQUE_KEY'])
      const maxPerUniqueKeyParameters = maxPerUniqueKey?.parameters
      if (maxPerUniqueKeyParameters && 'unique_key' in maxPerUniqueKeyParameters) {
        // @ts-expect-error rapper cannot handle complex object type
        const uniqueKey = maxPerUniqueKeyParameters?.unique_key
        // @ts-expect-error rapper cannot handle complex object type
        const maxInstance = maxPerUniqueKeyParameters?.max_instances
        form.setFieldsValue({ unique_key: uniqueKey, max_instances: maxInstance })
      }
    } else {
      form.setFieldsValue({ enable: false })
    }
    dispatchers.updateDeployConfigForms({ [FormType.ASSIGNMENT_POLICIES]: form })
    dispatchers.updateErrors(FormType.ASSIGNMENT_POLICIES)
  }, [dispatchers, form, initialAssignmentPolicies])

  const handleRemove = (remove: (index: number | number[]) => void, index: number | number[]) => {
    remove(index)
    const data: IFormAgentSelectors = form.getFieldsValue()
    const { selectors } = data

    const errorList: Record<number, number[]> = {}
    selectors?.forEach((each, index) => {
      const { operator, value } = each
      if (ArrayOperators.includes(operator as OPERATORS) && Array.isArray(value)) {
        const list: number[] = []
        value.forEach((eachValue, errorIndex) => {
          if (isInValid(eachValue)) {
            list.push(errorIndex + 1)
          }
        })
        errorList[index + 1] = list
      }
    })

    setErrorList({ ...errorList })
  }
  return (
    <Form form={form} onFieldsChange={() => dispatchers.updateErrors(FormType.ASSIGNMENT_POLICIES)}>
      <SectionWrapper title="Assignment Policies" anchorKey={FormType.ASSIGNMENT_POLICIES}>
        <RowFormField
          rowKey={
            <HorizonCenterWrapper>
              <div style={{ marginRight: '16px' }}>Status</div>
              <Form.Item name={['enable']} valuePropName="checked" style={{ margin: '1px 0' }}>
                <AutoDisabledSwitch />
              </Form.Item>
            </HorizonCenterWrapper>
          }
          hasBackground={false}
        />

        {status ? (
          <>
            <RowFormField rowKey="Agent Selector" tooltip="Assigning instances to nodes.">
              <Form.List name="selectors">
                {(fields, { add, remove }) => (
                  <CustomStyle $errorList={errorList}>
                    <TableFormList
                      dataColumns={dataColumns}
                      dataSource={fields}
                      onAdd={add}
                      onRemove={(index) => handleRemove(remove, index)}
                      formType={FormType.ASSIGNMENT_POLICIES}
                    />
                  </CustomStyle>
                )}
              </Form.List>
            </RowFormField>
            {componentType.bromo?.length !== 0 && (
              <RowFormField
                rowKey="Max Per Unique Key (Only Bromo Workload will be affected.)"
                tooltip="Max instance count in every mesos-agent / kube-worker"
                width="75%"
              >
                <Form.Item
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 24 }}
                  name={['unique_key']}
                  label="unique_key"
                >
                  <AutoDisabledInput />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 4 }}
                  name={['max_instances']}
                  rules={[
                    {
                      pattern: NON_NEGATIVE_NUMBER,
                      message: 'Please input a non-negative number',
                    },
                  ]}
                  label="max_instances"
                  normalize={(value) => normalizeNumber(value)}
                >
                  <AutoDisabledInput />
                </Form.Item>
              </RowFormField>
            )}
          </>
        ) : null}
      </SectionWrapper>
    </Form>
  )
}

export default AssignmentPolicy
