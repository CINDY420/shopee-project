import { StyledButton } from 'components/App/ProjectMGT/ProjectDetail/Common/JobListTableActions/style'
import { JOB_TENSORBOARD_CLUSTERS } from 'constants/cluster'
import { COLUMN_ACTIONS, JOB_TYPE } from 'constants/job'
import { JOB_STATUS } from 'constants/projectDetail'
import { getTensorboradUrl } from 'constants/server'
import { generateLogUrl, generateMonitorUrl } from 'helpers/job'
import { ExclamationCircleOutlined } from 'infra-design-icons'
import { Dropdown, Menu, message, Modal } from 'infrad'
import {
  jobControllerDeleteJob,
  jobControllerGetJob,
  jobControllerKillJob,
  jobControllerRerunJob,
} from 'swagger-api/apis/Job'
import { IJobListItem } from 'swagger-api/models'

const canKillJob = (status: string) =>
  status === JOB_STATUS.PENDING || status === JOB_STATUS.RUNNING || status === JOB_STATUS.QUEUING
const canViewReason = (status: string) =>
  status === JOB_STATUS.PENDING || status === JOB_STATUS.FAILED || status === JOB_STATUS.KILLED
const canRunJob = (status: string) => status === JOB_STATUS.FAILED
const canClickTensorboradButton = (record: IJobListItem) => {
  const { jobType, clusterName } = record
  return jobType === JOB_TYPE.WEB_JOB && JOB_TENSORBOARD_CLUSTERS.indexOf(clusterName) > -1
}

interface IJobListTableActionsProps {
  tenantId?: string
  projectId?: string
  tenantName?: string
  tenantCmdbName?: string
  projectName?: string
  logStore?: string
  record: IJobListItem
  refresh: () => void
  onDeleteSuccess?: () => void
  onScaleJob: (record: IJobListItem) => void
}
const JobListTableActions: React.FC<IJobListTableActionsProps> = ({
  tenantId,
  tenantName = '',
  tenantCmdbName = '',
  projectId,
  projectName = '',
  record,
  refresh,
  onDeleteSuccess,
  onScaleJob,
}) => {
  const handleClickLogButton = (record: IJobListItem) => {
    const { jobName, startTime, endTime, logStore } = record
    const dateTime = {
      start: Number(startTime),
      end: Number(endTime),
    }
    const url = generateLogUrl({ jobName, logStore, dateTime })
    if (url) {
      window.open(url)
    }
  }

  const handleClickMonitorButton = (record: IJobListItem) => {
    const { jobName, clusterName } = record
    const currentTenantName = tenantCmdbName || tenantName
    const url = generateMonitorUrl({
      jobName,
      clusterName,
      tenantName: currentTenantName,
      projectName,
    })
    window.open(url)
  }

  const handleClickTensorboradButton = (record: IJobListItem) => {
    const { jobName, clusterName } = record
    if (canClickTensorboradButton(record)) {
      window.open(`${getTensorboradUrl(clusterName, jobName)}`)
    }
  }

  const handleDeleteJob = (record: IJobListItem) => {
    Modal.confirm({
      title: 'Notice',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete job ${record.jobName}?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        if (tenantId && projectId) {
          await jobControllerDeleteJob({ tenantId, projectId, jobId: record.jobId })
          message.success('Deleted job successfully')
          onDeleteSuccess?.()
          refresh()
        }
      },
    })
  }

  const handleKillJob = (record: IJobListItem) => {
    Modal.confirm({
      title: 'Notice',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to kill job ${record.jobName}?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        if (tenantId && projectId) {
          await jobControllerKillJob({ tenantId, projectId, payload: { jobId: record.jobId } })
          message.success('Killed job successfully')
          refresh()
        }
      },
    })
  }

  const handleRunJob = async (record: IJobListItem) => {
    if (tenantId && projectId) {
      const jobId = record.jobId
      await jobControllerRerunJob({ tenantId, projectId, payload: { jobId } })
      message.success('Run job successfully')
      refresh()
    }
  }

  const handleScaleJob = (record: IJobListItem) => {
    onScaleJob(record)
  }

  const handleViewReason = async (record: IJobListItem) => {
    const jobId = record.jobId
    if (tenantId && projectId && jobId) {
      const jobDetails = await jobControllerGetJob({
        tenantId,
        projectId,
        jobId,
      })
      const { status } = jobDetails
      Modal.info({
        title: 'Reason',
        content: status.message || 'unknown',
        okText: 'Ok',
      })
    }
  }

  const handleColumnActionsOverlayClick = (key: string, record: IJobListItem) => {
    switch (key) {
      case COLUMN_ACTIONS.DELETE:
        return handleDeleteJob(record)
      case COLUMN_ACTIONS.RUN:
        return handleRunJob(record)
      case COLUMN_ACTIONS.KILL:
        return handleKillJob(record)
      case COLUMN_ACTIONS.SCALE:
        return handleScaleJob(record)
      case COLUMN_ACTIONS.REASON:
        return handleViewReason(record)
    }
  }

  const getOverlay = (record) => (
    <Menu onClick={({ key }) => handleColumnActionsOverlayClick(key, record)}>
      <Menu.Item key={COLUMN_ACTIONS.DELETE}>{COLUMN_ACTIONS.DELETE}</Menu.Item>
      <Menu.Item key={COLUMN_ACTIONS.RUN} disabled={!canRunJob(record.status)}>
        {COLUMN_ACTIONS.RUN}
      </Menu.Item>
      <Menu.Item key={COLUMN_ACTIONS.KILL} disabled={!canKillJob(record.status)}>
        {COLUMN_ACTIONS.KILL}
      </Menu.Item>
      <Menu.Item key={COLUMN_ACTIONS.SCALE} disabled={!canKillJob(record.status)}>
        {COLUMN_ACTIONS.SCALE}
      </Menu.Item>
      <Menu.Item key={COLUMN_ACTIONS.REASON} disabled={!canViewReason(record.status)}>
        {COLUMN_ACTIONS.REASON}
      </Menu.Item>
    </Menu>
  )
  return (
    <>
      <StyledButton type="link" onClick={() => handleClickLogButton(record)}>
        Log
      </StyledButton>
      <StyledButton type="link" onClick={() => handleClickMonitorButton(record)}>
        Monitor
      </StyledButton>
      <StyledButton
        type="link"
        onClick={() => handleClickTensorboradButton(record)}
        disabled={!canClickTensorboradButton(record)}
      >
        Visualization
      </StyledButton>
      <Dropdown overlay={getOverlay(record)}>
        <a onClick={(e) => e.preventDefault()}>More</a>
      </Dropdown>
    </>
  )
}

export default JobListTableActions
