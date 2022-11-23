import React, { useState, useEffect } from 'react'
import history from 'helpers/history'

import { Table } from 'common-styles/table'
import { useRecoilValue } from 'recoil'
import RunPipelineDrawer from 'components/App/PipelinesManagement/Common/RunPipelineDrawer'

import { TABLE_PAGINATION_OPTION } from 'constants/pagination'

import { DISABLED_MIGRATE_ENGINE } from 'constants/pipeline'
import PipelineStatus from 'components/App/PipelinesManagement/Common/PipelineStatus'
import PromptCreator from 'components/Common/PromptCreator'
import BatchMigrateOperation from './BatchMigrateOperation'
import { formatTime } from 'helpers/format'

import { StyledButton, StyledLinkButton, StyledDiv } from './style'
import { message } from 'infrad'
import { selectedTenant } from 'states/applicationState/tenant'
import { buildPipelineHistoriesName } from 'constants/routes/name'
import { TENANT_ADMIN_ID, LIVE_OPERATOR_ID, RESOURCE_ACTION } from 'constants/accessControl'
import { pipelinesControllerGetAllPipelineEngines } from 'swagger-api/v3/apis/Pipelines'
import { IEngine, IListPipeline } from 'api/types/application/pipeline'
import { GlobalContext } from 'hocs/useGlobalContext'

const { Prompt } = PromptCreator({
  content: "The changes you made to the pipelines haven't been saved."
})

interface IPipelinesTableProps {
  onTableChange: any
  listPipelinesState: any
  pagination: any
  onRefresh: () => void
  pipelineActions: string[]
  isBatchingMigrate: boolean
  onCloseBatMchigrate: () => void
  filteredEngine: string
}

// const statusFilter = Object.keys(PIPELINE_STATUS_TYPE).map(status => ({
//   text: PIPELINE_STATUS_TYPE[status],
//   value: PIPELINE_STATUS[status]
// }))

const PipelinesTable: React.FC<IPipelinesTableProps> = ({
  onTableChange,
  listPipelinesState,
  pagination,
  onRefresh,
  pipelineActions,
  isBatchingMigrate,
  onCloseBatMchigrate,
  filteredEngine
}) => {
  const { pipelines = [], totalSize = 0 } = listPipelinesState.value || {}
  const tenant = useRecoilValue(selectedTenant)
  const tenantId = tenant.id

  const [pipelineToBeRun, setPipelineToBeRun] = useState<string>()
  const [isEditDrawerVisible, setEditDrawerVisible] = useState<boolean>(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [engines, setEngines] = useState<IEngine[]>([])

  const showEditDrawer = () => setEditDrawerVisible(true)
  const closeEditDrawer = () => setEditDrawerVisible(false)

  const canRunPipelineLive = pipelineActions.includes(RESOURCE_ACTION.RunLive)
  const canRunPipelineNonLive = pipelineActions.includes(RESOURCE_ACTION.RunNonLive)

  const { state } = React.useContext(GlobalContext)
  const { userRoles = [] } = state || {}

  const canRunPipeline = (canRun, isFreezing) => {
    if (canRun && isFreezing) {
      const role = userRoles.find(role => role.tenantId.toString() === tenantId)
      const { roleId } = role || {}
      if (role && (roleId === TENANT_ADMIN_ID || roleId === LIVE_OPERATOR_ID)) {
        return true
      } else {
        return false
      }
    } else {
      return canRun
    }
  }

  const getEnginesFn = async () => {
    try {
      const engines = await pipelinesControllerGetAllPipelineEngines({ tenantId })
      setEngines(engines)
    } catch (e) {
      e.message && message.error(e.message)
    }
  }

  useEffect(() => {
    getEnginesFn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    {
      title: 'Pipeline Name',
      dataIndex: 'pipelineName',
      key: 'pipelineName',
      render: (name: string) => (
        <StyledLinkButton
          type='link'
          onClick={() => {
            history.push(buildPipelineHistoriesName(tenantId, name))
          }}
          disabled={isBatchingMigrate}
        >
          {name}
        </StyledLinkButton>
      )
    },
    {
      title: 'Engine',
      dataIndex: 'engine',
      key: 'engine',
      render: (engine: string) => engine || '-',
      filters: engines.map(engine => ({
        text: engine.name,
        value: engine.name
      })),
      filterMultiple: false,
      filteredValue: filteredEngine ? [filteredEngine] : []
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      render: (project: string) => project || '-'
    },
    {
      title: 'Last Execute Status',
      dataIndex: 'lastExecuteStatus',
      key: 'lastExecuteStatus',
      // filters: statusFilter,
      render: (status: any) => {
        return status ? <PipelineStatus status={status} /> : '-'
      }
    },
    {
      title: 'Last Executor',
      dataIndex: 'lastExecutor',
      key: 'lastExecutor',
      render: (executor: string) => executor || '-'
    },
    {
      title: 'Last Execute Time',
      dataIndex: 'lastExecuteTime',
      key: 'lastExecuteTime',
      // sorter: true,
      render: (time: string) => (time ? <StyledDiv>{formatTime(time)}</StyledDiv> : '-')
    },
    {
      title: 'Action',
      key: 'actions',
      render: (_, record: IListPipeline) => {
        const { pipelineName, env, isFreezing } = record
        const isLive = env && env.toUpperCase() === 'LIVE'
        const canRun = isLive ? canRunPipelineLive : canRunPipelineNonLive
        return (
          <StyledButton
            type='default'
            onClick={() => {
              setPipelineToBeRun(pipelineName)
              showEditDrawer()
            }}
            disabled={isBatchingMigrate || !canRunPipeline(canRun, isFreezing)}
          >
            Run Pipeline
          </StyledButton>
        )
      }
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (rowKeys: string[]) => {
      setSelectedRowKeys(rowKeys)
    },
    getCheckboxProps: (record: IListPipeline) => ({
      disabled: record.engine === DISABLED_MIGRATE_ENGINE
    })
  }

  return (
    <Prompt when={isBatchingMigrate} onlyPathname={true}>
      <Table
        rowSelection={isBatchingMigrate ? rowSelection : undefined}
        rowKey='id'
        columns={columns}
        loading={listPipelinesState.loading}
        dataSource={pipelines}
        onChange={onTableChange}
        pagination={{
          ...pagination,
          ...TABLE_PAGINATION_OPTION,
          total: totalSize
        }}
      />
      {pipelineToBeRun && (
        <RunPipelineDrawer
          visible={isEditDrawerVisible}
          onHideDrawer={closeEditDrawer}
          onRefresh={onRefresh}
          tenantId={tenantId}
          pipelineName={pipelineToBeRun}
        />
      )}
      <BatchMigrateOperation
        engines={engines}
        selectedRowKeys={selectedRowKeys}
        isBatchingMigrate={isBatchingMigrate}
        onCloseBatMchigrate={onCloseBatMchigrate}
        onChangeSelectedRowKeys={rowSelection.onChange}
      />
    </Prompt>
  )
}

export default PipelinesTable
