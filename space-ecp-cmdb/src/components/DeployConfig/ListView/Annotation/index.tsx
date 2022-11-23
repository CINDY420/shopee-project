import React from 'react'
import { Form } from 'infrad'
import TableFormList from 'src/components/DeployConfig/ListView/Common/TableFormList'
import SectionWrapper from 'src/components/DeployConfig/ListView/Common/SectionWrapper'
import RowFormField from 'src/components/DeployConfig/ListView/Common/RowFormField'
import {
  DeployConfigContext,
  FormType,
  getDispatchers,
} from 'src/components/DeployConfig/useDeployConfigContext'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import {
  AutoDisabledInput,
  AutoDisabledSwitch,
} from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import { HorizonCenterWrapper } from 'src/common-styles/flexWrapper'
import { StyledAutoDisabledInput } from 'src/components/DeployConfig/ListView/Annotation/style'

const COMPULSORY_FIELD_VALIDATOR = { required: true, message: 'Please fill in your expectations' }
const KEY_RANGE_VALIDATOR = {
  min: 1,
  max: 42,
  message: 'Up to 63 characters.',
}
const VALUE_RANGE_VALIDATOR = {
  min: 1,
  max: 253,
  message: 'Up to 253 characters.',
}

const Annotation: React.FC = () => {
  const [form] = Form.useForm()
  const status = Form.useWatch(['enable'], form)
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])

  const { newDeployConfig, isEditing } = state
  const { annotations_global } = newDeployConfig
  React.useEffect(() => {
    if (annotations_global) {
      const annotations = Object.entries(annotations_global).map(([key, value]) => ({
        key: key.replace('custom.ecp.shopee.io/', ''),
        value,
      }))
      form.setFieldsValue({ enable: true, annotations })
    } else {
      form.setFieldsValue({ enable: false })
    }
    dispatchers.updateDeployConfigForms({ [FormType.ANNOTATIONS]: form })
    dispatchers.updateErrors(FormType.ANNOTATIONS)
  }, [annotations_global, dispatchers, form])

  const dataColumns = [
    {
      title: 'Key',
      dataIndex: 'key',
      width: '50%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item
          name={[record.name, 'key']}
          validateFirst
          rules={[COMPULSORY_FIELD_VALIDATOR, KEY_RANGE_VALIDATOR]}
        >
          <StyledAutoDisabledInput $isEditing={isEditing} addonBefore="custom.ecp.shopee.io/" />
        </Form.Item>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: '50%',
      render: (_: unknown, record: FormListFieldData) => (
        <Form.Item
          name={[record.name, 'value']}
          validateFirst
          rules={[COMPULSORY_FIELD_VALIDATOR, VALUE_RANGE_VALIDATOR]}
        >
          <AutoDisabledInput />
        </Form.Item>
      ),
    },
  ]

  return (
    <Form form={form} onFieldsChange={() => dispatchers.updateErrors(FormType.ANNOTATIONS)}>
      <SectionWrapper title="Annotations" anchorKey={FormType.ANNOTATIONS}>
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

        {status && (
          <RowFormField>
            <Form.List name="annotations">
              {(fields, { add, remove }) => (
                <TableFormList
                  dataColumns={dataColumns}
                  dataSource={fields}
                  onAdd={add}
                  onRemove={remove}
                  formType={FormType.ANNOTATIONS}
                />
              )}
            </Form.List>
          </RowFormField>
        )}
      </SectionWrapper>
    </Form>
  )
}
export default Annotation
