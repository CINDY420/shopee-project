import React, { useRef } from 'react'
import { Table } from 'common-styles/table'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import useAntdTable from 'hooks/useAntdTable'
import { ITableParams } from 'types/table'
import { Input, InputRef, Row } from 'infrad'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { IListOperationRecordsItem, IListOperationRecordsResponse } from 'swagger-api/models'
import { ColumnsType } from 'infrad/lib/table/Table'
import { useDebounce } from 'react-use'
import { operationControllerListOperationRecords } from 'swagger-api/apis/Operation'
import { SearchOutlined } from 'infra-design-icons'
import { ColumnType } from 'infrad/lib/table'
import {
  ContentWrapper,
  StyledButton,
  StyledDatePicker,
} from 'components/App/OperationHistory/style'
import DetailLayout from 'components/Common/DetailLayout'
import CrudModal from 'components/Common/CrudModal'
import { RangeValue } from 'rc-picker/lib/interface'
import { generateUnixTimestamp } from 'helpers/format'
import { ISearchValue, formatSearchBy } from 'helpers/operationHistory'
import dayjs from 'dayjs'
import HistoryDetail from 'components/App/OperationHistory/HistoryDetail'

type IDataIndex = keyof IListOperationRecordsItem

const OperationHistory = () => {
  const searchInput = useRef<InputRef>(null)
  const [searchValue, setSearchValue] = React.useState<ISearchValue>()
  const [startTime, setStartTime] = React.useState<number>()
  const [endTime, setEndTime] = React.useState<number>()
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [detailOperationRecordId, setDetailOperationRecordId] = React.useState('')

  const listOperationRecordsFnWithResource = React.useCallback(
    (tableQueryParams: ITableParams) =>
      operationControllerListOperationRecords({
        ...tableQueryParams,
        startTime,
        endTime,
        searchBy: formatSearchBy(searchValue),
      }),
    [searchValue, startTime, endTime],
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
      width: 90,
      ...getColumnSearchProps('category'),
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: 90,
      ...getColumnSearchProps('operation'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 180,
      ...getColumnSearchProps('description'),
    },
    {
      title: 'Operator',
      dataIndex: 'operator',
      width: 60,
    },
    {
      title: 'Operation Time',
      dataIndex: 'operationTime',
      width: 60,
    },
    {
      title: 'Detail',
      width: 50,
      render: (_, record) => (
        <StyledButton type="link" onClick={() => handleViewDetail(record)}>
          Detail
        </StyledButton>
      ),
    },
  ]

  return (
    <DetailLayout
      title="Operation History"
      isHeaderWithBottomLine
      isHeaderWithBreadcrumbs={false}
      body={
        <ContentWrapper>
          <Row>
            <StyledDatePicker
              onChange={handleDateChange}
              disabledDate={(current) => current && current > new Date()}
            />
          </Row>

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
        </ContentWrapper>
      }
    />
  )
}

export default OperationHistory
