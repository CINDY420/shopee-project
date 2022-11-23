import { Button, Form, FormInstance, Modal, Select } from 'infrad'
import { FormListFieldData, FormListOperation } from 'infrad/lib/form/FormList'
import React from 'react'
import RowFormField from 'src/components/DeployConfig/ListView/Common/RowFormField'
import TableFormList from 'src/components/DeployConfig/ListView/Common/TableFormList'
import {
  AutoDisabledInput,
  AutoDisabledPassword,
  AutoDisabledSelect,
  AutoDisabledTextarea,
} from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import PathForm from 'src/components/DeployConfig/ListView/Storage/FuseFS/PathForm'
import {
  StyledExtraMessage,
  StyledFormItem,
  StyledInput,
  StyledModalForm,
} from 'src/components/DeployConfig/ListView/Storage/FuseFS/style'
import { pickBy, find } from 'lodash'
import { DeployConfigContext, FormType } from 'src/components/DeployConfig/useDeployConfigContext'
import { IEdit, DeleteOutlined } from 'infra-design-icons'
import { HorizonCenterWrapper } from 'src/common-styles/flexWrapper'

interface IOverrideData {
  mount_path: string
  local_mount_path: string
  project_path: string
}

enum FORM_FIELD_NAME {
  FUSEFS = 'fusefs',
  FUSEFS_OVERRIDE = 'fusefs_overrides',
}

