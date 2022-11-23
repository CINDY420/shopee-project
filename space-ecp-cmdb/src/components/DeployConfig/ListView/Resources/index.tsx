import * as React from 'react'

import SectionWrapper from 'src/components/DeployConfig/ListView/Common/SectionWrapper'
import TableFormList from 'src/components/DeployConfig/ListView/Common/TableFormList'
import RowFormField from 'src/components/DeployConfig/ListView//Common/RowFormField'
import DefaultResourcesForm, { UNIT } from './DefaultResourcesForm'
import { Button, Form, Modal, Select } from 'infrad'
import { FormListOperation, FormListFieldData } from 'infrad/lib/form/FormList'
import { IEdit, DeleteOutlined } from 'infra-design-icons'
import {
  StyledModalForm,
  StyledFormItem,
  StyledInput,
} from 'src/components/DeployConfig/ListView/Resources/style'
import {
  DeployConfigContext,
  FormType,
  getDispatchers,
} from 'src/components/DeployConfig/useDeployConfigContext'
import { pickBy, find } from 'lodash'
import { AutoDisabledSelect } from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import { IModels } from 'src/rapper/request'

type IResourceOverride =
  IModels['GET/api/ecp-cmdb/deploy-config/commits']['Res']['commits'][0]['data']['resources_override'][0]
enum ACTION_TYPES {
  MODIFY = 'Modify',
  ADD = 'Add',
}

enum FORM_FIELD_NAME {
  RESOURCES = 'resources',
  RESOURCES_OVERRIDE = 'resources_override',
}

