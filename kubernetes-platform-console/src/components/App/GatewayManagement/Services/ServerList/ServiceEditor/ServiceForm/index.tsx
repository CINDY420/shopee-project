import React from 'react'
import { Input, Checkbox, Button, Select } from 'infrad'
import { FormInstance } from 'infrad/lib/form'
import { DeleteOutlined, PlusOutlined } from 'infra-design-icons'

import { useFormStatus } from 'hooks/useFormStatus'
import {
  LOWER_WILDCARD_WORD,
  START_WITH_LOWER_ALPHA_NUMERIC,
  SELECTOR_WILDCARD_WORD,
  WILDCARD_SUFFIX,
  END_WITH_ALPHA_NUMERIC,
  START_WITH_LOWER_ALPHA,
  END_WITH_LOWER_ALPHA_NUMERIC,
  ONLY_LOWER_WORD,
  formRuleMessage
} from 'helpers/validate'
import { IIUpdateServicePlayLoad } from 'swagger-api/v3/models'

import CustomInput from './CustomInput'

import { VerticalDivider, HorizontalDivider } from 'common-styles/divider'
import { StyledForm as Form } from 'common-styles/form'
import { FormRoot, ClusterIPWrapper, ListWrapper, ItemWrapper, StyledListItem } from './style'

interface IServiceFormProps {
  isEdit?: boolean
  form: FormInstance
  info?: {
    envs: string[]
    cids: string[]
    clusters: string[]
    types?: string[]
  }
  currentService?: IIUpdateServicePlayLoad // TODO
  ref?: any
  onChangeSubmitDisabled?: (disabled: boolean) => void
  onFormFieldChange?: (fields: []) => void
}

interface IPorts {
  port: undefined | number
  targetPort: undefined | number | string
  protocol: undefined | string
  name?: undefined | string
}

const formItemLayout = {
  labelCol: {
    span: 24
  },
  wrapperCol: {
    span: 24
  }
}

const ListItemLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 17
  }
}

const selectCommonOptions: {
  [key: string]: any
  mode: 'multiple' | 'tags'
} = {
  allowClear: true,
  showArrow: true,
  mode: 'multiple',
  placeholder: 'Select...',
  style: { width: '100%' }
}

const Option = Select.Option

const shouldUpdate = (prevValues, currentValues) => prevValues.type !== currentValues.type

const protocolList = ['TCP', 'UDP']

const commonRules = [
  { pattern: START_WITH_LOWER_ALPHA_NUMERIC, message: formRuleMessage.START_WITH_LOWER_ALPHA_NUMERIC },
  { pattern: END_WITH_LOWER_ALPHA_NUMERIC, message: formRuleMessage.END_WITH_LOWER_ALPHA_NUMERIC },
  { pattern: ONLY_LOWER_WORD, message: formRuleMessage.ONLY_LOWER_WORD },
  { max: 31, message: formRuleMessage.MAX_LENGTH_31 },
  { min: 2, message: formRuleMessage.MIN_LENGTH }
]

const initialValues = {
  ports: [
    {
      port: undefined,
      targetPort: undefined,
      protocol: undefined,
      name: undefined
    }
  ],
  selector: [
    {
      key: undefined,
      value: undefined
    }
  ]
}

const renderSelect = (list: string[] = [], options: { [key: string]: any } = {}): React.ReactElement => {
  return (
    <Select {...selectCommonOptions} {...options}>
      {list.map(item => (
        <Option key={item} value={item}>
          {item}
        </Option>
      ))}
    </Select>
  )
}

const AddButtonStyled = {
  border: '1px dashed #1890FF',
  color: '#2673DD'
}

const validatePorts = (ports: IPorts[]) => {
  const list = []
  let errors = []

  ports.forEach((item: IPorts = { port: undefined, targetPort: undefined, protocol: undefined, name: undefined }) => {
    const { port, targetPort, protocol, name } = item
    const isExisted = port && targetPort && protocol

    if (isExisted) {
      const key = `${port}-${targetPort}-${protocol}`

      if (list.includes(key)) {
        errors = ['Port, Target Port, Protocol cannot be exactly the same.']

        return list
      } else {
        list.push(key)
      }
    }

    if (name) {
      if (list.includes(name)) {
        errors = ['name cannot be exactly the same.']

        return list
      } else {
        list.push(name)
      }
    }
  })

  return errors
}

