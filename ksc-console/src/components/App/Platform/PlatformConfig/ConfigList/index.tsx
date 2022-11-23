import React from 'react'
import { useDebounce } from 'react-use'
import TableSearchInput from 'components/Common/TableSearchInput'
import useAntdTable from 'hooks/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'

import { IListTenantsResponse, ITenantListItem } from 'swagger-api/models'
import { ITableParams } from 'types/table'
import { Table } from 'common-styles/table'
import { Col, Form, message, Modal, Row, Tag } from 'infrad'
import { ColumnsType } from 'infrad/lib/table'
import { ExclamationCircleOutlined } from 'infra-design-icons'
import BatchActionFooter from 'components/Common/BatchActionFooter'
import CrudModal from 'components/Common/CrudModal'
import { StyledCreateButton } from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/style'
import { StyledButton } from 'components/App/Platform/PlatformConfig/ConfigList/style'
import LimitingModalForm from 'components/App/Platform/PlatformConfig/ConfigList/LimitingModalForm'
import FuseModalForm from 'components/App/Platform/PlatformConfig/ConfigList/FuseModalForm'
import {
  tenantControllerBatchUpdateTenantFuses,
  tenantControllerListTenants,
} from 'swagger-api/apis/Tenant'
import { clusterControllerUpdateCluster } from 'swagger-api/apis/Cluster'

enum IActions {
  FUSE = 'Fuse',
  LIMITING = 'Limiting',
}

