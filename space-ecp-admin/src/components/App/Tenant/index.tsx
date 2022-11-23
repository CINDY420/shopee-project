import { FunctionComponent } from 'react'
import { StyledPageHeader } from 'src/common-styles/layout'
import { StyledTenantTabs } from 'src/components/App/Tenant/TenantTabs/style'

type TenantProp = {}
export const Tenant: FunctionComponent<TenantProp> = () => (
  <>
    <StyledPageHeader title="Tenant" />
    <StyledTenantTabs />
  </>
)
