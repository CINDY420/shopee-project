import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import { useRecoilValue } from 'recoil'

import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'
import { getFilterUrlParam, getFilterItem, filterTypes } from 'helpers/queryParams'
import { selectedTenant } from 'states/applicationState/tenant'
import { selectedPipeline } from 'states/pipelineState'
import { GlobalContext } from 'hocs/useGlobalContext'

import { IListPipelineRunsResponseDto } from 'swagger-api/v3/models'

import {
  pipelinesControllerAbortPipelineRun,
  pipelinesControllerAbortPendingPipeline,
  pipelinesControllerRebuildPipelineRun,
  pipelinesControllerListPipelineRuns
} from 'swagger-api/v3/apis/Pipelines'

import { IPipelineRunDetail, IPipelineParameter } from 'api/types/application/pipeline'

import { Table } from 'common-styles/table'
import { StyledInput, IDSpan, StyledButton } from './style'
import { SearchOutlined } from 'infra-design-icons'
import { message, Popconfirm } from 'infrad'
import CollapseParameter from './CollapseParameter'
import { Link } from 'react-router-dom'
import PipelineStatus from 'components/App/PipelinesManagement/Common/PipelineStatus'
import { formatTime } from 'helpers/format'

import { buildPipelineRunRoute } from 'constants/routes/routes'
import { PIPELINE_STATUS } from 'constants/pipeline'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { TENANT_ADMIN_ID, LIVE_OPERATOR_ID } from 'constants/accessControl'

interface IPipelineHistoriesTable {
  canRebuild: boolean
  canAbort: boolean
  isFreezing: boolean
  ref: any
}

const PipelineHistoriesTable: React.FC<IPipelineHistoriesTable> = forwardRef(
  ({ canRebuild, canAbort, isFreezing }, ref) => {
    const [searchValue, setSearchValue] = useState<string>('')
    const tenant = useRecoilValue(selectedTenant)
    const pipeline = useRecoilValue(selectedPipeline)
    const { id: tenantId } = tenant || {}
    const { name: pipelineName } = pipeline || {}

    const { state } = React.useContext(GlobalContext)
    const { userRoles = [] } = state || {}

    const listPipelineHistoriesFnWithResource = useCallback(
      args => {
        const { filterBy, ...others } = args || {}
        const extraFilterBy = getFilterUrlParam({
          all: getFilterItem('all', searchValue, filterTypes.contain)
        })

        return pipelinesControllerListPipelineRuns({
          tenantId,
          pipelineName,
          filterBy: filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy,
          ...others
        })
      },
      [tenantId, pipelineName, searchValue]
    )

    const [listPipelineHistoriesState, listPipelineHistoriesFn] = useAsyncIntervalFn<IListPipelineRunsResponseDto>(
      listPipelineHistoriesFnWithResource,
      {
        enableIntervalCallback: true,
        refreshRate: 2000
      }
    )

    const { value, loading } = listPipelineHistoriesState
    const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listPipelineHistoriesFn })

    useImperativeHandle(ref, () => ({
      handleRefresh: () => refresh()
    }))

    const { items: pipelineHistoriesList = [], totalSize = 0 } = value || {}

    const handleSearchChange = useCallback(val => {
      setSearchValue(val)
    }, [])

    const handleAbortPipeline = async (id: string) => {
      try {
        await pipelinesControllerAbortPipelineRun({ tenantId, pipelineName, runId: id })
        message.success(`Abort pipeline ${id} successfully!`)
        refresh()
      } catch (err) {
        err.message && message.error(err.message)
      }
    }

    const handleAbortPendingPipeline = async (queueId: string) => {
      try {
        await pipelinesControllerAbortPendingPipeline({ tenantId, pipelineName, queueId })
        message.success('Abort pending pipeline successfully!')
        refresh()
      } catch (err) {
        err.message && message.error(err.message)
      }
    }

    const handleRebuildPipeline = async (id: string) => {
      try {
        await pipelinesControllerRebuildPipelineRun({ tenantId, pipelineName, runId: id })
        message.success(`Rebuild pipeline ${id} successfully!`)
        refresh()
      } catch (err) {
        err.message && message.error(err.message)
      }
    }

    React.useEffect(() => {
      refresh()
    }, [refresh, searchValue])

    const canRebuildPipeline = () => {
      if (canRebuild && isFreezing) {
        const role = userRoles.find(role => role.tenantId.toString() === tenantId)
        const { roleId } = role || {}
        if (role && (roleId === TENANT_ADMIN_ID || roleId === LIVE_OPERATOR_ID)) {
          return true
        } else {
          return false
        }
      } else {
        return canRebuild
      }
    }

    const columns = [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        render: (id: string) =>
          id ? (
            <Link to={buildPipelineRunRoute({ tenantId, pipelineName, runId: id })}>
              <IDSpan>{id.padStart(4, '0')}</IDSpan>
            </Link>
          ) : (
            '-'
          )
      },
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (status: string) => {
          return status ? <PipelineStatus status={status}></PipelineStatus> : '-'
        }
      },
      {
        title: 'Executor',
        key: 'executor',
        dataIndex: 'executor',
        render: (executor: string) => executor || '-'
      },
      {
        title: 'Execute Time',
        key: 'executeTime',
        dataIndex: 'executeTime',
        render: (time: string) => (time ? formatTime(time) : '-')
      },
      {
        title: 'Parameter',
        key: 'parameters',
        dataIndex: 'parameters',
        render: (parameters: IPipelineParameter[]) => (parameters ? <CollapseParameter parameters={parameters} /> : '-')
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record: IPipelineRunDetail) => {
          const { status, id, queueItemID } = record
          if (status === PIPELINE_STATUS.running || status === PIPELINE_STATUS.pausedPendingInput) {
            return (
              <Popconfirm
                title={`Are you sure to abort this pipeline with running ID ${id}?`}
                onConfirm={() => handleAbortPipeline(id)}
                okText='Yes'
                cancelText='No'
                overlayStyle={{ width: '300px' }}
                placement='left'
              >
                <StyledButton disabled={!canAbort}>Abort</StyledButton>
              </Popconfirm>
            )
          } else if (status === PIPELINE_STATUS.pending) {
            return (
              <Popconfirm
                title='Are you sure to abort this pending pipeline?'
                onConfirm={() => handleAbortPendingPipeline(queueItemID)}
                okText='Yes'
                cancelText='No'
                overlayStyle={{ width: '300px' }}
                placement='left'
              >
                <StyledButton disabled={!canAbort}>Abort</StyledButton>
              </Popconfirm>
            )
          } else {
            return (
              <StyledButton onClick={() => handleRebuildPipeline(id)} disabled={!canRebuildPipeline()}>
                Rebuild
              </StyledButton>
            )
          }
        }
      }
    ]

    return (
      <>
        <StyledInput
          value={searchValue}
          allowClear
          placeholder='Search ID/Parameter'
          onChange={event => handleSearchChange(event.target.value)}
          suffix={<SearchOutlined />}
        />
        <Table
          columns={columns}
          rowKey='id'
          dataSource={pipelineHistoriesList}
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            ...TABLE_PAGINATION_OPTION,
            ...pagination,
            total: totalSize
          }}
        />
      </>
    )
  }
)

export default PipelineHistoriesTable
