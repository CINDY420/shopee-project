import * as React from 'react'
import { ColumnsType } from 'infrad/lib/table'
import { TABLE_PAGINATION_OPTION } from 'src/constants/pagination'
import { Table } from 'src/common-styles/table'
import { fetch } from 'src/rapper'
import useTable from 'src/hooks/useTable'
import { formatTime } from 'src/helpers/format'
import { Button, message, Modal, Space, Tag } from 'infrad'
import DebouncedSearch from 'src/components/Common/DebouncedSearch'
import {
  FilterTypes,
  getFilterItem,
  getFilterUrlParam,
  getTableProps,
} from 'src/helpers/tableProps'
import { Params } from 'ahooks/lib/useAntdTable/types'
import { IModels } from 'src/rapper/request'
import hooks from 'src/sharedModules/cmdb/hooks'
import { Header, StyledLinkButton } from 'src/components/PVPVC/PVList/style'
import OperatePV from 'src/components/PVPVC/PVList/OperatePV'

export type PV = IModels['GET/api/ecp-cmdb/services/{serviceId}/pvs']['Res']['items'][0]

const { useSelectedService } = hooks

const PVStatus = {
  BOUND: 'Bound',
  FAILED: 'Failed',
}

const PVStatusColor = {
  [PVStatus.BOUND]: 'green',
  [PVStatus.FAILED]: 'red',
}

interface IPVListProps {
  envList: string[]
  cidList: string[]
  azList: string[]
}

const PVList: React.FC<IPVListProps> = ({ envList, cidList, azList }) => {
  const { selectedService } = useSelectedService()
  const { service_id: serviceId } = selectedService
  const [searchPVValue, setSesarchPVvalue] = React.useState<string>('')
  const [modalVisible, setModalVisible] = React.useState(false)
  const [retryingPV, setRetryingPV] = React.useState<PV>(undefined)

  const columns: ColumnsType<PV> = [
    {
      title: 'PV / PVC Display Name',
      dataIndex: 'name',
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
    },
    {
      title: 'Env',
      dataIndex: 'env',
      filters: envList.map((item) => ({ text: item.toLocaleUpperCase(), value: item })),
    },
    {
      title: 'CID',
      dataIndex: 'cid',
      filters: cidList.map((item) => ({ text: item.toLocaleUpperCase(), value: item })),
    },
    {
      title: 'AZ',
      dataIndex: 'az',
      filters: azList.map((item) => ({ text: item, value: item })),
    },
    {
      title: 'Secret',
      dataIndex: 'secret',
    },
    {
      title: 'Access Mode',
      dataIndex: 'accessMode',
    },
    {
      title: 'Sub Path',
      dataIndex: 'subpath',
    },
    {
      title: 'PV Status',
      dataIndex: 'status',
      filters: Object.values(PVStatus).map((item) => ({ text: item, value: item })),
      render: (status) => <Tag color={PVStatusColor[status]}>{status}</Tag>,
    },
    {
      title: 'Update Time',
      dataIndex: 'updatedAt',
      sorter: true,
      render: (time: number) => formatTime(Number(time)),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Space>
          <StyledLinkButton type="link" onClick={() => deletePV(record.uuid)}>
            Delete
          </StyledLinkButton>
          {record?.status === PVStatus.FAILED && (
            <StyledLinkButton type="link" onClick={() => retryCreatePV(record)}>
              Retry
            </StyledLinkButton>
          )}
        </Space>
      ),
    },
  ]

  const getPVList = async (
    { current, pageSize, filters, sorter }: Params[0],
    params: { serviceId: string },
  ) => {
    const { serviceId } = params
    const searchBy = getFilterUrlParam(
      {
        searchName: getFilterItem('name', searchPVValue, FilterTypes.CONTAIN),
        searchId: getFilterItem('uuid', searchPVValue, FilterTypes.CONTAIN),
      },
      { or: true },
    )
    const { offset, limit, filterBy, orderBy } = getTableProps({
      pagination: { current, pageSize },
      filters,
      sorter,
    })

    const { items, total } = await fetch['GET/api/ecp-cmdb/services/{serviceId}/pvs']({
      serviceId,
      offset,
      limit,
      filterBy,
      orderBy,
      searchBy,
    })
    return {
      list: items || [],
      total: total || 0,
    }
  }

  const { tableProps, refreshAsync } = useTable(
    (args) =>
      getPVList(args, {
        serviceId,
      }),
    {
      refreshDeps: [serviceId, searchPVValue],
    },
  )

  const retryCreatePV = (pv: PV) => {
    setRetryingPV(pv)
    setModalVisible(true)
  }

  const handleModalVisibleChange = (visible: boolean) => {
    if (!visible) {
      setRetryingPV(undefined)
    }
    setModalVisible(visible)
  }

  const deletePV = (uuid: string) => {
    Modal.confirm({
      title: 'Notice',
      icon: null,
      content: (
        <>
          Running resources using this PV will <strong>FAIL</strong>. Are you sure to delete this
          PV?
        </>
      ),
      okText: 'Confirm',
      onOk: async () => {
        await fetch['DELETE/api/ecp-cmdb/pvs/{uuid}']({ uuid })
        message.success('Delete succeeded.')
        refreshAsync()
      },
    })
  }

  return (
    <>
      <Header>
        <DebouncedSearch
          allowClear
          placeholder="Search by PV Display name/UUID"
          style={{ width: 280 }}
          debounceTime={300}
          callback={setSesarchPVvalue}
          defaultValue={searchPVValue}
        />
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Create PV/PVC
        </Button>
      </Header>
      <Table
        {...tableProps}
        rowKey="uuid"
        columns={columns}
        pagination={{
          ...TABLE_PAGINATION_OPTION,
          ...tableProps.pagination,
        }}
        scroll={{ x: '100%' }}
      />
      <OperatePV
        envList={envList}
        cidList={cidList}
        azList={azList}
        pv={retryingPV}
        visible={modalVisible}
        onVisibleChange={handleModalVisibleChange}
        onRefresh={refreshAsync}
      />
    </>
  )
}

export default PVList
