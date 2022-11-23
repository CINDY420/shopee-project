import React from 'react'

import { StyledForm, StyledTitle, ParametersWrapper, StyledInput, StyledSelect } from './style'
import { Input, Select, Button, Space } from 'infrad'
import DeleteSvg from 'assets/deleteOutline.svg'
import { PlusOutlined } from 'infra-design-icons'
import { IParameterDefinition } from 'api/types/application/pipeline'
import { FormInstance } from 'infrad/lib/form'
import { K8S_TEMPLATE } from 'constants/pipeline'

const { Item } = StyledForm
const fixedKeyGroup = [
  'FROM_ID',
  'FROM_BRANCH',
  'FROM_TYPE',
  'FROM_USER_NAME',
  'DEPLOY_CIDS',
  'FTE_ENABLE',
  'K8S_CANARY_ENABLE'
]
const typeOption = [
  { label: 'Input', value: 'string' },
  { label: 'Boolean', value: 'bool' },
  { label: 'Select', value: 'choice' }
]

enum TYPES {
  BOOL = 'bool',
  STRING = 'string',
  GIT_BRANCH = 'Git-Branch',
  CHOICE = 'choice'
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 24 }
}

interface IParametersProps {
  isEdit: boolean
  gitRepo: string
  parameterDefinitions?: IParameterDefinition[]
  template: string
  form: FormInstance
}

interface IDefaultParametersProps {
  key: string
  type: string
  placeholder?: string
  value: string | boolean
  disable?: boolean
  choices?: string[]
  canBeModified?: boolean
}

const defaultParameters: IDefaultParametersProps[] = [
  {
    key: 'FROM_USER_NAME',
    type: 'string',
    placeholder: 'Input default value',
    value: ''
  },
  {
    key: 'FROM_TYPE',
    type: 'string',
    placeholder: 'Input default value',
    value: ''
  },
  {
    key: 'FROM_ID',
    type: 'string',
    placeholder: 'Input default value',
    value: ''
  },
  {
    key: 'FROM_BRANCH',
    type: 'Git-Branch',
    placeholder: 'gitlab@git.garena.com:shopee/',
    value: '',
    disable: true
  },
  {
    key: 'DEPLOY_CIDS',
    type: 'string',
    value: 'SG,VN,ID,TH,MY,PH,TW,CN,BR,XX,MX',
    disable: true
  },
  {
    key: 'FTE_ENABLE',
    type: 'bool',
    value: false
  },
  {
    key: 'K8S_CANARY_ENABLE',
    type: 'bool',
    value: false
  }
]

const boolItemComponent = (name: number) => (
  <Item name={[`${name}`, 'value']}>
    <div style={{ width: 480 }}></div>
  </Item>
)

const inputItemComponent = (name: number, currentParameters: IDefaultParametersProps[]) => (
  <Item name={[`${name}`, 'value']}>
    <Input
      style={{ width: 480 }}
      placeholder={currentParameters[name]?.placeholder}
      disabled={currentParameters[name]?.disable}
    />
  </Item>
)

const choiceItemComponent = (name: number, fieldKey: number) => (
  <>
    <Item
      name={[name, 'value']}
      fieldKey={[fieldKey, 'value']}
      extra={<div style={{ fontSize: 14 }}>Separate multiple name with commas(,). Example: BR, IN</div>}
      rules={[
        {
          required: true,
          message: 'Please Input a value'
        }
      ]}
    >
      <Select mode='tags' style={{ width: 480 }} tokenSeparators={[',']} />
    </Item>
  </>
)

const Parameter: React.FC<IParametersProps> = ({ isEdit, gitRepo, parameterDefinitions, template, form }) => {
  const [currentParameters, setParameters] = React.useState(defaultParameters)

  React.useEffect(() => {
    if (isEdit) {
      const parameters = parameterDefinitions.map(parameter => {
        return {
          key: parameter.name,
          value: parameter.type === 'listGitBranches' ? gitRepo : parameter.value,
          type: parameter.type === 'listGitBranches' ? 'Git-Branch' : parameter.type,
          disable: parameter.name === 'DEPLOY_CIDS' || parameter.name === 'FROM_BRANCH',
          chocies: parameter.choices,
          canBeModified: !fixedKeyGroup.includes(parameter.name)
        }
      })
      setParameters(parameters)
    } else {
      template === K8S_TEMPLATE
        ? setParameters([...defaultParameters])
        : setParameters([...defaultParameters].slice(0, 5))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template])

  React.useEffect(() => {
    form.setFieldsValue({ parameters: currentParameters })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentParameters])

  const handleSelectType = (key: number, type: string) => {
    const fields = form.getFieldsValue()
    const { parameters } = fields
    Object.assign(parameters[key], { type: type })
    Object.assign(parameters[key], { value: undefined })
    setParameters([...parameters])
  }

  const addNewParameter = (add, newParameter: IDefaultParametersProps) => {
    add(newParameter)
    currentParameters.push(newParameter)
    setParameters([...currentParameters])
  }
  const removeParameter = (remove, index: number) => {
    remove(index)
    currentParameters.splice(index, 1)
    setParameters([...currentParameters])
  }

  return (
    <ParametersWrapper>
      <StyledTitle>Parameter</StyledTitle>
      <StyledForm form={form} {...layout} initialValues={{ parameters: currentParameters }}>
        <StyledForm.List name='parameters'>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey }) => {
                const type = form.getFieldValue(['parameters', name, 'type']) || 'string'
                const typeItemMap = {
                  [TYPES.BOOL]: boolItemComponent(name),
                  [TYPES.STRING]: inputItemComponent(name, currentParameters),
                  [TYPES.GIT_BRANCH]: inputItemComponent(name, currentParameters),
                  [TYPES.CHOICE]: choiceItemComponent(name, fieldKey)
                }
                return (
                  <Space key={key} style={{ display: 'flex' }} align='baseline'>
                    <Item
                      name={[name, 'key']}
                      fieldKey={[fieldKey, 'key']}
                      rules={[{ required: true, message: 'Missing key' }]}
                    >
                      <StyledInput style={{ width: 200 }} disabled={!currentParameters[name]?.canBeModified} />
                    </Item>
                    <Item
                      name={[name, 'type']}
                      fieldKey={[fieldKey, 'type']}
                      rules={[{ required: true, message: 'Missing type' }]}
                    >
                      <StyledSelect
                        style={{ width: 160 }}
                        options={typeOption}
                        onSelect={value => handleSelectType(name, value)}
                        disabled={!currentParameters[name]?.canBeModified}
                      />
                    </Item>
                    {typeItemMap[type]}
                    <Item>
                      {currentParameters[name]?.canBeModified && (
                        <Button icon={<img src={DeleteSvg} onClick={() => removeParameter(remove, name)} />} />
                      )}
                    </Item>
                  </Space>
                )
              })}
              <Item>
                <Button
                  type='link'
                  style={{ padding: 0 }}
                  onClick={() =>
                    addNewParameter(add, {
                      key: `Template ${fields[fields.length - 1].key + 1}`,
                      type: 'string',
                      value: undefined,
                      canBeModified: true
                    })
                  }
                >
                  <PlusOutlined /> Add Parameter
                </Button>
              </Item>
            </>
          )}
        </StyledForm.List>
      </StyledForm>
    </ParametersWrapper>
  )
}

export default Parameter
