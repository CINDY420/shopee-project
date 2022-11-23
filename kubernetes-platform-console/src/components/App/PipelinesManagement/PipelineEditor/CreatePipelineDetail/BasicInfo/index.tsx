import React from 'react'

import { StyledConfig, StyledForm, StyledTitle } from './style'
import { Input, Select } from 'infrad'
import { formRuleMessage, GIT_REPO_CHECK, ONLY_LOWER_ALPHA_NUMERIC, START_WITH_LOWER_ALPHA } from 'helpers/validate'
import { IConfig, IEngine } from 'api/types/application/pipeline'
import { FormInstance } from 'infrad/lib/form'
import K8sTemplate from './K8sTemlate'
import NonK8sTemplate from './NonK8sTemplate'
import { K8S_TEMPLATE, NON_K8S_TEMPLATE, PIPELINE_TEMPLATE } from 'constants/pipeline'
import CidSelector from './CidSelector'

const DEFAULT_ENGINE = 'jenkins-sz-nonlive'
const { Item } = StyledForm

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

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 24 }
}

const Option = Select.Option

const renderSelect = (list: string[] = [], options: { [key: string]: any } = {}, width: number): React.ReactElement => {
  return (
    <Select {...selectCommonOptions} {...options} style={{ width: width }}>
      {list.map(item => (
        <Option key={item} value={item}>
          {item}
        </Option>
      ))}
    </Select>
  )
}

const updateDetailConfig = (form: FormInstance, deployDefinition: string) => {
  const newDetailConfig = `@Library("deploy-shared-library") _
import com.shopee.*
env.DEPLOY_DEFINITION = "${deployDefinition || ''}"
env.GIT_REPO = "${form.getFieldValue(['config', 'gitRepo']) || ''}"

new stdPipeline().execute()`
  form.setFieldsValue({ config: { detailConfig: newDetailConfig } })
}
interface IBasicInfoProps {
  isEdit: boolean
  env: string
  module: string
  project: string
  engine: string
  config: IConfig
  selectedCid: string[]
  selectedEnv: string[]
  engineList: IEngine[]
  clusterList: string[]
  cidList: string[]
  envList: string[]
  tenantName: string
  onEnvListChange: (arg: string[]) => void
  template: string
  onTemplateChange: (arg: string) => void
  form: FormInstance
}

