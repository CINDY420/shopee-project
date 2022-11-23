import React, { useCallback, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { MigrationContext, getDispatchers } from '../useMigrationContext'

import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { formatTime } from 'helpers/format'
import { pipelinesControllerGetPipelineMigrationDetail } from 'swagger-api/v3/apis/Pipelines'
import { IPipelineMigrationItem } from 'swagger-api/v3/models'
import { MIGRATION_TASK_STATUS } from 'constants/pipeline'
import { selectedTenant } from 'states/applicationState/tenant'

import { Progress, Popover } from 'infrad'
import { LoadingOutlined, CheckCircleFilled, CloseCircleFilled, QuestionCircleOutlined } from 'infra-design-icons'
import { StyledFaildTaskList } from './style'

const migrationTaskStrokeColorsMap = {
  [MIGRATION_TASK_STATUS.success]: '#55CC77',
  [MIGRATION_TASK_STATUS.running]: '#55CC77',
  [MIGRATION_TASK_STATUS.pending]: '#55CC77',
  [MIGRATION_TASK_STATUS.failed]: '#EE4D2D'
}

const migrationTaskIconsMap = {
  [MIGRATION_TASK_STATUS.running]: <LoadingOutlined style={{ color: '#2673DD' }} />,
  [MIGRATION_TASK_STATUS.pending]: <LoadingOutlined style={{ color: '#2673DD' }} />,
  [MIGRATION_TASK_STATUS.success]: <CheckCircleFilled style={{ color: '#55CC77' }} />,
  [MIGRATION_TASK_STATUS.failed]: <CloseCircleFilled style={{ color: '#EE4D2D' }} />
}

const MigrationTaskStatus: React.FC = () => {
  const { dispatch } = React.useContext(MigrationContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])

  const tenant = useRecoilValue(selectedTenant)
  const { id: tenantId } = tenant || {}

  const [migrationTaskStatus, setMigrationTaskStatus] = React.useState<MIGRATION_TASK_STATUS>(
    MIGRATION_TASK_STATUS.pending
  )

  const getMigrationStatusFnWithResource = useCallback(() => {
    return pipelinesControllerGetPipelineMigrationDetail({ tenantId })
  }, [tenantId])

  const [getMigrationStatusState, getMigrationStatusFn] = useAsyncIntervalFn<IPipelineMigrationItem>(
    getMigrationStatusFnWithResource,
    {
      enableIntervalCallback:
        migrationTaskStatus === MIGRATION_TASK_STATUS.pending || migrationTaskStatus === MIGRATION_TASK_STATUS.running,
      refreshRate: 2000
    }
  )

  const { value } = getMigrationStatusState
  const { destEngine, status, cursor, succeededCount, totalCount, updatedAt, details = [] } = value || {}

  useEffect(() => {
    setMigrationTaskStatus(status as MIGRATION_TASK_STATUS)
    dispatchers.updateStatus(status as MIGRATION_TASK_STATUS)
  }, [status, dispatchers])

  useEffect(() => {
    getMigrationStatusFn()
    dispatchers.refreshStaus(getMigrationStatusFn)
  }, [getMigrationStatusFn, dispatchers])

  const gapTime = (updatedAt: string) => {
    const date = formatTime(Number(updatedAt) * 1000)
    const update = new Date(date).getTime() / 1000
    const current = new Date().getTime() / 1000
    const gap = current - update
    const res = parseFloat((gap / 60).toString()) / 60
    return res
  }

  return updatedAt && gapTime(updatedAt) <= 24 ? (
    <>
      <span style={{ fontWeight: 700, color: '#333333' }}>Migration Task Status</span>
      <Progress
        percent={(cursor / totalCount) * 100}
        showInfo={false}
        style={{ width: 160, margin: '0 16px' }}
        strokeWidth={6}
        strokeColor={migrationTaskStrokeColorsMap[migrationTaskStatus]}
      />
      {migrationTaskIconsMap[migrationTaskStatus]}
      <Popover
        placement='bottomRight'
        content={
          <div style={{ width: 320 }}>
            <div>Target Engine: {destEngine}</div>
            <div>
              Status: {succeededCount}/{totalCount} Succeed.
            </div>
            {details.length > 0 && (
              <StyledFaildTaskList>
                Failed task list: {details.map(detail => detail.name).join(', ')}
              </StyledFaildTaskList>
            )}
          </div>
        }
      >
        <QuestionCircleOutlined style={{ color: '#999999', marginLeft: 16, cursor: 'pointer' }} />
      </Popover>
      <span style={{ color: '#999999', marginLeft: 16 }}>
        {succeededCount}/{totalCount}
      </span>
    </>
  ) : null
}

export default MigrationTaskStatus
