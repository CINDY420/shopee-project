import ResourceTable from 'components/App/ResourceManagement/common/ResourceTable'
import * as React from 'react'
import StockBatchOperation from 'components/App/ResourceManagement/Stock/StockBatchOperation'
import ActionBar from 'components/App/ResourceManagement/Stock/ActionBar'
import { STOCK_COLUMNS } from 'components/App/ResourceManagement/common/ResourceTable/columnGroups'
import { IFrontEndStock } from 'swagger-api/v1/models'
import { ISduResourceControllerListStockParams, sduResourceControllerListStock } from 'swagger-api/v1/apis/SduResource'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { RESOURCE_MANAGEMENT_TYPE } from 'components/App/ResourceManagement'

export interface ISearchValues extends Omit<ISduResourceControllerListStockParams, 'limit' | 'offset'> {}

const Stock: React.FC = () => {
  const [searchValues, setSearchValues] = React.useState<ISearchValues>()
  const [isViewAllDetails, setIsViewAllDetails] = React.useState(false)
  const [isBatchOperating, setIsBatchOperating] = React.useState(false)
  const [selectedRows, setSelectedRows] = React.useState<IFrontEndStock[]>([])

  const fetchFn = React.useCallback(
    args => {
      setIsViewAllDetails(false)
      return sduResourceControllerListStock({
        ...searchValues,
        ...args
      })
    },
    [searchValues]
  )

  const [stockListState, stockListFn] = useAsyncIntervalFn(fetchFn)
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: stockListFn })
  const { data = [], total = 0 } = stockListState.value || {}

  React.useEffect(() => {
    refresh()
    setIsViewAllDetails(false)
  }, [refresh, searchValues])

  return (
    <>
      <ActionBar
        isBatchOperating={isBatchOperating}
        getSearchValues={setSearchValues}
        isViewAllDetails={isViewAllDetails}
        onViewAllDetailsChange={setIsViewAllDetails}
      >
        <StockBatchOperation
          isBatchOperating={isBatchOperating}
          onBatchOperationStatusChange={setIsBatchOperating}
          selectedTableRows={selectedRows}
          refreshTableFn={refresh}
          searchAllValues={Object.assign(searchValues || {}, { limit: total, offset: 0 })}
        />
      </ActionBar>
      <ResourceTable
        loading={stockListState.loading}
        resourceType={RESOURCE_MANAGEMENT_TYPE.STOCK}
        dataColumns={STOCK_COLUMNS}
        isBatchOperating={isBatchOperating}
        dataSource={data}
        isViewAllDetails={isViewAllDetails}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        onChange={handleTableChange}
        refresh={refresh}
        pagination={{
          ...TABLE_PAGINATION_OPTION,
          ...pagination,
          total
        }}
      />
    </>
  )
}

export default Stock