const PlatformConfigList = () => {
  const [searchValue, setSearchValue] = React.useState<string>()
  const [batchActionFooterTitle, setBatchActionFooterTitle] = React.useState('')
  const [selectedTenants, setSelectedTenants] = React.useState<string[]>([])
  const [modalTitle, setModalTitle] = React.useState('')
  const [isModalSubmitLoading, setIsModalSubmitLoading] = React.useState(false)

  const [fuseForm] = Form.useForm()
  const [limitingForm] = Form.useForm()

  const listTenantsFnWithResource = React.useCallback(
    (tableQueryParams: ITableParams) =>
      tenantControllerListTenants({
        ...tableQueryParams,
        searchBy: searchValue,
      }),
    [searchValue],
  )
  const [listTenantsState, listTenantsFn] =
    useAsyncIntervalFn<IListTenantsResponse>(listTenantsFnWithResource)
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listTenantsFn })
  const { total, items: jobLists } = listTenantsState.value || {}

  useDebounce(
    () => {
      searchValue !== undefined && refresh()
    },
    500,
    [searchValue],
  )

  const handleBatchActionCancel = () => {
    setSelectedTenants([])
    setBatchActionFooterTitle('')
  }
  const handleBatchActionConfirm = () => {
    if (selectedTenants.length === 0) {
      message.warning('Please select tenants')
      return
    }
    Modal.confirm({
      title: 'Batch Delete',
      icon: <ExclamationCircleOutlined />,
      content:
        'Are you sure to batch delete the selected tenants? The operation is not reversible!',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: handleBatchActionModalOk,
    })
  }
  const handleBatchActionModalOk = async () => {
    // handle delete
    try {
      await tenantControllerBatchUpdateTenantFuses({
        payload: {
          tenantIds: selectedTenants,
          fuseEnvs: [],
        },
      })
      handleBatchActionCancel()
      refresh()
      message.success('Delete successfully')
    } catch (error) {
      message.error(error?.message || 'Delete failed')
    }
  }

  const handleSelectedTenantsChange = (tenants: string[]) => {
    setSelectedTenants(tenants)
  }

  const handleLimitingSubmit = async () => {
    const formValue = await limitingForm.validateFields()
    const { schedulePodPerSecond, clusterId } = formValue
    Modal.confirm({
      title: 'Limiting',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure to limit the pod schedule: ${schedulePodPerSecond} pods / second`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        setIsModalSubmitLoading(true)
        try {
          await clusterControllerUpdateCluster({
            clusterId,
            payload: { schedulePodPerSecond },
          })
          handleModalCancel()
          refresh()
          message.success('Limiting successfully')
        } catch (error) {
          message.error(error?.message || 'Limiting failed')
        } finally {
          setIsModalSubmitLoading(false)
        }
      },
    })
  }

  const handleFuseSubmit = async () => {
    const formValue = await fuseForm.validateFields()
    const { tenantIds, fuseEnvs } = formValue
    Modal.confirm({
      title: 'Fuse',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure to limit these tenants submit job?',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        setIsModalSubmitLoading(true)
        try {
          await tenantControllerBatchUpdateTenantFuses({
            payload: {
              tenantIds,
              fuseEnvs,
            },
          })
          handleModalCancel()
          refresh()
          message.success('Fuse successfully')
        } catch (error) {
          message.error(error?.message || 'Fuse failed')
        } finally {
          setIsModalSubmitLoading(false)
        }
      },
    })
  }

  const handleModalSubmit = () => {
    if (modalTitle === IActions.LIMITING) {
      handleLimitingSubmit()
      return
    }
    handleFuseSubmit()
  }
  const handleModalCancel = () => {
    setModalTitle('')
    fuseForm.resetFields()
    limitingForm.resetFields()
  }

  const handleBatchDelete = () => {
    setBatchActionFooterTitle('Batch Delete')
  }

  const handleFuse = () => {
    setModalTitle(IActions.FUSE)
  }

  const handleLimiting = () => {
    setModalTitle(IActions.LIMITING)
  }

  const handleClickDeleteButton = (record: ITenantListItem) => {
    const { tenantId } = record
    Modal.confirm({
      title: 'Delete',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure to delete this selected tenants? The operation is not reversible!',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await tenantControllerBatchUpdateTenantFuses({
            payload: {
              tenantIds: [tenantId],
              fuseEnvs: [],
            },
          })
          handleModalCancel()
          refresh()
          message.success('Delete successfully')
        } catch (error) {
          message.error(error?.message || 'Delete failed')
        }
      },
    })
  }

  const columns: ColumnsType<ITenantListItem> = [
    Table.SELECTION_COLUMN,
    {
      title: 'Tenant',
      dataIndex: 'tenantCmdbName',
      width: '200',
    },
    {
      title: 'Env',
      dataIndex: 'fuseEnvs',
      width: '80',
      render: (fuseEnvs: string[]) =>
        fuseEnvs ? fuseEnvs.map((item) => <Tag key={item}>{item}</Tag>) : '--',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '100',
    },
    {
      width: '100',
      title: 'Action',
      render: (_, record) => (
        <>
          <StyledButton type="link" onClick={() => handleClickDeleteButton(record)}>
            Delete
          </StyledButton>
        </>
      ),
    },
  ]

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }
  return (
    <>
      <Row justify="space-between">
        <Col>
          <TableSearchInput
            placeholder="Search Tenant..."
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </Col>
        <Row justify="start">
          <Col>
            <StyledCreateButton onClick={handleBatchDelete}>Batch Delete</StyledCreateButton>
          </Col>
          <Col>
            <StyledCreateButton danger onClick={handleFuse}>
              Fuse
            </StyledCreateButton>
          </Col>
          <Col>
            <StyledCreateButton type="primary" onClick={handleLimiting}>
              Limiting
            </StyledCreateButton>
          </Col>
        </Row>
      </Row>
      <Table
        rowKey="tenantId"
        rowSelection={{
          selectedRowKeys: selectedTenants,
          onChange: handleSelectedTenantsChange,
        }}
        columns={columns}
        dataSource={jobLists}
        onChange={(pagination, filters, sorters, extra) => {
          setSelectedTenants([])
          handleTableChange(pagination, filters, sorters, extra)
        }}
        pagination={{
          ...pagination,
          ...TABLE_PAGINATION_OPTION,
          total,
        }}
      />
      {!!batchActionFooterTitle && (
        <BatchActionFooter
          title={batchActionFooterTitle}
          selectedAccount={selectedTenants.length}
          onCancel={handleBatchActionCancel}
          onOk={handleBatchActionConfirm}
        />
      )}
      <CrudModal
        visible={modalTitle !== ''}
        title={modalTitle}
        isSubmitLoading={isModalSubmitLoading}
        onOk={handleModalSubmit}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        {modalTitle === IActions.LIMITING ? (
          <LimitingModalForm form={limitingForm} />
        ) : (
          <FuseModalForm form={fuseForm} />
        )}
      </CrudModal>
    </>
  )
}

export default PlatformConfigList
