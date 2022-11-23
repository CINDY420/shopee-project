import * as React from 'react'
import { Spin } from 'infrad'
import { DownloadOutlined } from 'infra-design-icons'

import { useRecoilValue } from 'recoil'
import { selectedTenant } from 'states/applicationState/tenant'
import { useRemoteRecoil, AsyncStatus } from 'hooks/useRecoil'
import { groupsControllerGetDetail } from 'swagger-api/v3/apis/Tenants'
import { ITenantDetail } from 'api/types/application/group'

import DetailLayout from 'components/App/ApplicationsManagement/Common/DetailLayout'
import Overview from './Overview'
import Content from './Content'
import { VerticalDivider } from 'common-styles/divider'

import { getTags } from 'helpers/header'
import { Root } from './style'

const TenantDetail: React.FC = () => {
  const tenantDetail: ITenantDetail = useRecoilValue(selectedTenant)
  const { name: tenantName, id: tenantId } = tenantDetail

  const [selectedTenantState, selectTenantFn] = useRemoteRecoil(groupsControllerGetDetail, selectedTenant)

  const handleRefreshGroup = () => {
    selectTenantFn({ tenantId })
  }

  const changeLinkToDownload = () => {
    window.open(
      'https://monitoring.i.infra.shopee.io/grafana/d/WLN5KYoGz/k8s-ctlbao-biao?orgId=1&var-prometheus=k8s-ctl-live(New-platform:wip)'
    )
  }

  const loading = selectedTenantState.status === AsyncStatus.ONGOING

  return (
    <DetailLayout
      title={`Tenant: ${tenantName}`}
      tags={getTags(tenantDetail)}
      body={
        <Root>
          {loading ? <Spin /> : <Overview />}
          <VerticalDivider size='1em' />
          <Content tenantName={tenantName} tenantId={tenantId} onRefreshGroup={handleRefreshGroup} />
        </Root>
      }
      buttons={[
        {
          icon: <DownloadOutlined />,
          text: 'Resource Report',
          click: changeLinkToDownload
        }
      ]}
    />
  )
}

export default TenantDetail
