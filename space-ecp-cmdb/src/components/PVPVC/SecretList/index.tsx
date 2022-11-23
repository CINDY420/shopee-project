import * as React from 'react'
import { ColumnsType } from 'infrad/lib/table'
import { TABLE_PAGINATION_OPTION } from 'src/constants/pagination'
import { Table } from 'src/common-styles/table'
import { fetch } from 'src/rapper'
import useTable from 'src/hooks/useTable'
import { formatTime } from 'src/helpers/format'
import { Button, message, Modal, Space } from 'infrad'
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
import { Header, StyledLinkButton } from 'src/components/PVPVC/SecretList/style'
import OperateSecret from 'src/components/PVPVC/SecretList/OperateSecret'

export type Secret = IModels['GET/api/ecp-cmdb/services/{serviceId}/pvSecrets']['Res']['items'][0]

const { useSelectedService } = hooks

interface ISecretListProps {
  envList: string[]
  azList: string[]
}

const SecretList: React.FC<ISecretListProps> = ({ envList, azList }) => {
  const { selectedService } = useSelectedService()
  const { service_id: serviceId } = selectedService
  const [searchSecretValue, setSesarchSecretvalue] = React.useState<string>('')
  const [modalVisible, setModalVisible] = React.useState(false)
  const [editingSecret, setEditingSecret] = React.useState<Secret>(undefined)

  const columns: ColumnsType<Secret> = [
    {
      title: 'Secret Display Name',
      dataIndex: 'name',
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
    },
    {
      title: ' USS App ID',
      dataIndex: 'ussAppid',
    },
    {
      title: 'Intranet Domain',
      dataIndex: 'intranetDomain',
    },
    {
      title: 'Env',
      dataIndex: 'env',
      filters: envList.map((item) => ({ text: item.toLocaleUpperCase(), value: item })),
    },
    {
      title: 'AZ',
      dataIndex: 'az',
      filters: azList.map((item) => ({ text: item, value: item })),
    },
    {
      title: 'Update Time',
      dataIndex: 'updatedAt',
      sorter: true,
      render: (time: string) => formatTime(Number(time)),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Space>
          <StyledLinkButton type="link" onClick={() => editSecret(record)}>
            Edit
          </StyledLinkButton>
          <StyledLinkButton type="link" onClick={() => deleteSecret(record.uuid)}>
            Delete
          </StyledLinkButton>
        </Space>
      ),
    },
  ]

  const getSecretList = async (
    { current, pageSize, filters, sorter }: Params[0],
    params: { serviceId: string },
  ) => {
    const { serviceId } = params
    const searchBy = getFilterUrlParam({
      searchValue: getFilterItem('name', searchSecretValue, FilterTypes.CONTAIN),
    })
    const { offset, limit, filterBy, orderBy } = getTableProps({
      pagination: { current, pageSize },
      filters,
      sorter,
    })

    const { items, total } = await fetch['GET/api/ecp-cmdb/services/{serviceId}/pvSecrets']({
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
      getSecretList(args, {
        serviceId,
      }),
    {
      refreshDeps: [serviceId, searchSecretValue],
    },
  )

  const editSecret = (secret: Secret) => {
    setEditingSecret(secret)
    setModalVisible(true)
  }

  const deleteSecret = (uuid: string) => {
    Modal.confirm({
      title: 'Notice',
      icon: null,
      content: (
        <>
          Running resources using this secret will <strong>FAIL</strong>. Are you sure to delete the
          secret?
        </>
      ),
      okText: 'Confirm',
      onOk: async () => {
        await fetch['DELETE/api/ecp-cmdb/pvSecrets/{uuid}']({ uuid })
        message.success('Delete succeeded.')
        refreshAsync()
      },
    })
  }

  const handleModalVisibleChange = (visible: boolean) => {
    if (!visible) {
      setEditingSecret(undefined)
    }
    setModalVisible(visible)
  }

  return (
    <>
      <Header>
        <DebouncedSearch
          allowClear
          placeholder="Search by Secret Display Name"
          style={{ width: 280 }}
          debounceTime={300}
          callback={setSesarchSecretvalue}
          defaultValue={searchSecretValue}
        />
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Create Secret
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
      <OperateSecret
        envList={envList}
        azList={azList}
        secret={editingSecret}
        visible={modalVisible}
        onVisibleChange={handleModalVisibleChange}
        onRefresh={refreshAsync}
      />
    </>
  )
}

export default SecretList
