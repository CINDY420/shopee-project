import React from 'react'
import DetailLayout from 'components/Common/DetailLayout'
import Content from 'components/App/ProjectMGT/TenantDetail/Content'
import { Root } from 'components/App/ProjectMGT/TenantDetail/style'
import Breadcrumbs, { CRUMB_TYPE } from 'components/App/ProjectMGT/Common/BreadCrumb'
import Overview from 'components/App/ProjectMGT/TenantDetail/Overview'
import { useRecoilValue } from 'recoil'
import { selectedTenant } from 'states'
import generateEnvsAndClusters, { generateClusters } from 'helpers/generateEnvsAndClusters'

const TenantDetail: React.FC = () => {
  const { displayName: tenantName, tenantCmdbName, envQuotas } = useRecoilValue(selectedTenant)
  const [envs, clusters] = generateEnvsAndClusters(envQuotas)
  const clusterItems = generateClusters(envQuotas)
  return (
    <DetailLayout
      title="Tenant: "
      resource={tenantCmdbName || tenantName}
      tags={[`Env: ${envs.join(', ')}`, `Cluster: ${clusters.join(', ')}`]}
      body={
        <Root>
          <Overview
            tenantName={tenantCmdbName || tenantName}
            clusterItems={clusterItems}
            envs={envs}
          />
          <Content />
        </Root>
      }
      isHeaderWithBottomLine
      isHeaderWithBreadcrumbs
      breadcrumbs={<Breadcrumbs crumbName={CRUMB_TYPE.TENANT} />}
    />
  )
}
export default TenantDetail