enum ACTION_TYPES {
  MODIFY = 'Modify',
  ADD = 'Add',
}
const RANGE_VALIDATOR = {
  min: 1,
  max: 127,
  message: 'Up to 127 characters.',
}
interface IFuseFSProps {
  form: FormInstance
}
const FuseFS: React.FC<IFuseFSProps> = ({ form }) => {
  const { state } = React.useContext(DeployConfigContext)
  const { countryAzsOptions, isEditing } = state

  const [userAccountForm] = Form.useForm()
  const [fuseModalForm] = Form.useForm()
  const [actionType, setActionType] = React.useState<ACTION_TYPES>(ACTION_TYPES.ADD)
  const [fuseModalVisible, setFuseModalVisible] = React.useState(false)
  const [currentFieldListKey, setCurrentFieldListKey] = React.useState<string | number>('')

  const [userAccountModalVisible, setUserAcccountModalVisible] = React.useState(false)
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
      dataIndex: 'az',
      key: 'az',
      width: '12%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record

        return (
          <Form.Item {...restField} name={[name, 'az']}>
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

        const values: IOverrideData = form.getFieldValue([
          FORM_FIELD_NAME.FUSEFS_OVERRIDE,
          name,
          'data',
        ])
        const { mount_path, local_mount_path, project_path } = values
        const formattedValue = {
          mount_path,
          local_mount_path: mount_path + local_mount_path,
          project_path,
        }
        return (
          <Form.Item {...restField} shouldUpdate>
            <StyledInput readOnly bordered={false} value={JSON.stringify(pickBy(formattedValue))} />
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

  const showOverrideResoucesModal = (type: ACTION_TYPES, key: string | number) => {
    if (type === ACTION_TYPES.MODIFY) {
      const overrideValues = form.getFieldValue([FORM_FIELD_NAME.FUSEFS_OVERRIDE, key])
      fuseModalForm.setFieldsValue({ ...overrideValues })
    }
    setActionType(type)
    setCurrentFieldListKey(key)
    setFuseModalVisible(true)
  }

  const submitOverrideResouces = async () => {
    const modalFormValue = await fuseModalForm.validateFields()
    const formOverrideValues = form.getFieldValue(FORM_FIELD_NAME.FUSEFS_OVERRIDE) || []
    if (actionType === ACTION_TYPES.ADD) {
      formOverrideValues.push(modalFormValue)
    } else {
      formOverrideValues[currentFieldListKey] = modalFormValue
    }
    form.setFieldsValue({
      [FORM_FIELD_NAME.FUSEFS_OVERRIDE]: formOverrideValues,
    })
    cancelOverrideResouces()
  }

  const cancelOverrideResouces = () => {
    fuseModalForm.resetFields()
    setFuseModalVisible(false)
  }

  const submitUserAccount = async () => {
    const formValue = await userAccountForm.validateFields()
    const { username, password } = formValue
    const encrypted = btoa(
      `-Dalluxio.security.login.username=${username} -Dalluxio.security.login.rpc-password=${password}`,
    )
    form.setFieldsValue({ [FORM_FIELD_NAME.FUSEFS]: { user_account: encrypted } })
    setUserAcccountModalVisible(false)
    await form.validateFields([FORM_FIELD_NAME.FUSEFS, 'user_account'])
  }
  const cancelUserAccount = () => {
    userAccountForm.resetFields()
    setUserAcccountModalVisible(false)
  }

  return (
    <>
      <RowFormField
        rowKey="Default"
        tooltip={
          <a
            style={{ color: '#fff' }}
            href="https://confluence.shopee.io/display/IPG/Use+FuseFS+Service"
          >
            User Guide (link)
          </a>
        }
      >
        <StyledFormItem label="UserAccount">
          <div style={{ display: 'flex' }}>
            <Form.Item
              noStyle
              name={[FORM_FIELD_NAME.FUSEFS, 'user_account']}
              rules={[{ required: true, message: 'User Account is required' }]}
            >
              <AutoDisabledTextarea style={{ width: 544 }} autoSize disabled />
            </Form.Item>
            <Button
              style={{ marginLeft: '16px' }}
              shape="circle"
              icon={<IEdit />}
              onClick={() => setUserAcccountModalVisible(true)}
            />
          </div>
        </StyledFormItem>
        <PathForm namePath={[FORM_FIELD_NAME.FUSEFS]} form={form} isEditing={isEditing} />
      </RowFormField>
      <RowFormField
        rowKey="Override"
        tooltip="You can override the default configuration with this function"
      >
        <Form.List name={FORM_FIELD_NAME.FUSEFS_OVERRIDE}>
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
      <Modal
        title={`${actionType} Override FuseFS`}
        visible={fuseModalVisible}
        getContainer={() => document.body}
        onOk={() => void submitOverrideResouces()}
        onCancel={cancelOverrideResouces}
        width={800}
        okText="Confirm"
      >
        <StyledModalForm form={fuseModalForm} requiredMark={false} labelCol={{ span: 6 }}>
          <StyledFormItem
            label="Country"
            name="cid"
            rules={[{ required: true, message: 'Please choose your target CID' }]}
          >
            <AutoDisabledSelect style={{ width: 160, marginRight: 16 }}>
              {Object.keys(countryAzsOptions).map((cid) => {
                const formValues = form.getFieldValue(FORM_FIELD_NAME.FUSEFS_OVERRIDE)
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
                <StyledFormItem label="AZ">
                  <HorizonCenterWrapper>
                    <StyledFormItem
                      noStyle
                      name="az"
                      initialValue="N/A"
                      rules={[{ required: true, message: 'Please choose your target AZ' }]}
                    >
                      <AutoDisabledSelect style={{ width: 160 }}>
                        {azList.map((az) => (
                          <Select.Option value={az} key={az}>
                            {az}
                          </Select.Option>
                        ))}
                      </AutoDisabledSelect>
                    </StyledFormItem>
                    <StyledFormItem noStyle>
                      <StyledExtraMessage>
                        Leave AZ as N/A it is used in all AZs.
                      </StyledExtraMessage>
                    </StyledFormItem>
                  </HorizonCenterWrapper>
                </StyledFormItem>
              )
            }}
          </Form.Item>
          <PathForm namePath={['data']} form={fuseModalForm} isEditing={isEditing} />
        </StyledModalForm>
      </Modal>
      <Modal
        title="User Account"
        visible={userAccountModalVisible}
        getContainer={() => document.body}
        onOk={() => void submitUserAccount()}
        onCancel={cancelUserAccount}
        width={800}
        okText="Confirm"
      >
        <StyledModalForm
          form={userAccountForm}
          requiredMark={false}
          colon={false}
          labelCol={{ span: 6 }}
        >
          <StyledFormItem
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Username is required' }, RANGE_VALIDATOR]}
          >
            <AutoDisabledInput style={{ width: 400, marginRight: 16 }} />
          </StyledFormItem>

          <StyledFormItem
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Password is required' }, RANGE_VALIDATOR]}
          >
            <AutoDisabledPassword style={{ width: 400, marginRight: 16 }} />
          </StyledFormItem>

          <StyledFormItem
            label="Confirm Password"
            name="confirm"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Password should be all the same.'))
                },
              }),
            ]}
          >
            <AutoDisabledPassword style={{ width: 400, marginRight: 16 }} />
          </StyledFormItem>
        </StyledModalForm>
      </Modal>
    </>
  )
}

export default FuseFS
