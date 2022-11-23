import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDebounce } from 'react-use'
import TableSearchInput from 'components/Common/TableSearchInput'
import useAntdTable from 'hooks/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useGeneratePath from 'hooks/useGeneratePath'
import useCheckPermission from 'hooks/useCheckPermission'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { CREATE_PERIODIC_JOB, EDIT_PERIODIC_JOB, PERIODIC_JOB } from 'constants/routes/route'

import {
  IListPeriodicJobsResponse,
  IPeriodicJobListItem,
  IBatchHandlePeriodicJobResults,
} from 'swagger-api/models'
import { formatUnixTime, upperCaseFirstCharacter } from 'helpers/format'
import { ITableParams } from 'types/table'
import { PERMISSION_RESOURCE, PERMISSION_ACTION } from 'constants/permission'
import { Table } from 'common-styles/table'
import { Col, Menu, MenuProps, message, Modal, Row, Switch } from 'infrad'
import { ColumnsType } from 'infrad/lib/table'
import { StyledButton } from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/style'
import { ExclamationCircleOutlined } from 'infra-design-icons'
import TableDropdown from 'components/Common/TableDropdown'
import BatchActionFooter from 'components/Common/BatchActionFooter'
import { StyledCreateButton } from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/style'
import {
  periodicJobControllerListPeriodicJobs,
  periodicJobControllerDeletePeriodicJob,
  periodicJobControllerBatchDeletePeriodicJob,
  periodicJobControllerRerunPeriodicJob,
  periodicJobControllerEnablePeriodicJob,
} from 'swagger-api/apis/PeriodicJob'
import { BATCH_ACTIONS } from 'constants/job'
import { ADMIN_ID_LIST } from 'constants/auth'
import { hasRole } from 'helpers/permission'
import { useRecoilValue } from 'recoil'
import { globalAuthState } from 'states'

type IHandleOverlayClick = NonNullable<MenuProps['onClick']>

