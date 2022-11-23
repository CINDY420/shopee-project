import * as React from 'react'
import IncrementalBatchOperation from 'components/App/ResourceManagement/Incremental/IncrementalBatchOperation'
import ActionBar from 'components/App/ResourceManagement/Incremental/ActionBar'
import ResourceTable from 'components/App/ResourceManagement/common/ResourceTable'
import { INCREMENTAL_COLUMNS } from 'components/App/ResourceManagement/common/ResourceTable/columnGroups'
import { IFrontEndIncrement } from 'swagger-api/v1/models'
import {
  ISduResourceControllerListIncrementParams,
  sduResourceControllerListIncrement
} from 'swagger-api/v1/apis/SduResource'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { RESOURCE_MANAGEMENT_TYPE } from 'components/App/ResourceManagement'

export interface ISearchValues extends Omit<ISduResourceControllerListIncrementParams, 'limit' | 'offset'> {}

const Incremental: React.FC = () => {
  const [searchValues, setSearchValues] = React.useState<ISearchValues>()
  const [isBatchOperating, setIsBatchOperating] = React.useState(false)
  const [selectedRows, setSelectedRows] = React.useState<IFrontEndIncrement[]>([])

  const fetchFn = React.useCallback(
    args => {
      return sduResourceControllerListIncrement({
        ...searchValues,
        ...args
      })
    },
    [searchValues]
  )

  const [incrementalListState, incrementalListFn] = useAsyncIntervalFn(fetchFn)
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: incrementalListFn })
  const { data = [], total = 0 } = incrementalListState.value || {}

  React.useEffect(() => {
    refresh()
  }, [refresh, searchValues])

  return (
    <>
      <ActionBar isBatchOperating={isBatchOperating} getSearchValues={setSearchValues} refresh={refresh}>
        <IncrementalBatchOperation
          isBatchOperating={isBatchOperating}
          onBatchOperationStatusChange={setIsBatchOperating}
          selectedTableRows={selectedRows}
          refreshTableFn={refresh}
          searchAllValues={Object.assign(searchValues || {}, { limit: total, offset: 0 })}
        />
      </ActionBar>
      <ResourceTable
        loading={incrementalListState.loading}
        dataColumns={INCREMENTAL_COLUMNS}
        dataSource={data}
        resourceType={RESOURCE_MANAGEMENT_TYPE.INCREMENTAL}
        isBatchOperating={isBatchOperating}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        onChange={handleTableChange}
        pagination={{
          ...TABLE_PAGINATION_OPTION,
          ...pagination,
          total
        }}
        refresh={refresh}
      />
    </>
  )
}

export default Incremental