const BasicInfo: React.FC<IBasicInfoProps> = ({
  isEdit,
  project,
  module,
  env,
  engine,
  config,
  selectedCid,
  selectedEnv,
  engineList,
  clusterList,
  cidList,
  envList,
  tenantName,
  onEnvListChange,
  template,
  onTemplateChange,
  form
}) => {
  const handleGitRepoChange = e => {
    const inputValue = e.target.value
    const fieldData = form.getFieldsValue()
    const { parameters } = fieldData
    const newParameters = parameters.map(each => {
      return each.type === 'Git-Branch' ? { ...each, value: inputValue } : each
    })
    form.setFieldsValue({ parameters: newParameters })

    const deployDefinition = `deploy/${form.getFieldValue(['basicInfo', 'module'])}.json`
    updateDetailConfig(form, deployDefinition)
  }
  const handleTemplateChange = selectedTemplate => {
    onTemplateChange(selectedTemplate)
  }
  const handleEnvChange = currentSelectedEnvs => {
    onEnvListChange([...currentSelectedEnvs])
  }
  const handleModuleChange = e => {
    const deployDefinition = `deploy/${e.target.value}.json`
    form.setFieldsValue({ config: { deployDefinition: deployDefinition } })
    updateDetailConfig(form, deployDefinition)
  }

  return (
    <StyledForm form={form} {...layout}>
      <StyledTitle>Basic Info</StyledTitle>
      <Item label='Tenant' name={['config', 'tenantName']} colon={false} initialValue={tenantName} required={!isEdit}>
        <Input style={{ width: 240 }} disabled={true} />
      </Item>
      <Item
        label='Project'
        name={['basicInfo', 'project']}
        colon={false}
        rules={[
          {
            required: !isEdit,
            message: 'Please input project name'
          },
          {
            pattern: START_WITH_LOWER_ALPHA,
            message: 'Must start with lowercase alpha a-z'
          },
          {
            pattern: ONLY_LOWER_ALPHA_NUMERIC,
            message: 'Can only contain lowercase alphanumeric(a-z0-9)'
          },
          {
            max: 31,
            message: 'Must be less than or equal to 31 characters'
          },
          {
            min: 2,
            message: 'Must be more than 1 character'
          }
        ]}
        initialValue={project}
      >
        <Input style={{ width: 240 }} disabled={isEdit} />
      </Item>

      <Item
        label='Module'
        name={['basicInfo', 'module']}
        colon={false}
        rules={[
          { required: !isEdit, message: 'Please input module name' },
          {
            pattern: START_WITH_LOWER_ALPHA,
            message: formRuleMessage.START_WITH_LOWER_ALPHA
          },
          {
            pattern: ONLY_LOWER_ALPHA_NUMERIC,
            message: formRuleMessage.ONLY_LOWER_ALPHA_NUMERIC
          },
          {
            max: 31,
            message: formRuleMessage.MAX_LENGTH_31
          },
          {
            min: 2,
            message: formRuleMessage.MIN_LENGTH
          }
        ]}
        initialValue={module || ''}
      >
        <Input style={{ width: 240 }} disabled={isEdit} onChange={handleModuleChange} />
      </Item>

      <Item
        label='ENV'
        colon={false}
        name={['basicInfo', 'envs']}
        rules={[{ required: !isEdit, type: 'array', message: 'Please select ENV' }]}
        initialValue={isEdit ? env?.split(',') : undefined}
      >
        {renderSelect(envList, { disabled: isEdit, onChange: handleEnvChange }, 480)}
      </Item>

      {selectedEnv.map(env => (
        <Item
          key={env}
          label={`Engine (${env})`}
          name={['basicInfo', 'engines', env]}
          colon={false}
          rules={[{ required: !isEdit }]}
          initialValue={isEdit ? engine || DEFAULT_ENGINE : DEFAULT_ENGINE}
        >
          <Select style={{ width: 400 }} showSearch disabled={isEdit}>
            {engineList.map(engine => (
              <Option key={engine.name} value={engine.name}>
                {engine.name}
              </Option>
            ))}
          </Select>
        </Item>
      ))}

      <StyledConfig>Config</StyledConfig>
      <Item
        label='Pipeline Template'
        name={['config', 'pipelineTemplate']}
        rules={[{ required: true, message: 'Please select Pipeline Template' }]}
        colon={false}
        initialValue={isEdit ? config.PipelineTemplate || K8S_TEMPLATE : K8S_TEMPLATE}
      >
        <Select style={{ width: 400 }} onSelect={handleTemplateChange} showSearch>
          {PIPELINE_TEMPLATE.map(template => (
            <Option key={template} value={template}>
              {template}
            </Option>
          ))}
        </Select>
      </Item>
      <Item
        label='Git Repo'
        name={['config', 'gitRepo']}
        colon={false}
        initialValue={isEdit ? config.GIT_REPO || '' : ''}
        rules={[
          {
            pattern: GIT_REPO_CHECK,
            message: 'Invalid Git Repository URL'
          },
          {
            required: true,
            message: 'Please input a value'
          }
        ]}
      >
        <Input style={{ width: 480 }} placeholder='gitlab@git.garena.com:shopee/' onChange={handleGitRepoChange} />
      </Item>

      <Item label='CID' colon={false} required={true}>
        <CidSelector form={form} defaultCids={selectedCid || cidList} cids={cidList} />
      </Item>
      {template === K8S_TEMPLATE && (
        <K8sTemplate isEdit={isEdit} config={config} selectedEnvList={selectedEnv} clusterList={clusterList} />
      )}
      {template === NON_K8S_TEMPLATE && <NonK8sTemplate isEdit={isEdit} detailConfig={config?.DetailConfig} />}
      {/* {template === CUSTOM_TEMPLATE && <CustomTemplate isEdit={isEdit} config={config} />} */}
    </StyledForm>
  )
}

export default BasicInfo