const Resources: React.FC = () => {
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { isEditing, newDeployConfig, countryAzsOptions, env } = state
  const { resources, resources_override } = newDeployConfig

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
      width: '12%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record

        return (
          <Form.Item {...restField} name={[name, 'cid']}>
            <StyledInput readOnly bordered={false} />
          </Form.Item>
        )
      },
    },
    {
      title: 'AZ',
      dataIndex: 'idc',
      key: 'idc',
      width: '12%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record

        return (
          <Form.Item {...restField} name={[name, 'idc']}>
            <StyledInput readOnly bordered={false} />
          </Form.Item>
        )
      },
    },
    {
      title: 'Value',
      dataIndex: 'data',
      key: 'data',
      width: '76%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record
        const values = form.getFieldValue([FORM_FIELD_NAME.RESOURCES_OVERRIDE, name, 'data'])
        const { mem, mem_unit, shared_mem, shared_mem_unit, ...rest } = values
        const displayValue = {
          ...rest,
          mem: mem ? `${mem}${mem_unit}` : '',
          sharedMem: shared_mem ? `${shared_mem}${shared_mem_unit}` : '',
        }
        return (
          <Form.Item {...restField} shouldUpdate>
            <StyledInput readOnly bordered={false} value={JSON.stringify(pickBy(displayValue))} />
          </Form.Item>
        )
      },
    },
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
              shape="circle"
              icon={<IEdit />}
              onClick={() => showOverrideResoucesModal(ACTION_TYPES.MODIFY, name)}
            />
          </Form.Item>
        )
      },
    },
    {
      title: '',
      dataIndex: 'remove',
      key: 'remove',
      render: (_: unknown, record: FormListFieldData) => {
        const { name } = record

        return (
          <Form.Item>
            <Button shape="circle" onClick={() => remove(name)} icon={<DeleteOutlined />} />
          </Form.Item>
        )
      },
    },
  ]

  React.useEffect(() => {
    dispatchers.updateDeployConfigForms({ [FormType.RESOURCES]: form })
  }, [dispatchers, form, isEditing])

  const initializeFormValues = React.useCallback(() => {
    // @ts-expect-error rapper cannot handle complex object type
    const resourcesValues = resources?.[env]
    const resourcesMemory = resourcesValues?.mem
    const sharedMemory = resourcesValues?.shared_mem

    const memUnit = resourcesMemory % 1024 === 0 ? UNIT.GB : UNIT.MB
    const sharedMemUnit = sharedMemory % 1024 === 0 ? UNIT.GB : UNIT.MB

    const formattedMem = memUnit === UNIT.MB ? resourcesMemory : resourcesMemory / 1024
    const formattedSharedMem = sharedMemUnit === UNIT.MB ? sharedMemory : sharedMemory / 1024

    form.setFieldsValue({
      [FORM_FIELD_NAME.RESOURCES]: {
        [env]: {
          ...resourcesValues,
          mem: formattedMem,
          mem_unit: memUnit,
          shared_mem: formattedSharedMem,
          shared_mem_unit: sharedMemUnit,
        },
      },
      [FORM_FIELD_NAME.RESOURCES_OVERRIDE]: resources_override?.map((override) => {
        const { idc, cid, data } = override
        const { mem, shared_mem, ...rest } = data

        const memUnit = mem % 1024 === 0 ? UNIT.GB : UNIT.MB
        const sharedMemUnit = shared_mem % 1024 === 0 ? UNIT.GB : UNIT.MB
        const newData = {
          mem: memUnit === UNIT.MB ? mem : mem / 1024,
          shared_mem: sharedMemUnit === UNIT.MB ? shared_mem : shared_mem / 1024,
          mem_unit: memUnit,
          shared_mem_unit: sharedMemUnit,
          ...rest,
        }
        return idc
          ? {
              idc,
              cid,
              data: newData,
            }
          : {
              idc: 'N/A',
              cid,
              data: newData,
            }
      }),
    })
    dispatchers.updateErrors(FormType.RESOURCES)
  }, [dispatchers, env, form, resources, resources_override])

  React.useEffect(() => {
    initializeFormValues()
  }, [initializeFormValues])

  React.useEffect(() => {
    const resouceOverrides = form
      .getFieldValue(FORM_FIELD_NAME.RESOURCES_OVERRIDE)
      ?.filter(
        (override: IResourceOverride) =>
          override && Object.keys(countryAzsOptions).includes(override.cid),
      )
    form.setFieldsValue({
      [FORM_FIELD_NAME.RESOURCES_OVERRIDE]: resouceOverrides,
    })
  }, [countryAzsOptions, form])

  const showOverrideResoucesModal = (type: ACTION_TYPES, key: string | number) => {
    if (type === ACTION_TYPES.MODIFY) {
      const overrideValues = form.getFieldValue([FORM_FIELD_NAME.RESOURCES_OVERRIDE, key])
      const modalFormData = { ...overrideValues?.data }
      const { mem, shared_mem, mem_unit, shared_mem_unit } = modalFormData
      modalFormData.mem = mem
      modalFormData.mem_unit = mem_unit
      modalFormData.shared_mem = shared_mem
      modalFormData.shared_mem_unit = shared_mem_unit
      modalForm.setFieldsValue({
        ...overrideValues,
        data: modalFormData,
      })
    }
    setActionType(type)
    setCurrentFieldListKey(key)
    setOverrideModalVisible(true)
  }

  const submitOverrideResouces = async () => {
    const modalFormValue = await modalForm.validateFields()
    const { cid, idc, data } = modalFormValue
    const overrideResouces = {
      cid,
      idc,
      data,
    }
    const formOverrideValues = form.getFieldValue(FORM_FIELD_NAME.RESOURCES_OVERRIDE) || []
    if (actionType === ACTION_TYPES.ADD) {
      formOverrideValues.push(overrideResouces)
    } else {
      formOverrideValues[currrentFieldListKey] = overrideResouces
    }
    form.setFieldsValue({
      [FORM_FIELD_NAME.RESOURCES_OVERRIDE]: formOverrideValues,
    })
    cancelOverrideResouces()
  }

  const cancelOverrideResouces = () => {
    modalForm.resetFields()
    setOverrideModalVisible(false)
  }

  return (
    <>
      <SectionWrapper title="Instance Flavor" anchorKey={FormType.RESOURCES}>
        <Form
          form={form}
          layout="horizontal"
          requiredMark={false}
          labelCol={{ span: 4 }}
          onFieldsChange={() => dispatchers.updateErrors(FormType.RESOURCES)}
        >
          <RowFormField
            rowKey="Default"
            tooltip="This configuration will take effect globally unless it is overridden"
          >
            <DefaultResourcesForm
              namePath={[FORM_FIELD_NAME.RESOURCES, env]}
              isEditing={isEditing}
            />
          </RowFormField>
          <RowFormField
            rowKey="Override"
            tooltip="You can override the default configuration with this function"
          >
            <Form.List name={FORM_FIELD_NAME.RESOURCES_OVERRIDE}>
              {(fields, { remove }) => (
                <TableFormList
                  onAdd={() => showOverrideResoucesModal(ACTION_TYPES.ADD, fields.length)}
                  dataSource={fields}
                  dataColumns={dataColumns}
                  actionColumns={isEditing ? actionColumns(remove) : null}
                  addButtonText="Add Override"
                  formType={FormType.RESOURCES}
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
        okText="Confirm"
      >
        <StyledModalForm form={modalForm} requiredMark={false} labelCol={{ span: 6 }}>
          <StyledFormItem
            label="Country"
            name="cid"
            rules={[{ required: true, message: 'Please choose your target CID' }]}
          >
            <AutoDisabledSelect style={{ width: 160, marginRight: 16 }}>
              {Object.keys(countryAzsOptions).map((cid) => {
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

          <Form.Item
            shouldUpdate={(prevValue, currValue) => prevValue?.cid !== currValue?.cid}
            noStyle
          >
            {({ getFieldValue }) => {
              const selectedCid: string = getFieldValue('cid')
              const azList = countryAzsOptions[selectedCid]?.concat(['N/A']) ?? []
              return (
                <StyledFormItem
                  label="AZ"
                  name="idc"
                  initialValue="N/A"
                  rules={[{ required: true, message: 'Please choose your target AZ' }]}
                >
                  <AutoDisabledSelect style={{ width: 160, marginRight: 16 }}>
                    {azList.map((az) => (
                      <Select.Option value={az} key={az}>
                        {az}
                      </Select.Option>
                    ))}
                  </AutoDisabledSelect>
                </StyledFormItem>
              )
            }}
          </Form.Item>
          <DefaultResourcesForm namePath={['data']} isEditing={isEditing} />
        </StyledModalForm>
      </Modal>
    </>
  )
}

export default Resources
