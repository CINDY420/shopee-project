import { Form, Select } from 'infrad'
import { useRecoilValue } from 'recoil'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import React from 'react'
import {
  DeployConfigContext,
  FORM_TYPE,
  getDispatchers
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import RowFormField from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/RowFormField'
import SectionWrapper from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SectionWrapper'
import TableFormList from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/TableFormList'
import {
  AutoDisabledInput,
  AutoDisabledSelect
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled'
import { deployConfigControllerListExtraConfigs } from 'swagger-api/v1/apis/DeployConfig'
import { selectedApplication } from 'states/applicationState/application'

const COMPULSORY_FIELD_VALIDATOR = { required: true, message: 'Please fill in your expectations' }
const ExtraConfig: React.FC = () => {
  const [form] = Form.useForm()
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { newDeployConfig, componentType, nameMap } = state
  const displayNameArray = componentType?.nonBromo?.map(name => nameMap[name])
  const nonBromoComponent = displayNameArray?.join(', ')
  const { jenkins_config } = newDeployConfig
  const [extraConfigs, setExtraConfigs] = React.useState<string[]>()
  const notice = <>Only the following Components will be affected by Extra Config: {nonBromoComponent}</>

  const application = useRecoilValue(selectedApplication)
  const { tenantId, projectName, name: appName } = application
  const getExtraConfigs = React.useCallback(async () => {
    const { extraConfigs } = await deployConfigControllerListExtraConfigs({
      tenantId,
      appName,
      projectName
    })
    setExtraConfigs(extraConfigs)
  }, [appName, projectName, tenantId])

  React.useEffect(() => {
    getExtraConfigs()
  }, [getExtraConfigs])

  React.useEffect(() => {
    try {
      const extraConfigFormValues = Object.entries(JSON.parse(jenkins_config)).map(([key, value]) => {
        return { key, value }
      })
      form.setFieldsValue({ extraConfig: extraConfigFormValues })
    } catch {
      form.setFieldsValue({ extraConfig: undefined })
    }
    dispatchers.updateDeployConfigForms({ [FORM_TYPE.EXTRA_CONFIG]: form })
    dispatchers.updateErrors(FORM_TYPE.EXTRA_CONFIG)
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
            {extraConfigs?.map(key => (
              <Select.Option key={key} value={key}>
                {key}
              </Select.Option>
            ))}
          </AutoDisabledSelect>
        </Form.Item>
      )
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
      )
    }
  ]
  return (
    <Form form={form} onFieldsChange={() => dispatchers.updateErrors(FORM_TYPE.EXTRA_CONFIG)}>
      <SectionWrapper title='Extra Config' notice={notice} anchorKey={FORM_TYPE.EXTRA_CONFIG}>
        <RowFormField>
          <Form.List name='extraConfig'>
            {(fields, { add, remove }) => (
              <TableFormList
                dataColumns={dataColumns}
                dataSource={fields}
                onAdd={add}
                onRemove={remove}
                addButtonText='Add New Item'
                formType={FORM_TYPE.EXTRA_CONFIG}
              />
            )}
          </Form.List>
        </RowFormField>
      </SectionWrapper>
    </Form>
  )
}

export default ExtraConfig