const validateWildcard = async (rule: RegExp, value: string, errorMessage: string) => {
  if (value) {
    const newValue = value.replace(/@(cid|env|domain_cid_suffix|domain_env_flag)/g, 'name')
    const result = rule.test(newValue)

    if (!result) {
      return Promise.reject(errorMessage)
    }

    return Promise.resolve()
  }
}

const selectorRules = [
  // { pattern: START_WITH_ALPHA_NUMERIC, message: formRuleMessage.START_WITH_ALPHA_NUMERIC },
  { pattern: END_WITH_ALPHA_NUMERIC, message: formRuleMessage.END_WITH_ALPHA_NUMERIC },
  { pattern: WILDCARD_SUFFIX, message: formRuleMessage.WILDCARD_SUFFIX },
  { max: 63, message: formRuleMessage.MAX_LENGTH_63 },
  { min: 2, message: formRuleMessage.MIN_LENGTH },
  {
    validator: async (rule, value) =>
      validateWildcard(SELECTOR_WILDCARD_WORD, value, formRuleMessage.SELECTOR_WILDCARD_WORD)
  }
]

const ServiceForm: React.FC<IServiceFormProps> = ({
  isEdit,
  form,
  info,
  onChangeSubmitDisabled,
  currentService,
  onFormFieldChange
}) => {
  const { getFieldValue, setFieldsValue, setFields } = form
  const { envs = [], cids = [], clusters = [], types = ['ClusterIP', 'ExternalName'] } = info || {}
  const [formStatus, getFormStatus] = useFormStatus(form)
  const { status } = formStatus

  const handleFieldsChange = async (changedFields, allFields) => {
    const length = changedFields.length

    if (length === 1) {
      const field = changedFields[0]
      const name = field.name
      const key = name[0]

      if (key === 'ports') {
        const ports = getFieldValue(key)
        const errors = validatePorts(ports)

        setFields([
          {
            name,
            errors: errors
          }
        ])

        const nameLength = name.length

        if (nameLength === 1) {
          await getFormStatus(changedFields, allFields)
        }
      }

      // FIXME Cause a second refresh of the form
      await getFormStatus(changedFields, allFields)

      if (key === 'env' || key === 'cid') {
        onFormFieldChange(changedFields)
      }
    }
  }

  React.useEffect(() => {
    onChangeSubmitDisabled(!status)
  }, [status, onChangeSubmitDisabled])

  React.useEffect(() => {
    if (isEdit && currentService) {
      const { selector, ports } = currentService
      currentService.selector = selector.length ? selector : initialValues.selector
      currentService.ports = ports.length ? ports : initialValues.ports
      setFieldsValue(currentService)
    }
  }, [isEdit, currentService, setFieldsValue])

  return (
    <FormRoot>
      <Form
        form={form}
        colon={false}
        {...formItemLayout}
        onFieldsChange={handleFieldsChange}
        initialValues={isEdit ? currentService : initialValues}
      >
        <Form.Item
          label='Prefix'
          name='prefix'
          rules={[
            { required: true, message: 'Please input prefix' },
            ...commonRules,
            { pattern: START_WITH_LOWER_ALPHA, message: formRuleMessage.START_WITH_LOWER_ALPHA }
          ]}
          validateFirst={true}
          extra='Full service name will be called ’Prefix-Env-CID‘. Multiple services will be created when multiple Envs or CIDs are chosen.'
        >
          <Input placeholder='Input...' autoFocus disabled={isEdit} />
        </Form.Item>
        <Form.Item label='Env' name='env' rules={[{ type: 'array', required: true, message: 'Please select env' }]}>
          {renderSelect(envs, { disabled: isEdit })}
        </Form.Item>
        <Form.Item label='CID' name='cid' rules={[{ type: 'array', required: true, message: 'Please select cid' }]}>
          {renderSelect(cids, { disabled: isEdit })}
        </Form.Item>
        {isEdit ? (
          <Form.Item label='Cluster' name='cluster' rules={[{ required: true, message: 'Please input cluster' }]}>
            <Input placeholder='Input...' disabled={isEdit} />
          </Form.Item>
        ) : (
          <Form.Item
            label='Cluster'
            name='cluster'
            rules={[{ type: 'array', required: true, message: 'Please select cluster' }]}
          >
            {renderSelect(clusters, { disabled: isEdit })}
          </Form.Item>
        )}
        <Form.Item label='Type' name='type' rules={[{ required: true, message: 'Please select type' }]}>
          {renderSelect(types, { mode: '' })}
        </Form.Item>
        <Form.Item shouldUpdate={shouldUpdate} noStyle>
          {({ getFieldValue }) => {
            return (
              getFieldValue('type') === 'ExternalName' && (
                <Form.Item
                  label='External Name'
                  name='externalName'
                  rules={[
                    { required: true, message: 'Please select externalName' },
                    {
                      type: 'string',
                      min: 2,
                      max: 127,
                      message: 'Must be no less than 2 character. Must be less than 127 character.'
                    },
                    { pattern: WILDCARD_SUFFIX, message: formRuleMessage.WILDCARD_SUFFIX },
                    {
                      validator: async (rule, value) =>
                        validateWildcard(LOWER_WILDCARD_WORD, value, formRuleMessage.LOWER_WILDCARD_WORD)
                    }
                  ]}
                  validateFirst={true}
                  extra='Use variables started with @.'
                >
                  <CustomInput />
                </Form.Item>
              )
            )
          }}
        </Form.Item>
        <Form.Item shouldUpdate={shouldUpdate} noStyle>
          {({ getFieldValue }) => {
            return (
              getFieldValue('type') === 'ClusterIP' && (
                <ClusterIPWrapper>
                  <Form.Item label='Cluster IP'>
                    <Form.Item label='' name='clusterIp' valuePropName='checked'>
                      <Checkbox disabled={isEdit && !currentService.externalName}>Allocate ClusterIP</Checkbox>
                    </Form.Item>
                    <Form.List name='ports'>
                      {(fields, { add, remove }) => {
                        return (
                          <Form.Item label='Ports' required {...formItemLayout}>
                            {fields.map((field, index) => (
                              <React.Fragment key={field.fieldKey + index}>
                                <ListWrapper key={field.fieldKey + index}>
                                  <ItemWrapper>
                                    <StyledListItem
                                      {...ListItemLayout}
                                      label='Port'
                                      labelAlign='right'
                                      name={[field.name, 'port']}
                                      fieldKey={[field.fieldKey, 'port']}
                                      rules={[
                                        { required: true, message: 'Please input port' },
                                        {
                                          validator: async (rule, value) => {
                                            const result = Number(value)

                                            if (isNaN(result) || result < 1 || result > 65535) {
                                              const error = 'Please input targetPort 1-65535'

                                              return Promise.reject(error)
                                            }

                                            return Promise.resolve()
                                          }
                                        }
                                      ]}
                                      validateFirst={true}
                                    >
                                      <Input placeholder='Input...' />
                                    </StyledListItem>
                                    <StyledListItem
                                      {...ListItemLayout}
                                      label='Target Port'
                                      labelAlign='right'
                                      name={[field.name, 'targetPort']}
                                      fieldKey={[field.fieldKey, 'targetPort']}
                                      rules={[
                                        { required: true, message: 'Please input targetPort' },
                                        {
                                          validator: async (rule, value) => {
                                            const result = Number(value)
                                            const max = 15
                                            let error = null

                                            if (isNaN(result)) {
                                              for (let i = 0; i < commonRules.length; i++) {
                                                const item = commonRules[i]

                                                for (const key in item) {
                                                  const length = value.length

                                                  switch (key) {
                                                    case 'pattern':
                                                      if (!item.pattern.test(value)) {
                                                        error = item.message
                                                      }
                                                      break
                                                    case 'min':
                                                      if (length < item.min) {
                                                        error = item.message
                                                      }
                                                      break
                                                    case 'max':
                                                      if (length > max) {
                                                        error = item.message
                                                      }
                                                      break
                                                    default:
                                                      break
                                                  }
                                                }
                                              }
                                            } else if (result < 1 || result > 65535) {
                                              error = 'Please input targetPort 1-65535'
                                            }

                                            return error ? Promise.reject(error) : Promise.resolve()
                                          }
                                        }
                                      ]}
                                      validateFirst={true}
                                    >
                                      <Input placeholder='Input...' />
                                    </StyledListItem>
                                    <StyledListItem
                                      {...ListItemLayout}
                                      label='Protocol'
                                      labelAlign='right'
                                      name={[field.name, 'protocol']}
                                      fieldKey={[field.fieldKey, 'protocol']}
                                      rules={[{ required: true, message: 'Please select protocol' }]}
                                      validateFirst={true}
                                    >
                                      {renderSelect(protocolList, { mode: '' })}
                                    </StyledListItem>
                                    <StyledListItem
                                      {...ListItemLayout}
                                      label='Name'
                                      labelAlign='right'
                                      name={[field.name, 'name']}
                                      fieldKey={[field.fieldKey, 'name']}
                                      rules={[
                                        { required: true, message: 'Please input name' },
                                        {
                                          pattern: START_WITH_LOWER_ALPHA_NUMERIC,
                                          message: formRuleMessage.START_WITH_LOWER_ALPHA_NUMERIC
                                        },
                                        {
                                          pattern: END_WITH_LOWER_ALPHA_NUMERIC,
                                          message: formRuleMessage.END_WITH_LOWER_ALPHA_NUMERIC
                                        },
                                        { pattern: ONLY_LOWER_WORD, message: formRuleMessage.ONLY_LOWER_WORD },
                                        { max: 63, message: formRuleMessage.MAX_LENGTH_63 },
                                        { min: 2, message: formRuleMessage.MIN_LENGTH }
                                      ]}
                                      validateFirst={true}
                                      style={{ marginBottom: 0 }}
                                    >
                                      <Input placeholder='Input...' />
                                    </StyledListItem>
                                  </ItemWrapper>
                                  <HorizontalDivider size='64px' />
                                  {fields.length > 1 && (
                                    <Button
                                      shape='circle'
                                      icon={<DeleteOutlined />}
                                      onClick={() => remove(field.name)}
                                    />
                                  )}
                                </ListWrapper>
                                <VerticalDivider size='8px' />
                              </React.Fragment>
                            ))}
                            <VerticalDivider size='8px' />
                            <Button
                              type='dashed'
                              icon={<PlusOutlined />}
                              onClick={() => add()}
                              block
                              style={AddButtonStyled}
                            >
                              Add
                            </Button>
                          </Form.Item>
                        )
                      }}
                    </Form.List>
                    <Form.List name='selector'>
                      {(fields, { add, remove }) => {
                        return (
                          <Form.Item label='Selector' {...formItemLayout}>
                            <Form.Item extra='Use variables started with @.' style={{ marginBottom: 0 }}>
                              {fields.map((field, index) => (
                                <React.Fragment key={field.fieldKey + index}>
                                  <ListWrapper key={field.fieldKey + index}>
                                    <ItemWrapper>
                                      <StyledListItem
                                        {...ListItemLayout}
                                        label='Key'
                                        labelAlign='right'
                                        name={[field.name, 'key']}
                                        fieldKey={[field.fieldKey, 'key']}
                                        rules={selectorRules}
                                        validateFirst={true}
                                      >
                                        <CustomInput />
                                      </StyledListItem>
                                      <StyledListItem
                                        {...ListItemLayout}
                                        label='Value'
                                        labelAlign='right'
                                        name={[field.name, 'value']}
                                        fieldKey={[field.fieldKey, 'value']}
                                        rules={selectorRules}
                                        validateFirst={true}
                                        style={{ marginBottom: 0 }}
                                      >
                                        <CustomInput />
                                      </StyledListItem>
                                    </ItemWrapper>
                                    <HorizontalDivider size='64px' />
                                    {fields.length > 1 && (
                                      <Button
                                        shape='circle'
                                        icon={<DeleteOutlined />}
                                        onClick={() => remove(field.name)}
                                      />
                                    )}
                                  </ListWrapper>
                                  <VerticalDivider size='8px' />
                                </React.Fragment>
                              ))}
                            </Form.Item>
                            <VerticalDivider size='8px' />
                            <Button
                              type='dashed'
                              icon={<PlusOutlined />}
                              onClick={() => add()}
                              block
                              style={AddButtonStyled}
                            >
                              Add
                            </Button>
                          </Form.Item>
                        )
                      }}
                    </Form.List>
                  </Form.Item>
                </ClusterIPWrapper>
              )
            )
          }}
        </Form.Item>
      </Form>
    </FormRoot>
  )
}

export default ServiceForm
