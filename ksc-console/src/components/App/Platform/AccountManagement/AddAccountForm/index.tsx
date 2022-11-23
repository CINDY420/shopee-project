import React from 'react'
import { ITrash, IAdd } from 'infra-design-icons'
import { Form, Input, Select, FormInstance, Button } from 'infrad'
import { accountControllerListAllRoles } from 'swagger-api/apis/Account'
import { IRawRole, IProjectListItem, IProjectRole, ITenantListItem } from 'swagger-api/models'
import { PROJECT_ROLE_ID_LIST, TENANT_ROLE_ID_LIST } from 'constants/auth'
import { projectControllerListProjects } from 'swagger-api/apis/Project'
import { ShopeeAndSeaEmailRegExp } from 'constants/validate'
import { StyledIconWrapper } from 'components/App/Platform/AccountManagement/AddAccountForm/style'
import { tenantControllerListTenants } from 'swagger-api/apis/Tenant'

interface IAddAccountFormProps {
  form: FormInstance
  isEdit: boolean
  allowedRoleIds?: string[]
}

interface IFormValues extends IProjectRole {
  emails: string[]
}

const DEFAULT_LIMIT = '10000'
const { Option } = Select
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 16, offset: 5 },
}
const initialValues = {
  emails: [''],
}

const AddAccountForm = ({ form, allowedRoleIds }: IAddAccountFormProps) => {
  const [roles, setRoles] = React.useState<IRawRole[]>([])
  const [tenantList, setTenantList] = React.useState<ITenantListItem[]>([])
  const [projectList, setProjectList] = React.useState<IProjectListItem[]>([])

  const shouldTenantAndProjectItemUpdate = (prevValue: IFormValues, currentValue: IFormValues) =>
    prevValue?.roleId !== currentValue?.roleId

  const setRolesFn = React.useCallback(async () => {
    const allRoles = await accountControllerListAllRoles()
    let allowedRoles: IRawRole[] = allRoles?.roles
    if (allowedRoleIds && allowedRoleIds.length > 0)
      allowedRoles = allRoles?.roles.filter((role) => allowedRoleIds.includes(role.roleId))

    setRoles(allowedRoles)
  }, [allowedRoleIds])

  const listTenants = React.useCallback(async () => {
    const { items = [] } = await tenantControllerListTenants({ limit: DEFAULT_LIMIT })
    setTenantList(items)
  }, [])

  const listProjects = React.useCallback(async (tenantId: string) => {
    if (tenantId) {
      const { items = [] } = await projectControllerListProjects({ tenantId, limit: DEFAULT_LIMIT })
      setProjectList(items)
    }
  }, [])

  const handleTenantChange = (e: string) => {
    if (PROJECT_ROLE_ID_LIST.includes(form.getFieldValue('roleId'))) listProjects(e)
  }

  const handleRoleChange = () => {
    form.setFieldsValue({ ...form.getFieldsValue(), tenantId: undefined, projectId: undefined })
  }

  React.useEffect(() => {
    setRolesFn()
    listTenants()
  }, [setRolesFn, listTenants])

  React.useEffect(() => {
    form.resetFields()
  }, [form])

  return (
    <Form
      name="addUser"
      form={form}
      initialValues={initialValues}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
      style={{ marginTop: 32, marginBottom: 32 }}
    >
      <Form.List name="emails">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(index !== 0 ? formItemLayoutWithOutLabel : {})}
                label={index === 0 ? 'Email' : ''}
                key={field.key}
                required
              >
                <Form.Item
                  {...field}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: 'please input shopee email',
                    },
                    { pattern: ShopeeAndSeaEmailRegExp, message: 'Shopee or SEA email only!' },
                  ]}
                  noStyle
                >
                  <Input placeholder="Please input email" />
                </Form.Item>
                {fields.length > 1 ? (
                  <StyledIconWrapper>
                    <ITrash onClick={() => remove(field.name)} />
                  </StyledIconWrapper>
                ) : null}
              </Form.Item>
            ))}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={() => add()} style={{ width: '60%' }} icon={<IAdd />}>
                Add
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item
        label="Role"
        name="roleId"
        rules={[{ required: true, message: 'Please select a role!' }]}
      >
        <Select placeholder="Please select a role" onChange={handleRoleChange}>
          {roles.map((role) => (
            <Option key={role.roleName} value={role.roleId}>
              {role.roleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item shouldUpdate={shouldTenantAndProjectItemUpdate} noStyle>
        {({ getFieldValue }) =>
          TENANT_ROLE_ID_LIST.concat(PROJECT_ROLE_ID_LIST).includes(getFieldValue('roleId')) && (
            <Form.Item
              label="Tenant"
              name="tenantId"
              rules={[{ required: true, message: 'Please select tenant!' }]}
            >
              <Select
                showSearch
                placeholder="Please select a tenant"
                onChange={handleTenantChange}
                filterOption={(input, option) =>
                  option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {tenantList.map((tenant) => (
                  <Option key={tenant.tenantId} value={tenant.tenantId}>
                    {tenant.displayName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )
        }
      </Form.Item>
      <Form.Item shouldUpdate={shouldTenantAndProjectItemUpdate} noStyle>
        {({ getFieldValue }) =>
          PROJECT_ROLE_ID_LIST.includes(getFieldValue('roleId')) && (
            <Form.Item
              label="Project"
              name="projectId"
              rules={[{ required: true, message: 'Please select project!' }]}
            >
              <Select
                showSearch
                placeholder="Please select a project"
                filterOption={(input, option) =>
                  option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {projectList.map((project) => (
                  <Option key={project.projectId} value={project.projectId}>
                    {project.displayName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )
        }
      </Form.Item>
    </Form>
  )
}

export default AddAccountForm
