import { FunctionComponent } from 'react'
import { Form, Select } from 'infrad'
import { useRecoilState } from 'recoil'
import { StyledFormItem } from 'src/components/App/Tenant/AppClusterConfig/TenantAndEnvSelector/style'
import { useFetch } from 'src/rapper'
import { tenantAndEnvState } from 'src/components/App/Tenant/AppClusterConfig'

type TenantAndEnvSelectorProp = {
  className?: string
}
export const TenantAndEnvSelector: FunctionComponent<TenantAndEnvSelectorProp> = (props) => {
  const { className } = props
  const [, setTenantAndEnv] = useRecoilState(tenantAndEnvState)

  const onEnvChange = (env: string) => {
    setTenantAndEnv((tenantAndEnv) => ({ ...tenantAndEnv, env }))
  }

  const onTenantChange = (tenant: number) => {
    setTenantAndEnv((tenantAndEnv) => ({ ...tenantAndEnv, tenant: String(tenant) }))
  }

  const { data: fetchTenantsData } = useFetch('GET/ecpadmin/tenants')
  const optionsForTenant = (fetchTenantsData?.items ?? []).map((item) => ({
    label: item.name,
    value: item.id,
  }))

  const { data: fetchEnvData } = useFetch('GET/ecpadmin/envs')
  const optionsForEnv = (fetchEnvData?.items ?? []).map((item) => ({
    value: item.name,
    label: item.name,
  }))

  return (
    <div className={className}>
      <Form name="TenantAndEnv" layout="inline">
        <StyledFormItem $width="320px" label="Tenant" required>
          <Select
            placeholder="Select"
            onChange={onTenantChange}
            showSearch
            filterOption
            optionFilterProp="children"
          >
            {optionsForTenant.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </StyledFormItem>

        <StyledFormItem $width="200px" label="Env" required>
          <Select placeholder="Select" onChange={onEnvChange}>
            {optionsForEnv.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </StyledFormItem>
      </Form>
    </div>
  )
}
