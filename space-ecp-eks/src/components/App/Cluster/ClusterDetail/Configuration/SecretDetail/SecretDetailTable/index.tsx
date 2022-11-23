import React from 'react'
import { Table } from 'src/components/App/Cluster/ClusterDetail/Configuration/SecretDetail/SecretDetailTable/style'
import { Card } from 'infrad'
import ValueItem from 'src/components/App/Cluster/ClusterDetail/Configuration/SecretDetail/SecretDetailTable/ValueItem'
import { eksSecretController_listEksSecretDetail } from 'src/swagger-api/apis/EksSecret'
import { IAntdTableChangeParam, listFnWrapper } from 'src/helpers/table'
import { useTable } from 'src/hooks/useTable'
import { DEFAULT_TABLE_PAGINATION } from 'src/constants/pagination'
import { IEksSecretDetail, IListEksSecretDetailResponse } from 'src/swagger-api/models'
import { ColumnsType } from 'antd/lib/table'
import { useParams } from 'react-router-dom'

interface ISecretDetailTableProps {
  namespace: string
  secretName: string
}

const columns: ColumnsType<IEksSecretDetail> = [
  {
    title: 'Key',
    dataIndex: 'secretKey',
    width: '50%',
  },
  {
    title: 'Value',
    dataIndex: 'secretValue',
    width: '50%',
    render: (secretValue: string) => <ValueItem value={secretValue} />,
  },
]

const SecretDetailTable: React.FC<ISecretDetailTableProps> = (props) => {
  const { namespace, secretName } = props
  const { clusterId } = useParams<{
    clusterId: string
  }>()

  const listSecretDetailFn = listFnWrapper(async (args) => {
    const { offset, limit } = args

    const values: IListEksSecretDetailResponse = await eksSecretController_listEksSecretDetail({
      clusterId,
      secretName,
      namespace,
      offset,
      limit,
    })
    const { items, total } = values || {}

    return {
      list: items || [],
      total: total || 0,
    }
  })

  const { tableProps } = useTable((param: IAntdTableChangeParam) => listSecretDetailFn(param), {
    refreshDeps: [clusterId],
    reloadRate: 15000,
  })
  const { pagination } = tableProps

  return (
    <Card style={{ margin: '24px' }}>
      <Table
        {...tableProps}
        columns={columns}
        style={{ marginTop: '16px' }}
        rowKey={(record: IEksSecretDetail) => `${record.secretKey}-${record.secretValue}`}
        pagination={{
          ...pagination,
          ...DEFAULT_TABLE_PAGINATION,
        }}
      />
    </Card>
  )
}

export default SecretDetailTable
