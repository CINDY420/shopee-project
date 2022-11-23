import React from 'react'
import { StyledTable } from 'src/components/App/Cluster/ClusterDetail/common-styles/table'
import { ColumnsType } from 'antd/lib/table'
import { Badge, Select, Input, Row, Col, Tooltip } from 'infrad'
import { timestampToLocalTime } from 'src/helpers/time'
import {
  eksPvcController_listPvcs,
  eksPvcController_getPvcNameSpace,
} from 'src/swagger-api/apis/EksPvc'
import { useParams } from 'react-router-dom'
import { IAntdTableChangeParam, listFnWrapper } from 'src/helpers/table'
import { listQuery } from '@infra/utils'
import { useTable } from 'src/hooks/useTable'
import { IEksPvcItem, IPvcLabel } from 'src/swagger-api/models'
import { DEFAULT_TABLE_PAGINATION } from 'src/constants/pagination'
import { useRequest } from 'ahooks'
import { CollapsibleSpace } from '@infra/components'
import { StyledTag } from 'src/components/App/Cluster/ClusterDetail/Storage/PVCTable/style'

const { FilterByBuilder, FilterByParser, FilterByOperator } = listQuery

const { Search } = Input

export enum PVCStatusTypes {
  PENDING = 'Pending',
  BOUND = 'Bound',
  LOST = 'Lost',
}

export const PVCStatusColorMap: Record<string, string> = {
  [PVCStatusTypes.PENDING]: '#722ED1',
  [PVCStatusTypes.BOUND]: '#13C2C2',
  [PVCStatusTypes.LOST]: '#D9D9D9',
}

const PVCTable: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('')
  const [statusList, setStatusList] = React.useState<string[]>([])
  const [accessModeList, setAccessModeList] = React.useState<string[]>([])
  const [selectedNamespace, setSelectedNamespace] = React.useState('')

  const { clusterId } = useParams<{
    clusterId: string
  }>()

  const { data, loading: namespaceLoading } = useRequest(() =>
    eksPvcController_getPvcNameSpace({
      clusterId: Number(clusterId),
    }),
  )

  const listPvcFn = listFnWrapper(async (args) => {
    const { filterBy } = args

    const filterByItems = new FilterByParser(filterBy).parse()
    const filterByWithNamespaceBuilder = new FilterByBuilder(filterByItems)
    if (selectedNamespace) {
      filterByWithNamespaceBuilder.append({
        keyPath: 'namespace',
        operator: FilterByOperator.EQUAL,
        value: selectedNamespace,
      })
    }
    const filterByWithNamespace = filterByWithNamespaceBuilder.build()

    const values = await eksPvcController_listPvcs({
      ...args,
      clusterId: Number(clusterId),
      searchBy: searchValue,
      filterBy: filterByWithNamespace?.length > 0 ? filterByWithNamespace : undefined,
    })
    const { items, total, statusList, accessModeList } = values || {}

    setStatusList(statusList)
    setAccessModeList(accessModeList)
    return {
      list: items || [],
      total: total || 0,
    }
  })

  const { tableProps } = useTable((param: IAntdTableChangeParam) => listPvcFn(param), {
    refreshDeps: [clusterId, searchValue, selectedNamespace],
    reloadRate: 15000,
  })

  const { pagination } = tableProps

  const columns: ColumnsType<IEksPvcItem> = [
    {
      title: 'PVC Display Name',
      dataIndex: 'pvcName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => <Badge color={PVCStatusColorMap[status]} text={status} />,
      filters: statusList?.map((status: string) => ({ text: status, value: status })),
    },
    {
      title: 'Storage',
      dataIndex: 'storage',
    },
    {
      title: 'AccessModes',
      dataIndex: 'accessModes',
      render: (accessModes: string[]) => (
        <>
          {accessModes?.map((accessMode) => (
            <>{accessMode}</>
          ))}
        </>
      ),
      filters: accessModeList?.map((accessMode: string) => ({
        text: accessMode,
        value: accessMode,
      })),
    },
    {
      title: 'PV Display Name',
      dataIndex: 'pvName',
      render: (pvName: string, record) =>
        record.status === PVCStatusTypes.BOUND ? <>{pvName}</> : <>-</>,
    },
    {
      title: 'Label',
      dataIndex: 'labels',
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
      title: 'Update Time',
      dataIndex: 'updateTime',
      render: (updateTime: string) => timestampToLocalTime(updateTime),
    },
  ]

  return (
    <div style={{ marginTop: '16px' }}>
      <Row justify="space-between" id="namespace-select-trigger-node">
        <Col>
          <span style={{ marginRight: '8px' }}>NameSpace: </span>
          <Select
            allowClear
            showSearch
            loading={namespaceLoading}
            style={{ width: 180 }}
            value={selectedNamespace}
            onChange={(value) => setSelectedNamespace(value)}
            dropdownMatchSelectWidth={false}
            options={data?.namespaceList?.map((namespace) => ({
              label: namespace,
              value: namespace,
            }))}
            filterOption={(input, option) => {
              const searchBy = input.trim()
              return (
                searchBy.length === 0 || option.label.toLowerCase().includes(searchBy.toLowerCase())
              )
            }}
            getPopupContainer={() => document.getElementById('namespace-select-trigger-node')}
          />
        </Col>
        <Col>
          <Search
            placeholder="Search in Display Name  "
            style={{ width: 448 }}
            onSearch={(value) => setSearchValue(value)}
          />
        </Col>
      </Row>
      <StyledTable
        {...tableProps}
        columns={columns}
        style={{ marginTop: '16px' }}
        rowKey="pvcName"
        pagination={{
          ...pagination,
          ...DEFAULT_TABLE_PAGINATION,
        }}
      />
    </div>
  )
}
export default PVCTable
