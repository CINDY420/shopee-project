import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDebounce } from 'react-use'
import TableSearchInput from 'components/Common/TableSearchInput'
import useAntdTable from 'hooks/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useGeneratePath from 'hooks/useGeneratePath'
import useCheckPermission from 'hooks/useCheckPermission'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { STATUS_COLORS_MAP } from 'constants/projectDetail'
import { StyledStatusButton } from 'components/App/ProjectMGT/Common/style'
import { CREATE_JOB, JOB } from 'constants/routes/route'
import {
  jobControllerBatchDeleteJob,
  jobControllerBatchKillJob,
  jobControllerListJobs,
  jobControllerScaleJob,
} from 'swagger-api/apis/Job'
import {
  globalControllerListAllJobStatus,
  globalControllerListAllJobTypes,
} from 'swagger-api/apis/Global'
import { IListJobsResponse, IJobListItem, IBatchHandleJobResults } from 'swagger-api/models'
import { formatUnixTime, upperCaseFirstCharacter } from 'helpers/format'
import { ITableParams } from 'types/table'
import { PERMISSION_RESOURCE, PERMISSION_ACTION } from 'constants/permission'
import { Table } from 'common-styles/table'
import { Col, Form, message, Modal, Row } from 'infrad'
import { ColumnsType } from 'infrad/lib/table'
import { ProjectDetailContext } from 'components/App/ProjectMGT/ProjectDetail'
import { ExclamationCircleOutlined } from 'infra-design-icons'
import { projectControllerGetProject } from 'swagger-api/apis/Project'
import { selectedProject } from 'states'
import { useRemoteRecoil } from 'hooks/useRecoil'
import TableDropdown from 'components/Common/TableDropdown'
import BatchActionFooter from 'components/Common/BatchActionFooter'
import { BATCH_ACTIONS } from 'constants/job'
import CrudModal from 'components/Common/CrudModal'
import ScaleModalForm from 'components/App/ProjectMGT/Common/ScaleModalForm'
import JobListBatchActionsMenu from 'components/App/ProjectMGT/ProjectDetail/Common/JobListBatchActionsMenu'
import JobListTableActions from 'components/App/ProjectMGT/ProjectDetail/Common/JobListTableActions'
import { StyledCreateButton } from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/style'
import { useRecoilValue } from 'recoil'

