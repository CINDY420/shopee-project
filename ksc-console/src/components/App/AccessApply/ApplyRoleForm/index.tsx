import React, { useEffect, useState, useCallback } from 'react'
import { Form, Input, FormInstance } from 'infrad'

import {
  StyledSelect,
  StyledFormItem as FormItem,
} from 'components/App/AccessApply/ApplyRoleForm/style'
import { accountControllerListAllRoles } from 'swagger-api/apis/Account'
import {
  globalControllerListAllTenants,
  globalControllerListAllProjects,
} from 'swagger-api/apis/Global'
import { IRawRole, IOpenApiTenantListItem, IOpenApiProjectListItem } from 'swagger-api/models'
import { GLOBAL_ROLE_ID_LIST, PROJECT_ROLE_ID_LIST } from 'constants/auth'

const { Option } = StyledSelect

interface IApplyRoleForm {
  form: FormInstance
  onFieldsChange: () => void
}

const ApplyRoleForm: React.FC<IApplyRoleForm> = ({ form, onFieldsChange }) => {
  const [roles, setRoles] = useState<IRawRole[]>([])
  const [tenants, setTenants] = useState<IOpenApiTenantListItem[]>([])
  const [projects, setProjects] = useState<IOpenApiProjectListItem[]>([])
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedTenant, setSelectedTenant] = useState('')

  const setRolesFn = useCallback(async () => {
    const allRoles = await accountControllerListAllRoles()
    const allowedRoles = allRoles.roles.filter((role) => !GLOBAL_ROLE_ID_LIST.includes(role.roleId))
    setRoles(allowedRoles)
  }, [])
  const setTenantsFn = useCallback(async () => {
    const allTenants = await globalControllerListAllTenants()
    setTenants(allTenants.items)
  }, [])
  const setProjectsFn = useCallback(async (tenantId: string) => {
    const allProjects = await globalControllerListAllProjects({ tenantId })
    setProjects(allProjects.items)
  }, [])

  useEffect(() => {
    setRolesFn()
    setTenantsFn()
  }, [setRolesFn, setTenantsFn])

  const handleSelectRole = (selectedRole: string) => setSelectedRole(selectedRole)
  const handleSelectTenant = (selectedTenant: string) => {
    setSelectedTenant(selectedTenant)
    // reset selected tenant project field
    form.resetFields(['projectId'])
  }
  useEffect(() => {
    if (PROJECT_ROLE_ID_LIST.includes(selectedRole) && selectedTenant) setProjectsFn(selectedTenant)
  }, [setProjectsFn, selectedRole, selectedTenant])

  return (
    <Form
      name="addRole"
      form={form}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 16 }}
      style={{ marginTop: 32, marginBottom: 32 }}
      onFieldsChange={onFieldsChange}
    >
      <FormItem
        label="Role"
        name="roleId"
        rules={[{ required: true, message: 'Please select a role!' }]}
        height={60}
      >
        <StyledSelect placeholder="Select" onSelect={handleSelectRole}>
          {roles.map((role) => (
            <Option key={role.roleName} value={role.roleId}>
              {role.roleName}
            </Option>
          ))}
        </StyledSelect>
      </FormItem>
      <FormItem
        label="Tenant"
        name="tenantId"
        rules={[{ required: true, message: 'Please select a tenant!' }]}
        height={60}
      >
        <StyledSelect placeholder="Select" onSelect={handleSelectTenant}>
          {tenants.map((tenant) => (
            <Option key={tenant.displayName} value={tenant.tenantId}>
              {tenant.displayName}
            </Option>
          ))}
        </StyledSelect>
      </FormItem>
      {PROJECT_ROLE_ID_LIST.includes(selectedRole) && (
        <FormItem
          label="Project"
          name="projectId"
          rules={[{ required: true, message: 'Please select a project!' }]}
          height={60}
        >
          <StyledSelect placeholder="Select">
            {projects.map((project) => (
              <Option key={project.displayName} value={project.projectId}>
                {project.displayName}
              </Option>
            ))}
          </StyledSelect>
        </FormItem>
      )}
      <FormItem
        label="Reason"
        name="reason"
        rules={[{ required: true, message: 'Please input your reason!' }]}
        height={120}
      >
        <Input.TextArea placeholder="Input" maxLength={500} showCount rows={4} />
      </FormItem>
    </Form>
  )
}

export default ApplyRoleForm
