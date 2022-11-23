import * as React from 'react'

import SectionWrapper from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SectionWrapper'
import TableFormList from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/TableFormList'
import RowFormField from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView//Common/RowFormField'
import DefaultResourcesForm from './defaultResourceForm'
import { Button, Form, Input, Modal, Select } from 'infrad'
import { FormListOperation, FormListFieldData } from 'infrad/lib/form/FormList'
import Icon, { IEdit } from 'infra-design-icons'
import deleteSvg from 'assets/delete.antd.svg'
import {
  StyledModalForm,
  StyledFormItem
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Resources/style'
import {
  DeployConfigContext,
  FORM_TYPE,
  getDispatchers
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import { StringParam, useQueryParam } from 'use-query-params'
import { pickBy, find } from 'lodash'
import { AutoDisabledSelect } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled'
import { MEMORY_LIST } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Resources/defaultResourceForm'
import { IResourceOverride } from 'swagger-api/v1/models'

enum ACTION_TYPES {
  MODIFY = 'Modify',
  ADD = 'Add'
}

enum FORM_FIELD_NAME {
  RESOURCES = 'resources',
  RESOURCES_OVERRIDE = 'resources_override'
}

const Resources: React.FC = () => {
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { isEditing, newDeployConfig, countryAzsOptions } = state
  const { resources, resources_override } = newDeployConfig

  const [selectedEnv] = useQueryParam('selectedEnv', StringParam)
  const env = selectedEnv?.toLowerCase()

  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()

  const [actionType, setActionType] = React.useState<ACTION_TYPES>(ACTION_TYPES.ADD)
  const [overrideModalVisible, setOverrideModalVisible] = React.useState(false)
  const [currrentFieldListKey, setCurrentFieldListKey] = React.useState<string | number>('')

  const dataColumns = [
    {
      title: 'Country',
      dataIndex: 'cid',
      key: 'cid',
      width: '11%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key, name, ...restField } = record

        return (
          <Form.Item {...restField} name={[name, 'cid']}>
            <Input readOnly bordered={false} />
          </Form.Item>
        )
      }
    },
    {
      title: 'Value',
      dataIndex: 'data',
      key: 'data',
      width: '80%',
      render: (_: unknown, record: FormListFieldData) => {
        const { name } = record
        const values = form.getFieldValue([FORM_FIELD_NAME.RESOURCES_OVERRIDE, name, 'data'])

        return JSON.stringify(pickBy(values))
      }
    }
  ]

  const actionColumns = (remove: FormListOperation['remove']) => [
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: unknown, record: FormListFieldData) => {
        const { name } = record

        return (
          <Form.Item>
            <Button
              shape='circle'
              icon={<IEdit />}
              onClick={() => showOverrideResoucesModal(ACTION_TYPES.MODIFY, name)}
            />
          </Form.Item>
        )
      }
    },
    {
      title: '',
      dataIndex: 'remove',
      key: 'remove',
      render: (_: unknown, record: FormListFieldData) => {
        const { name } = record

        return (
          <Form.Item>
            <Button shape='circle' onClick={() => remove(name)} icon={<Icon component={deleteSvg} width={14} />} />
          </Form.Item>
        )
      }
    }
  ]

  React.useEffect(() => {
    dispatchers.updateDeployConfigForms({ [FORM_TYPE.RESOURCES]: form })
  }, [dispatchers, form, isEditing])

  const initializeFormValues = React.useCallback(() => {
    const resourcesValues = resources?.[env]
    const resourcesMemory = resourcesValues?.mem

    form.setFieldsValue({
      [FORM_FIELD_NAME.RESOURCES]: {
        [env]: {
          ...resourcesValues,
          mem: Object.keys(MEMORY_LIST).includes(resourcesMemory?.toString()) ? resourcesMemory : '',
          otherMemory: resourcesMemory
        }
      },
      [FORM_FIELD_NAME.RESOURCES_OVERRIDE]: resources_override
    })
    dispatchers.updateErrors(FORM_TYPE.RESOURCES)
  }, [dispatchers, env, form, resources, resources_override])

  React.useEffect(() => {
    initializeFormValues()
  }, [initializeFormValues])

  React.useEffect(() => {
    const resouceOverrides = form
      .getFieldValue(FORM_FIELD_NAME.RESOURCES_OVERRIDE)
      ?.filter((override: IResourceOverride) => {
        return override && Object.keys(countryAzsOptions).includes(override.cid)
      })
    form.setFieldsValue({
      [FORM_FIELD_NAME.RESOURCES_OVERRIDE]: resouceOverrides
    })
  }, [countryAzsOptions, form])

  const showOverrideResoucesModal = (type: ACTION_TYPES, key: string | number) => {
    if (type === ACTION_TYPES.MODIFY) {
      const overrideValues = form.getFieldValue([FORM_FIELD_NAME.RESOURCES_OVERRIDE, key])
      const modalFormData = Object.assign({}, overrideValues?.data)
      const { mem } = modalFormData
      if (!Object.keys(MEMORY_LIST).includes(mem?.toString())) {
        modalFormData.mem = ''
        modalFormData.otherMemory = mem
      }
      modalForm.setFieldsValue({
        ...overrideValues,
        data: modalFormData
      })
    }
    setActionType(type)
    setCurrentFieldListKey(key)
    setOverrideModalVisible(true)
  }

  const submitOverrideResouces = async () => {
    const modalFormValue = await modalForm.validateFields()
    const { cid, data } = modalFormValue
    const { otherMemory, ...overrideData } = data
    if (otherMemory) {
      overrideData.mem = otherMemory
    }
    const overrideResouces = {
      cid,
      data: overrideData
    }
    const formOverrideValues = form.getFieldValue(FORM_FIELD_NAME.RESOURCES_OVERRIDE) || []
    if (actionType === ACTION_TYPES.ADD) {
      formOverrideValues.push(overrideResouces)
    } else {
      formOverrideValues[currrentFieldListKey] = overrideResouces
    }
    form.setFieldsValue({
      [FORM_FIELD_NAME.RESOURCES_OVERRIDE]: formOverrideValues
    })
    cancelOverrideResouces()
  }

  const cancelOverrideResouces = () => {
    modalForm.resetFields()
    setOverrideModalVisible(false)
  }

  return (
    <>
      <SectionWrapper title='Resources' anchorKey={FORM_TYPE.RESOURCES}>
        <Form
          form={form}
          layout='horizontal'
          requiredMark={false}
          labelCol={{ span: 4 }}
          onFieldsChange={() => dispatchers.updateErrors(FORM_TYPE.RESOURCES)}
        >
          <RowFormField rowKey='Default' tooltip='This configuration will take effect globally unless it is overridden'>
            <DefaultResourcesForm namePath={[FORM_FIELD_NAME.RESOURCES, env]} />
          </RowFormField>
          <RowFormField rowKey='Override' tooltip='You can override the default configuration with this function'>
            <Form.List name={FORM_FIELD_NAME.RESOURCES_OVERRIDE}>
              {(fields, { remove }) => (
                <TableFormList
                  onAdd={() => showOverrideResoucesModal(ACTION_TYPES.ADD, fields.length)}
                  dataSource={fields}
                  dataColumns={dataColumns}
                  actionColumns={isEditing ? actionColumns(remove) : null}
                  addButtonText='Add Override'
                  formType={FORM_TYPE.RESOURCES}
                />
              )}
            </Form.List>
          </RowFormField>
        </Form>
      </SectionWrapper>
      <Modal
        title={`${actionType} Override Resources`}
        visible={overrideModalVisible}
        getContainer={() => document.body}
        onOk={submitOverrideResouces}
        onCancel={cancelOverrideResouces}
        width={800}
        okText='Confirm'
      >
        <StyledModalForm form={modalForm} requiredMark={false} labelCol={{ span: 6 }}>
          <StyledFormItem
            label='Country'
            name='cid'
            rules={[{ required: true, message: 'Please choose your target CID' }]}
          >
            <AutoDisabledSelect style={{ width: 160, marginRight: 16 }}>
              {Object.keys(countryAzsOptions).map(cid => {
                const formValues = form.getFieldValue(FORM_FIELD_NAME.RESOURCES_OVERRIDE)
                return (
                  cid && (
                    <Select.Option value={cid} key={cid} disabled={!!find(formValues, { cid })}>
                      {cid}
                    </Select.Option>
                  )
                )
              })}
            </AutoDisabledSelect>
          </StyledFormItem>
          <DefaultResourcesForm namePath={['data']} />
        </StyledModalForm>
      </Modal>
    </>
  )
}

export default Resources
