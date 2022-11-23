import React from 'react'
import { Button, Empty, message, Modal } from 'infrad'
import { Table } from 'common-styles/table'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { ExclamationCircleOutlined } from 'infra-design-icons'
import { zoneControllerDeleteZone, zoneControllerListZone } from 'swagger-api/v1/apis/Zone'
import { useRecoilValue } from 'recoil'
import { selectedTenant } from 'states/applicationState/tenant'
import { IZone } from 'swagger-api/v1/models'
import TooltipEllipsis from 'components/Common/TooltipEllipsis'
import AddZone from 'components/App/ApplicationsManagement/TenantDetail/Content/ZoneManagement/AddZone'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'constants/accessControl'

const ZoneList: React.FC = () => {
  const accessControlContext = React.useContext(AccessControlContext)
  const zonePermissions = accessControlContext[RESOURCE_TYPE.ZONE] || []
  const canDelete = zonePermissions.includes(RESOURCE_ACTION.Delete)

  const groupInfo = useRecoilValue(selectedTenant)
  const { id: tenantId } = groupInfo

  const listZonesFnWithResource = React.useCallback(
    args => {
      return zoneControllerListZone({
        tenantId,
        ...args
      })
    },
    [tenantId]
  )

  const [listZonesState, listZonesFn] = useAsyncIntervalFn(listZonesFnWithResource, { enableIntervalCallback: false })
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listZonesFn, orderDefault: 'desc' })
  const { zones, total } = listZonesState.value || {}

  const removeZone = async (zoneName: string) => {
    try {
      await zoneControllerDeleteZone({
        tenantId,
        zoneName
      })
      refresh()
      message.success('Remove successfully')
    } catch (error) {
      message.error(`Remove failed,  reason ${error?.message}`)
    }
  }

  React.useEffect(() => {
    refresh()
  }, [refresh, tenantId])

  const showRemoveConfirm = (zoneName: string) => {
    Modal.confirm({
      title: 'Are you sure remove this zone?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          This operation is not reversible.
          <br />
          Zone with ongoing deployments will be maintained until you remove it from Deploy Config.
        </>
      ),
      onOk() {
        removeZone(zoneName)
      },
      okText: 'Yes',
      cancelText: 'No'
    })
  }

  const columns = [
    {
      title: 'Zone Name',
      dataIndex: 'zoneName',
      key: 'zoneName'
    },
    {
      title: 'AZ',
      dataIndex: 'az',
      key: 'az'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <TooltipEllipsis title={description} maxWidth='340px' overlayStyle={{ maxWidth: '470px' }} />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: IZone) => (
        <Button
          type='link'
          onClick={() => showRemoveConfirm(record.zoneName)}
          style={{ padding: 0 }}
          disabled={!canDelete}
        >
          Remove
        </Button>
      )
    }
  ]

  return (
    <>
      <AddZone onSucceed={refresh} />
      <Table
        columns={columns}
        dataSource={zones}
        rowKey='zoneName'
        loading={listZonesState.loading}
        pagination={{
          ...TABLE_PAGINATION_OPTION,
          ...pagination,
          total
        }}
        onChange={handleTableChange}
        locale={{ emptyText: <Empty description='No Data' /> }}
      />
    </>
  )
}

export default ZoneList
