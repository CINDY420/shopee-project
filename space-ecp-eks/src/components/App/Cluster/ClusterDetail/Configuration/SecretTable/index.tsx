import { Select, Input, TableColumnType, Tooltip } from 'infrad'
import {
  SearchHeader,
  StyledTag,
} from 'src/components/App/Cluster/ClusterDetail/Configuration/SecretTable/style'
import {
  eksSecretController_listEksSecrets,
  eksSecretController_listAllNamespaces,
  eksSecretController_listAllTypes,
} from 'src/swagger-api/apis/EksSecret'
import { IEksSecret } from 'src/swagger-api/models'
import { useRequest } from 'ahooks'
import { IAntdTableChangeParam, listFnWrapper } from 'src/helpers/table'
import { timestampToLocalTime } from 'src/helpers/time'
import { DEFAULT_TABLE_PAGINATION } from 'src/constants/pagination'
import { Link } from 'react-router-dom'
import { CollapsibleSpace } from '@infra/components'
import { listQuery } from '@infra/utils'
import { buildSecretDetailRoute } from 'src/helpers/route'
import { ClusterDetailContext } from 'src/components/App/Cluster/ClusterDetail/context'
import { useContext, useState } from 'react'
import { useTable } from 'src/hooks/useTable'
import { StyledTable } from 'src/components/App/Cluster/ClusterDetail/common-styles/table'

const { FilterByBuilder, FilterByParser, FilterByOperator } = listQuery

const SecretTable: React.FC = () => {
  const clusterDetail = useContext(ClusterDetailContext)
  const [selectedNamespace, setSelectedNamespace] = useState<string>()
  const [searchValue, setSearchValue] = useState<string>()

  const handleNamespaceSelect = (value: string) => setSelectedNamespace(value)
  const handleSearch = (value: string) => setSearchValue(value)

  const { data: namespaceResponse, loading: namespaceLoading } = useRequest(() =>
    eksSecretController_listAllNamespaces({
      clusterId: clusterDetail.clusterId,
    }),
  )
  const { data: typesResponse } = useRequest(() =>
    eksSecretController_listAllTypes({ clusterId: clusterDetail.clusterId }),
  )

  const columns: TableColumnType<IEksSecret>[] = [
    {
      title: 'Secret Display Name',
      dataIndex: 'secretName',
      key: 'secret-name',
      render: (name: string, record) => (
        <Link
          to={buildSecretDetailRoute({
            clusterId: clusterDetail.clusterId,
            namespace: record.namespace,
            secretName: record.secretName,
          })}
        >
          {name}
        </Link>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: typesResponse?.items?.map((type) => ({ text: type, value: type })),
    },
    {
      title: 'Label',
      dataIndex: 'labels',
      key: 'label',
      render: (labels: string[]) =>
        labels.length > 0 ? (
          <CollapsibleSpace size={4} direction="vertical">
            {labels.map((label) => (
              <Tooltip
                key={label}
                title={label}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
              >
                <StyledTag>{label}</StyledTag>
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
      key: 'update-time',
      render: (time: string) => timestampToLocalTime(time),
    },
  ]
  const listSecretsFn = listFnWrapper(async ({ filterBy, ...others }) => {
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
    const { items, total } = await eksSecretController_listEksSecrets({
      clusterId: clusterDetail.clusterId,
      filterBy: filterByWithNamespace?.length > 0 ? filterByWithNamespace : undefined,
      searchBy: searchValue?.length > 0 ? searchValue : undefined,
      ...others,
    })
    return { total, list: items }
  })

  const { tableProps } = useTable((param: IAntdTableChangeParam) => listSecretsFn(param), {
    refreshDeps: [selectedNamespace, searchValue],
  })
  const { pagination } = tableProps

  return (
    <div>
      <SearchHeader id="namespace-select-trigger-node">
        Namespace:
        <Select
          allowClear
          showSearch
          loading={namespaceLoading}
          style={{ marginLeft: '8px', width: '180px' }}
          dropdownMatchSelectWidth={false}
          onChange={handleNamespaceSelect}
          options={namespaceResponse?.items?.map((namespace) => ({
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
          dropdownStyle={{ maxWidth: '32px' }}
        />
        <Input.Search
          style={{ float: 'right', width: '448px' }}
          placeholder="Search in Display Name"
          onSearch={handleSearch}
          allowClear
        />
      </SearchHeader>
      <StyledTable
        columns={columns}
        {...tableProps}
        pagination={{ ...pagination, ...DEFAULT_TABLE_PAGINATION }}
      />
    </div>
  )
}

export default SecretTable
