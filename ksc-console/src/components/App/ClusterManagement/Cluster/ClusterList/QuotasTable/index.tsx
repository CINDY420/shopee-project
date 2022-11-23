import React from 'react'
import { StyledTable } from 'components/App/ClusterManagement/Cluster/ClusterList/QuotasTable/style'
import { IResource, RESOURCE_CONFIG_LIST, RESOURCE_INDICATORS } from 'constants/resource'
import { ColumnsType } from 'infrad/lib/table'
import {
  IClusterDetailListItem,
  IClusterTenantListItem,
  IGetTenantMetricsResponse,
} from 'swagger-api/models'
import { clusterControllerListClusterTenants } from 'swagger-api/apis/Cluster'
import EditableTableCell from 'components/Common/EditableTableCell'
import { TENANT_QUOTA_MAPS } from 'constants/tenantDetail'
import { generateQuota } from 'helpers/generateQuota'
import { tenantControllerUpdateTenant } from 'swagger-api/apis/Tenant'
import { message } from 'infrad'

interface ITableData extends IClusterTenantListItem {
  rowSpan: number
  env: string
  quota: IGetTenantMetricsResponse
}
interface IQuotasTableProps {
  params: IClusterDetailListItem
}
const QuotasTable: React.FC<IQuotasTableProps> = ({ params }) => {
  const { clusterId } = params
  const [isTableLoading, setIsTableLoading] = React.useState(true)
  const [tableDataList, setTableDataList] = React.useState<Array<ITableData>>([])

  const listClusterTenants = React.useCallback(async () => {
    try {
      const { items = [] } = await clusterControllerListClusterTenants({ clusterId })
      const tableDataList = items.flatMap((item) => {
        const { envs, quotas } = item

        return (envs || []).map((env, index) => ({
          env,
          quota: quotas[index],
          rowSpan: !index ? envs.length : 0,
          ...item,
        }))
      })
      setTableDataList(tableDataList)
    } catch (error) {
      message.error(error?.message)
    } finally {
      setIsTableLoading(false)
    }
  }, [clusterId])

  React.useEffect(() => {
    listClusterTenants()
  }, [listClusterTenants])

  const generateUpdatePayload = (record: ITableData, resourceName: string, value: string) => {
    const { envs, quotas, env: currentEnv, description, displayName, tenantCmdbName } = record
    return {
      description,
      tenantCmdbName: tenantCmdbName || displayName,
      envQuotas: envs.map((env, index) => {
        const quota = generateQuota(quotas[index])
        if (env === currentEnv) {
          quota[resourceName] = Number(value)
        }
        quota.memory = `${quota.memory}Gi`
        return {
          env,
          clusterQuota: [
            {
              clusterId,
              quota,
            },
          ],
        }
      }),
    }
  }

  const handleQuotaChange = async (record: ITableData, resourceName: string, value: string) => {
    const { tenantId } = record
    const payload = generateUpdatePayload(record, resourceName, value)
    await tenantControllerUpdateTenant({
      tenantId,
      payload,
    })
    message.success('Change quota succeeded!')
  }

  const renderChildColumns = (parentConfig: IResource): ColumnsType<ITableData> =>
    TENANT_QUOTA_MAPS.map((item) => {
      const key = item.key
      const isQuota = item.quotaName === RESOURCE_INDICATORS.QUOTA
      return {
        title: item.quotaName,
        dataIndex: key,
        width: 100,
        textWrap: 'word-break',
        render: (_, record) => (
          <EditableTableCell
            value={record.quota?.[parentConfig.key]?.[key] ?? 0}
            unit={parentConfig.suffix}
            isCanEdit={isQuota}
            onOk={(value) => handleQuotaChange(record, parentConfig.key, value)}
          />
        ),
      }
    })

  const renderColumns = (): ColumnsType<ITableData> =>
    // gpu is temporarily not supported
    RESOURCE_CONFIG_LIST.filter((item) => item.key !== 'gpu').map((item) => ({
      title: item.before,
      width: 200,
      children: renderChildColumns(item),
    }))

  const columns: ColumnsType<ITableData> = [
    {
      title: 'Tenant',
      dataIndex: 'tenantCmdbName',
      width: 120,
      render: (tenantName: string, record) => ({
        children: tenantName || record.displayName,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
    },
    {
      title: 'Env',
      width: 50,
      dataIndex: 'env',
    },
    ...renderColumns(),
  ]
  return (
    <StyledTable
      rowKey={(record: ITableData) => `${record.tenantId}-${record.env}`}
      bordered
      columns={columns}
      dataSource={tableDataList}
      pagination={false}
      loading={isTableLoading}
    />
  )
}

export default QuotasTable
