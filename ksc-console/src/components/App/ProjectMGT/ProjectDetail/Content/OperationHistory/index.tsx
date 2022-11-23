import React, { useRef } from 'react'
import { Table } from 'common-styles/table'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import useAntdTable from 'hooks/useAntdTable'
import { useParams } from 'react-router'
import { ITableParams } from 'types/table'
import { Input, InputRef } from 'infrad'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { IListOperationRecordsItem, IListOperationRecordsResponse } from 'swagger-api/models'
import {
  StyledButton,
  StyledDatePicker,
} from 'components/App/ProjectMGT/ProjectDetail/Content/OperationHistory/style'
import { ColumnsType } from 'infrad/lib/table/Table'
import { useDebounce } from 'react-use'
import { operationControllerListOperationRecords } from 'swagger-api/apis/Operation'
import { SearchOutlined } from 'infra-design-icons'
import { ColumnType } from 'infrad/lib/table'
import { getSession } from 'helpers/session'
import CrudModal from 'components/Common/CrudModal'
import { RangeValue } from 'rc-picker/lib/interface'
import { generateUnixTimestamp } from 'helpers/format'
import { ISearchValue, formatSearchBy } from 'helpers/operationHistory'
import dayjs from 'dayjs'
import HistoryDetail from 'components/App/OperationHistory/HistoryDetail'

type IDataIndex = keyof IListOperationRecordsItem

const OperationHistory = () => {
  const searchInput = useRef<InputRef>(null)
  const params = useParams()
  const { tenantId, projectId } = params
  const { email } = getSession()
  const [searchValue, setSearchValue] = React.useState<ISearchValue>()
  const [startTime, setStartTime] = React.useState<number>()
  const [endTime, setEndTime] = React.useState<number>()
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [detailOperationRecordId, setDetailOperationRecordId] = React.useState('')

  const listOperationRecordsFnWithResource = React.useCallback(
    (tableQueryParams: ITableParams) => {
      if (tenantId && projectId)
        return operationControllerListOperationRecords({
          ...tableQueryParams,
          startTime,
          endTime,
          searchBy: formatSearchBy(searchValue),
          filterBy: `operator==${email};tenantId==${tenantId};projectId==${projectId}`,
        })
    },
    [endTime, startTime, searchValue],
  )
  const [listOperationRecordsState, listOperationRecordsFn] =
    useAsyncIntervalFn<IListOperationRecordsResponse>(listOperationRecordsFnWithResource)
  const { pagination, handleTableChange, refresh } = useAntdTable({
    fetchFn: listOperationRecordsFn,
  })
  const { total, items: operationRecordLists } = listOperationRecordsState.value || {}

  useDebounce(
    () => {
      searchValue !== undefined && refresh()
    },
    500,
    [searchValue],
  )

  React.useEffect(() => {
    refresh()
  }, [startTime, endTime])

  const handleSearchChange = (value: string, dataIndex: string) => {
    setSearchValue({
      ...searchValue,
      [dataIndex]: value,
    })
  }

  const handleDateChange = (dates: RangeValue<Date>) => {
    setStartTime(dates ? generateUnixTimestamp(dayjs(dates[0]).startOf('day').toDate()) : undefined)
    setEndTime(dates ? generateUnixTimestamp(dayjs(dates[1]).endOf('day').toDate()) : undefined)
  }

  const getColumnSearchProps = (dataIndex: IDataIndex): ColumnType<IListOperationRecordsItem> => ({
    filterDropdown: () => (
      <Input.Search
        allowClear
        ref={searchInput}
        placeholder={`Search ${dataIndex as string}`}
        onSearch={(value: string) => handleSearchChange(value, dataIndex)}
      />
    ),
    filterIcon: () => (
      <SearchOutlined style={{ color: searchValue?.[dataIndex] ? '#2673dd' : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
  })

  const handleViewDetail = (record: IListOperationRecordsItem) => {
    const { operationRecordId } = record
    setDetailOperationRecordId(operationRecordId)
    setIsModalVisible(true)
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
  }

  const columns: ColumnsType<IListOperationRecordsItem> = [
    {
      title: 'Category',
      dataIndex: 'category',
      ...getColumnSearchProps('category'),
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      ...getColumnSearchProps('operation'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      ...getColumnSearchProps('description'),
    },
    {
      title: 'Operator',
      dataIndex: 'operator',
    },
    {
      title: 'Operation Time',
      dataIndex: 'operationTime',
    },
    {
      title: 'Detail',
      render: (_, record) => (
        <StyledButton type="link" onClick={() => handleViewDetail(record)}>
          Detail
        </StyledButton>
      ),
    },
  ]

  return (
    <>
      <StyledDatePicker
        onChange={handleDateChange}
        disabledDate={(current) => current && current > new Date()}
      />
      <Table
        rowKey="operationRecordId"
        columns={columns}
        dataSource={operationRecordLists}
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          ...TABLE_PAGINATION_OPTION,
          total,
        }}
      />
      <CrudModal
        title="View Operation Record"
        width={1300}
        visible={isModalVisible}
        destroyOnClose
        footer={null}
        closable
        onCancel={handleModalCancel}
      >
        <HistoryDetail operationRecordId={detailOperationRecordId} />
      </CrudModal>
    </>
  )
}

export default OperationHistory