const PeriodicJobList = () => {
  const params = useParams()
  const { tenantId, projectId } = params
  const navigate = useNavigate()
  const getPath = useGeneratePath()
  const { roles } = useRecoilValue(globalAuthState)
  const [searchVal, setSearchVal] = React.useState<string>()
  const [batchActionFooterTitle, setBatchActionFooterTitle] = React.useState('')
  const [selectedJobs, setSelectedJobs] = React.useState<string[]>([])

  const checkJobPermission = useCheckPermission(PERMISSION_RESOURCE.SHOPEE_JOB)
  const checkPodPermission = useCheckPermission(PERMISSION_RESOURCE.POD)
  const permission = {
    canViewDetail: checkJobPermission(PERMISSION_ACTION.GET),
    canViewPodList: checkPodPermission(),
  }

  const listJobsFnWithResource = React.useCallback(
    (tableQueryParams: ITableParams) => {
      if (tenantId && projectId)
        return periodicJobControllerListPeriodicJobs({
          tenantId,
          projectId,
          ...tableQueryParams,
          searchBy: searchVal,
        })
    },
    [tenantId, projectId, searchVal],
  )
  const [listJobsState, listJobsFn] =
    useAsyncIntervalFn<IListPeriodicJobsResponse>(listJobsFnWithResource)
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listJobsFn })
  const { total, items: jobLists } = listJobsState.value || {}

  useDebounce(
    () => {
      searchVal !== undefined && refresh()
    },
    500,
    [searchVal],
  )

  const handleDeleteJob = (record: IPeriodicJobListItem) => {
    Modal.confirm({
      title: 'Notice',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete job ${record.periodicJobName}?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        if (tenantId && projectId) {
          try {
            await periodicJobControllerDeletePeriodicJob({
              tenantId,
              projectId,
              periodicJobId: record.periodicJobId,
            })
            message.success('Deleted job successfully')
            refresh()
          } catch (error) {
            message.error(error?.message || 'Deleted job failed')
          }
        }
      },
    })
  }

  const handleBatchActionCancel = () => {
    setSelectedJobs([])
    setBatchActionFooterTitle('')
  }
  const handleBatchActionConfirm = () => {
    if (selectedJobs.length === 0) {
      message.warning('Please select jobs')
      return
    }
    const msg = batchActionFooterTitle === BATCH_ACTIONS.BATCH_DELETE_JOB ? 'delete' : 'enable'
    Modal.confirm({
      title: `Batch ${upperCaseFirstCharacter(msg)}`,
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure to batch ${msg} the selected jobs? The operation is not reversible!`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: handleBatchActionModalOk,
    })
  }
  const handleBatchActionModalOk = async () => {
    if (tenantId && projectId) {
      let jobResults: IBatchHandlePeriodicJobResults[] = []
      let handleType = ''
      if (batchActionFooterTitle === BATCH_ACTIONS.BATCH_DELETE_JOB) {
        // handle delete
        handleType = 'delete'
        const res = await periodicJobControllerBatchDeletePeriodicJob({
          tenantId,
          projectId,
          payload: {
            deleteAll: false,
            periodicJobIds: selectedJobs,
          },
        })
        jobResults = res.periodicJobResults
      }

      if (jobResults?.length > 0) {
        const names = jobResults.map((item) => item.name)
        message.warning(`${names.join(', ')} ${handleType} failed`)
      } else {
        message.success(`Batch ${handleType} successfully`)
      }
      handleBatchActionCancel()
      refresh()
    }
  }
  const handleDelteAllJobs = () => {
    Modal.confirm({
      title: 'Delete All',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure to delete all jobs? The operation is not reversible!',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        if (tenantId && projectId) {
          try {
            await periodicJobControllerBatchDeletePeriodicJob({
              tenantId,
              projectId,
              payload: {
                deleteAll: true,
                periodicJobIds: [],
              },
            })
            message.success('Delete all jobs successfully')
            refresh()
          } catch (error) {
            message.error(error?.message || 'Deleted all jobs failed')
          }
        }
      },
    })
  }

  const handleSelectedJobsChange = (jobIds: string[]) => {
    setSelectedJobs(jobIds)
  }

  const handleRunJob = async (record: IPeriodicJobListItem) => {
    if (tenantId && projectId) {
      const { periodicJobId } = record
      try {
        await periodicJobControllerRerunPeriodicJob({ tenantId, projectId, periodicJobId })
        message.success('Run job successfully')
        refresh()
      } catch (error) {
        message.error(error?.message || 'Run job failed')
      }
    }
  }

  const handleEditJob = (record: IPeriodicJobListItem) => {
    navigate(getPath(EDIT_PERIODIC_JOB, { periodicJobId: record.periodicJobId }))
  }

  const handleChangeJobStatus = async (checked: boolean, record: IPeriodicJobListItem) => {
    const { periodicJobId } = record
    const msg = checked ? 'Enable' : 'Disable'
    if (tenantId && projectId && periodicJobId) {
      try {
        await periodicJobControllerEnablePeriodicJob({
          tenantId,
          projectId,
          periodicJobId,
          payload: { enable: `${checked}` },
        })
        refresh()
        message.success(`${msg} successfully`)
      } catch (error) {
        message.error(error?.message || `${msg} failed`)
      }
    }
  }

  const handleCreateButton = () => {
    navigate(getPath(CREATE_PERIODIC_JOB))
  }

  const handleOverlayClick: IHandleOverlayClick = ({ key }) => {
    if (key === BATCH_ACTIONS.DELETE_ALL) {
      return handleDelteAllJobs()
    }
    setBatchActionFooterTitle(key)
  }

  const overlay = (
    <Menu onClick={handleOverlayClick}>
      <Menu.Item key={BATCH_ACTIONS.BATCH_DELETE_JOB} disabled={selectedJobs.length === 0}>
        {BATCH_ACTIONS.BATCH_DELETE_JOB}
      </Menu.Item>
      {ADMIN_ID_LIST.some((roleKey) => hasRole(roles, roleKey)) && (
        <Menu.Item key={BATCH_ACTIONS.DELETE_ALL}>{BATCH_ACTIONS.DELETE_ALL}</Menu.Item>
      )}
    </Menu>
  )

  const columns: ColumnsType<IPeriodicJobListItem> = [
    Table.SELECTION_COLUMN,
    {
      title: 'Job Name',
      dataIndex: 'periodicJobName',
      render: (jobName: string, record) =>
        permission.canViewPodList ? (
          <Link
            style={{ color: '#2673DD', fontWeight: 500 }}
            to={getPath(PERIODIC_JOB, { periodicJobId: record.periodicJobId })}
          >
            {jobName}
          </Link>
        ) : (
          jobName
        ),
    },
    {
      title: 'ID',
      dataIndex: 'periodicJobId',
    },
    {
      title: 'Priority',
      dataIndex: ['jobTemplate', 'priority'],
    },
    {
      title: 'Cron',
      dataIndex: 'period',
    },
    {
      title: 'Created Time',
      dataIndex: 'createAt',
      key: 'created_at',
      sorter: true,
      render: (createdAt: number) => formatUnixTime(createdAt),
    },
    {
      title: 'Created By',
      dataIndex: 'creator',
    },
    {
      title: 'Status',
      dataIndex: 'enable',
      width: 98,
      render: (enable: boolean, record) => (
        <Switch
          checkedChildren="open"
          unCheckedChildren="close"
          checked={enable}
          onChange={(checked) => handleChangeJobStatus(checked, record)}
        />
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <>
          <StyledButton type="link" onClick={() => handleRunJob(record)} disabled={!record.enable}>
            Run
          </StyledButton>
          <StyledButton type="link" onClick={() => handleEditJob(record)}>
            Edit
          </StyledButton>
          <StyledButton type="link" onClick={() => handleDeleteJob(record)}>
            Delete
          </StyledButton>
        </>
      ),
    },
  ]

  const handleSearchChange = (value: string) => {
    setSearchVal(value)
  }
  return (
    <>
      <Row justify="space-between">
        <Col>
          <TableSearchInput
            placeholder="Search Job..."
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </Col>
        <Row justify="start">
          <Col>
            <TableDropdown title="Batch Action" overlay={overlay} />
          </Col>
          <Col>
            <StyledCreateButton type="primary" onClick={handleCreateButton}>
              Create Periodic Job
            </StyledCreateButton>
          </Col>
        </Row>
      </Row>
      <Table
        rowKey="periodicJobId"
        rowSelection={{
          selectedRowKeys: selectedJobs,
          onChange: handleSelectedJobsChange,
        }}
        columns={columns}
        dataSource={jobLists}
        onChange={(pagination, filters, sorters, extra) => {
          setSelectedJobs([])
          handleTableChange(pagination, filters, sorters, extra)
        }}
        pagination={{
          ...pagination,
          ...TABLE_PAGINATION_OPTION,
          total,
        }}
        scroll={{ x: true }}
      />
      {!!batchActionFooterTitle && (
        <BatchActionFooter
          title={batchActionFooterTitle}
          selectedAccount={selectedJobs.length}
          onCancel={handleBatchActionCancel}
          onOk={handleBatchActionConfirm}
        />
      )}
    </>
  )
}

export default PeriodicJobList