const JobList = () => {
  const { logStore } = useRecoilValue(selectedProject)
  const { tenantName, projectName, tenantCmdbName } = React.useContext(ProjectDetailContext) || {}
  const params = useParams()
  const { tenantId, projectId } = params
  const navigate = useNavigate()
  const getPath = useGeneratePath()
  const [searchVal, setSearchVal] = React.useState<string>()
  const [batchActionFooterTitle, setBatchActionFooterTitle] = React.useState('')
  const [selectedJobs, setSelectedJobs] = React.useState<string[]>([])
  const [jobStatus, setJobStatus] = React.useState<Array<string>>([])
  const [jobTypes, setJobTypes] = React.useState<Array<string>>([])
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [isScaleSubmitLoading, setIsScaleSubmitLoading] = React.useState(false)
  const [scaleJobDetail, setScaleJobDetail] = React.useState<IJobListItem>()

  const [scaleForm] = Form.useForm()

  const checkJobPermission = useCheckPermission(PERMISSION_RESOURCE.SHOPEE_JOB)
  const checkPodPermission = useCheckPermission(PERMISSION_RESOURCE.POD)
  const permission = {
    canViewDetail: checkJobPermission(PERMISSION_ACTION.GET),
    canViewPodList: checkPodPermission(),
  }

  const [_, getProjectFn] = useRemoteRecoil(projectControllerGetProject, selectedProject)
  const listJobsFnWithResource = React.useCallback(
    (tableQueryParams: ITableParams) => {
      if (tenantId && projectId)
        return jobControllerListJobs({
          tenantId,
          projectId,
          ...tableQueryParams,
          searchBy: searchVal,
        })
    },
    [tenantId, projectId, searchVal],
  )
  const [listJobsState, listJobsFn] = useAsyncIntervalFn<IListJobsResponse>(listJobsFnWithResource)
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listJobsFn })
  const { total, items: jobLists } = listJobsState.value || {}

  const listAllJobStatus = async () => {
    const { items } = await globalControllerListAllJobStatus()
    setJobStatus(items)
  }

  const listAllJobTypes = async () => {
    const { items } = await globalControllerListAllJobTypes()
    setJobTypes(items)
  }

  React.useEffect(() => {
    listAllJobStatus()
    listAllJobTypes()
  }, [])

  useDebounce(
    () => {
      searchVal !== undefined && refresh()
    },
    500,
    [searchVal],
  )

  const handleBatchActionCancel = () => {
    setSelectedJobs([])
    setBatchActionFooterTitle('')
  }
  const handleBatchActionConfirm = () => {
    if (selectedJobs.length === 0) {
      message.warning('Please select jobs')
      return
    }
    const msg = batchActionFooterTitle === BATCH_ACTIONS.BATCH_DELETE_JOB ? 'delete' : 'kill'
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
      let jobResults: IBatchHandleJobResults[] = []
      let handleType = ''
      if (batchActionFooterTitle === BATCH_ACTIONS.BATCH_DELETE_JOB) {
        // handle delete
        handleType = 'delete'
        const res = await jobControllerBatchDeleteJob({
          tenantId,
          projectId,
          payload: {
            deleteAll: false,
            jobIds: selectedJobs,
          },
        })
        jobResults = res.jobResults
      }
      if (batchActionFooterTitle === BATCH_ACTIONS.BATCH_KILL_JOB) {
        // handle kill
        handleType = 'kill'
        const res = await jobControllerBatchKillJob({
          tenantId,
          projectId,
          payload: {
            jobIds: selectedJobs,
          },
        })
        jobResults = res.jobResults
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

  const handleSelectedJobsChange = (jobIds: string[]) => {
    setSelectedJobs(jobIds)
  }

  const handleScaleJob = (record: IJobListItem) => {
    setScaleJobDetail(record)
    setIsModalVisible(true)
  }
  const handleScaleModalSubmit = async () => {
    if (tenantId && projectId) {
      setIsScaleSubmitLoading(true)
      const formValue = await scaleForm.validateFields()
      const { jobId, tasks } = formValue
      try {
        await jobControllerScaleJob({ tenantId, projectId, jobId, payload: { payload: tasks } })
        handleModalCancel()
        message.success('Scale successfully')
      } catch (error) {
        message.error(error?.message || 'Scale failed')
      } finally {
        setIsScaleSubmitLoading(false)
      }
    }
  }
  const handleModalCancel = () => {
    setScaleJobDetail(undefined)
    setIsModalVisible(false)
    scaleForm.resetFields()
  }

  const handleCreateButton = () => {
    navigate(getPath(CREATE_JOB))
  }

  const columns: ColumnsType<IJobListItem> = [
    Table.SELECTION_COLUMN,
    {
      title: 'Job Name',
      dataIndex: 'jobName',
      render: (jobName: string, record: IJobListItem) =>
        permission.canViewPodList ? (
          <Link
            style={{ color: '#2673DD', fontWeight: 500 }}
            to={getPath(JOB, { jobId: record.jobId })}
          >
            {jobName}
          </Link>
        ) : (
          jobName
        ),
    },
    {
      title: 'ID',
      dataIndex: 'jobId',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      filters: jobTypes.map((item: string) => ({ text: item, value: item })),
      render: (_, record: IJobListItem) => record.jobType,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      sorter: true,
    },
    {
      title: 'Cluster',
      dataIndex: 'clusterName',
    },
    {
      title: 'Created Time',
      dataIndex: 'startTime',
      key: 'start_time',
      sorter: true,
      render: (startTime: number) => formatUnixTime(startTime),
    },
    {
      title: 'Created By',
      dataIndex: 'creator',
    },
    {
      title: 'Finished Time',
      dataIndex: 'endTime',
      key: 'end_time',
      sorter: true,
      render: (endTime: number) => formatUnixTime(endTime),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: jobStatus.map((item: string) => ({ text: item, value: item })),
      render: (value: string) => (
        <StyledStatusButton {...STATUS_COLORS_MAP[value]}>{value}</StyledStatusButton>
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <JobListTableActions
          tenantId={tenantId}
          tenantName={tenantName}
          tenantCmdbName={tenantCmdbName}
          projectName={projectName}
          projectId={projectId}
          logStore={logStore}
          onDeleteSuccess={() => {
            if (Number(total) === 1 && tenantId && projectId) {
              // refresh project jobAccount and then can delete project
              getProjectFn({ tenantId, projectId })
            }
          }}
          refresh={refresh}
          record={record}
          onScaleJob={handleScaleJob}
        />
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
            <TableDropdown
              title="Batch Action"
              overlay={
                <JobListBatchActionsMenu
                  tenantId={tenantId}
                  projectId={projectId}
                  setTitle={setBatchActionFooterTitle}
                  selectedJobs={selectedJobs}
                  onBatchActionSuccess={() => {
                    if (tenantId && projectId) {
                      // refresh project jobAccount and then can delete project
                      getProjectFn({ tenantId, projectId })
                    }
                    refresh()
                  }}
                />
              }
            />
          </Col>
          <Col>
            <StyledCreateButton type="primary" onClick={handleCreateButton}>
              Create Job
            </StyledCreateButton>
          </Col>
        </Row>
      </Row>
      <Table
        rowKey="jobId"
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
      <CrudModal
        visible={isModalVisible}
        title="Scale"
        width={1024}
        isSubmitLoading={isScaleSubmitLoading}
        onOk={handleScaleModalSubmit}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <ScaleModalForm form={scaleForm} scaleJobDetail={scaleJobDetail} tenantId={tenantId} />
      </CrudModal>
    </>
  )
}

export default JobList
