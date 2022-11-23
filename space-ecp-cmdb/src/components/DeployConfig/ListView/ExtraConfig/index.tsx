import { Form, Select } from 'infrad'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import React from 'react'
import {
  DeployConfigContext,
  ExtraConfigKeys,
  FormType,
  getDispatchers,
} from 'src/components/DeployConfig/useDeployConfigContext'
import RowFormField from 'src/components/DeployConfig/ListView/Common/RowFormField'
import SectionWrapper from 'src/components/DeployConfig/ListView/Common/SectionWrapper'
import TableFormList from 'src/components/DeployConfig/ListView/Common/TableFormList'
import {
  AutoDisabledInput,
  AutoDisabledSelect,
} from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import { fetch } from 'src/rapper'

export interface IExtraConfigsFormType {
  key: ExtraConfigKeys
  value: string | boolean | number
}
const COMPULSORY_FIELD_VALIDATOR = { required: true, message: 'Please fill in your expectations' }
const ExtraConfig: React.FC = () => {
  const [form] = Form.useForm()
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { newDeployConfig, componentType, nameMap, env } = state
  const displayNameArray = componentType?.nonBromo?.map((name) => nameMap[name])
  const nonBromoComponent = displayNameArray?.join(', ')
  const { jenkins_config } = newDeployConfig
  const [extraConfigs, setExtraConfigs] = React.useState<string[]>()
  const notice = (
    <>Only the following Components will be affected by Extra Config: {nonBromoComponent}</>
  )

  const getExtraConfigs = React.useCallback(async () => {
    if (env) {
      const { extraConfigs } = await fetch['GET/api/ecp-cmdb/deploy-config/extra-configs']()
      setExtraConfigs(extraConfigs)
    }
  }, [env])

  React.useEffect(() => {
    void getExtraConfigs()
  }, [getExtraConfigs])

  React.useEffect(() => {
    try {
      const extraConfigFormValues = Object.entries(JSON.parse(jenkins_config)).map(
        ([key, value]) => ({ key, value }),
      )
      form.setFieldsValue({ extraConfig: extraConfigFormValues })
    } catch {
      form.setFieldsValue({ extraConfig: undefined })
    }
    dispatchers.updateDeployConfigForms({ [FormType.EXTRA_CONFIG]: form })
    dispatchers.updateErrors(FormType.EXTRA_CONFIG)
  }, [dispatchers, jenkins_config, form])

  const dataColumns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      width: '40%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item name={[record.name, 'key']} rules={[COMPULSORY_FIELD_VALIDATOR]}>
          <AutoDisabledSelect allowClear showArrow>
            {extraConfigs?.map((key) => (
              <Select.Option key={key} value={key}>
                {key}
              </Select.Option>
            ))}
          </AutoDisabledSelect>
        </Form.Item>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '60%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item name={[record.name, 'value']} rules={[COMPULSORY_FIELD_VALIDATOR]}>
          <AutoDisabledInput />
        </Form.Item>
      ),
    },
  ]
  return (
    <Form form={form} onFieldsChange={() => dispatchers.updateErrors(FormType.EXTRA_CONFIG)}>
      <SectionWrapper title="Extra Config" notice={notice} anchorKey={FormType.EXTRA_CONFIG}>
        <RowFormField>
          <Form.List name="extraConfig">
            {(fields, { add, remove }) => (
              <TableFormList
                dataColumns={dataColumns}
                dataSource={fields}
                onAdd={add}
                onRemove={remove}
                addButtonText="Add New Item"
                formType={FormType.EXTRA_CONFIG}
              />
            )}
          </Form.List>
        </RowFormField>
      </SectionWrapper>
    </Form>
  )
}

export default ExtraConfig
