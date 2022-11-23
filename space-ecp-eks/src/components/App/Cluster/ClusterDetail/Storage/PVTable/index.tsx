import { ColumnsType } from 'antd/lib/table'
import React from 'react'
import { StyledTable } from 'src/components/App/Cluster/ClusterDetail/common-styles/table'
import { timestampToLocalTime } from 'src/helpers/time'
import { Badge, Input, Row, Col, Tooltip } from 'infrad'
import { useTable } from 'src/hooks/useTable'
import { DEFAULT_TABLE_PAGINATION } from 'src/constants/pagination'
import { useParams } from 'react-router-dom'
import { eksPvController_litPvs } from 'src/swagger-api/apis/EksPv'
import { IAntdTableChangeParam, listFnWrapper } from 'src/helpers/table'
import { IEksPvItem, IPvcLabel } from 'src/swagger-api/models'
import { CollapsibleSpace } from '@infra/components'
import { StyledTag } from 'src/components/App/Cluster/ClusterDetail/Storage/PVTable/style'

const { Search } = Input

export enum PVStatusTypes {
  AVAILABLE = 'Available',
  RELEASED = 'Released',
  FAILED = 'Failed',
  PENDING = 'Pending',
  BOUND = 'Bound',
}

export const PVStatusColorMap: Record<string, string> = {
  [PVStatusTypes.AVAILABLE]: '#52C41A',
  [PVStatusTypes.RELEASED]: '#2F54EB',
  [PVStatusTypes.FAILED]: '#FF4D4F',
  [PVStatusTypes.PENDING]: '#722ED1',
  [PVStatusTypes.BOUND]: '#13C2C2',
}

const PVTable: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('')
  const [statusList, setStatusList] = React.useState<string[]>([])
  const [accessModeList, setAccessModeList] = React.useState<string[]>([])

  const { clusterId } = useParams<{
    clusterId: string
  }>()

  const listPvFn = listFnWrapper(async (args) => {
    const { filterBy } = args

    const values = await eksPvController_litPvs({
      ...args,
      clusterId: Number(clusterId),
      filterBy,
      searchBy: searchValue,
    })
    const { items, total, statusList, accessModeList } = values || {}

    setStatusList(statusList)
    setAccessModeList(accessModeList)
    return {
      list: items || [],
      total: total || 0,
    }
  })

  const { tableProps } = useTable((param: IAntdTableChangeParam) => listPvFn(param), {
    refreshDeps: [clusterId, searchValue],
    reloadRate: 15000,
  })
  const { pagination } = tableProps

  const columns: ColumnsType<IEksPvItem> = [
    {
      title: 'PV Display Name',
      dataIndex: 'pvName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => <Badge color={PVStatusColorMap[status]} text={status} />,
      filters: statusList?.map((status) => ({
        text: status,
        value: status,
      })),
    },
    {
      title: 'VolumeMode',
      dataIndex: 'volumeMode',
    },
    {
      title: 'Storage',
      dataIndex: 'storage',
    },
    {
      title: 'AccessModes',
      dataIndex: 'accessModes',
      render: (accessModes: string[]) => (
        <div>
          {accessModes?.map((accessMode) => (
            <div key={accessMode}>{accessMode}</div>
          ))}
        </div>
      ),
      filters: accessModeList?.map((accessMode) => ({
        text: accessMode,
        value: accessMode,
      })),
    },
    {
      title: 'PVC Display Name',
      dataIndex: 'pvcName',
      render: (pvName: string, record) =>
        record.status === PVStatusTypes.BOUND ? <>{pvName}</> : <>-</>,
    },
    {
      title: 'Label',
      dataIndex: 'labels',
      width: 170,
      render: (labels: IPvcLabel[]) =>
        labels.length > 0 ? (
          <CollapsibleSpace size={4} direction="vertical">
            {labels.map(({ key, value }) => (
              <Tooltip
                key={`${key}-${value}`}
                title={`${key}=${value}`}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
              >
                <StyledTag>{`${key}=${value}`}</StyledTag>
              </Tooltip>
            ))}
          </CollapsibleSpace>
        ) : (
          <>-</>
        ),
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      render: (updateTime: string) => timestampToLocalTime(updateTime),
    },
  ]

  return (
    <div style={{ marginTop: '16px' }}>
      <Row justify="end">
        <Col>
          <Search
            placeholder="Search in Display Name"
            style={{ width: 448 }}
            onSearch={setSearchValue}
          />
        </Col>
      </Row>
      <StyledTable
        {...tableProps}
        columns={columns}
        style={{ marginTop: '16px' }}
        rowKey="pvName"
        pagination={{
          ...pagination,
          ...DEFAULT_TABLE_PAGINATION,
        }}
      />
    </div>
  )
}
export default PVTable
