import * as React from 'react'
import { message } from 'infrad'
import { SearchOutlined } from 'infra-design-icons'
import { useQueryParam, StringParam } from 'use-query-params'
import { MigrationContext } from '../../useMigrationContext'

import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { AccessControlContext } from 'hooks/useAccessControl'

import history from 'helpers/history'
import { throttle } from 'helpers/functionUtils'

import PipelinesTable from './PipelinesTable'
import ImportPipeline from './ImportPipeline'
import ReleaseFreezeNotice from 'components/App/PipelinesManagement/Common/ReleaseFreezeNotice'

import { ActionHeaderWrapper, SearchRow, FilterSearchWrapper, FilterInput, FilterSelect, StyledButton } from './style'
import { freezesControllerGetLastReleaseFreeze } from 'swagger-api/v3/apis/ReleaseFreezes'
import { pipelinesControllerListPipelines } from 'swagger-api/v3/apis/Pipelines'
import { filterTypes, getFilterItem, getFilterUrlParam } from 'helpers/queryParams'
import { IListPipelinesResponseDto, IReleaseFreezeItemDto } from 'swagger-api/v3/models'
import { directoryControllerListDirectoryProjects } from 'swagger-api/v1/apis/Directory'

import accessControl from 'hocs/accessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION, PERMISSION_SCOPE } from 'constants/accessControl'

interface IPipelineListProps {
  tenantId: number
}

const PipelineDetail: React.FC<IPipelineListProps> = ({ tenantId }) => {
  const { state } = React.useContext(MigrationContext)
  const { status: migrationTaskStatus } = state

  const [pipelineQueryParam, setPipelineQueryParam] = useQueryParam('pipeline', StringParam)
  const [projectQueryParam, setProjectQueryParam] = useQueryParam('project', StringParam)
  const [engineQueryParam, setEngineQueryParam] = useQueryParam('engine', StringParam)

  const [searchPipelineVal, setSearchPipelineVal] = React.useState<string>(pipelineQueryParam)
  const [selectedProject, setSelectedProject] = React.useState<string>(projectQueryParam)
  const [filteredEngine, setFilteredEngine] = React.useState<string>(engineQueryParam)
  const [options, setOptions] = React.useState([])
  const [isFreezing, setIsFreezing] = React.useState<boolean>(false)
  const [releaseFreezeDetail, setReleaseFreezeDetail] = React.useState<IReleaseFreezeItemDto>()
  const [importDrawerVisible, setImportDrawerVisible] = React.useState<boolean>(false)
  const [isBatchingMigrate, setIsBatchingMigrate] = React.useState<boolean>(false)

  const accessControlContext = React.useContext(AccessControlContext)
  const pipelineActions = accessControlContext[RESOURCE_TYPE.PIPELINE] || []
  const canImport = pipelineActions.includes(RESOURCE_ACTION.Import)
  const canBatchMigrate = pipelineActions.includes(RESOURCE_ACTION.BatchMigrate)

  const {
    startTime: freezeStartTime = '',
    endTime: freezeEndTime = '',
    env: freezeEnv = '',
    reason: freezeReason = ''
  } = releaseFreezeDetail || {}

  const listPipelinesFnWithResource = React.useCallback(
    args => {
      const { filterBy } = args || {}
      const extraFilterBy = getFilterUrlParam({
        pipelineName: getFilterItem('pipelineName', searchPipelineVal, filterTypes.contain),
        projectName: getFilterItem('projectName', selectedProject, filterTypes.equal)
      })
      const initialFilterBy = !filterBy && filteredEngine ? `engine==${filteredEngine}` : filterBy

      return pipelinesControllerListPipelines({
        tenantId,
        ...args,
        filterBy: initialFilterBy ? `${initialFilterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy
      })
    },
    [tenantId, searchPipelineVal, selectedProject, filteredEngine]
  )

  const [listPipelinesState, listPipelinesFn] = useAsyncIntervalFn<IListPipelinesResponseDto>(
    listPipelinesFnWithResource
  )
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listPipelinesFn })

  const handleTableChangeToGetFilters = async (pagination, filters, sorter, extra) => {
    const { engine } = filters
    await setEngineQueryParam(engine?.[0])
    await setFilteredEngine(engine?.[0])
    handleTableChange(pagination, filters, sorter, extra)
  }

  const getProjects = async () => {
    try {
      const result = await directoryControllerListDirectoryProjects({ tenantId: String(tenantId) })
      const { projects = [] } = result || {}
      const options = projects.map(project => ({
        label: project.name,
        value: project.name
      }))
      setOptions(options)
    } catch (err) {
      err.message && message.error(err.message)
    }
  }
  const getReleaseFreeze = async () => {
    const result = await freezesControllerGetLastReleaseFreeze({ env: '' })
    const { isFreezing, item } = result
    setIsFreezing(isFreezing)
    setReleaseFreezeDetail(item)
  }

  React.useEffect(() => {
    getProjects()
    getReleaseFreeze()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePipelineChange = React.useCallback(val => {
    setSearchPipelineVal(val)
    setPipelineQueryParam(val || undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleProjectChange = React.useCallback(val => {
    setSelectedProject(val)
    setProjectQueryParam(val)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  React.useEffect(() => {
    throttledRefresh()
  }, [searchPipelineVal, selectedProject, migrationTaskStatus, throttledRefresh])

  const handleCreatePipeline = () => {
    history.push(`/pipelines/tenants/${tenantId}/create`)
  }

  return (
    <>
      {isFreezing && (
        <ReleaseFreezeNotice
          startTime={freezeStartTime}
          endTime={freezeEndTime}
          env={freezeEnv}
          reason={freezeReason}
        />
      )}
      <ActionHeaderWrapper>
        <SearchRow>
          <FilterSearchWrapper>
            <span>Pipeline</span>
            <FilterInput
              value={searchPipelineVal}
              allowClear
              placeholder='Search Pipeline Name'
              onChange={event => handlePipelineChange(event.target.value)}
              suffix={<SearchOutlined />}
              style={{ minWidth: '240px' }}
              disabled={isBatchingMigrate}
            />
          </FilterSearchWrapper>
          <FilterSearchWrapper>
            <span>Project</span>
            <FilterSelect
              value={selectedProject}
              allowClear
              showSearch
              placeholder='Search Project Name'
              options={options}
              onChange={val => handleProjectChange(val)}
              style={{ minWidth: '240px' }}
              disabled={isBatchingMigrate}
            />
          </FilterSearchWrapper>
        </SearchRow>
        <StyledButton onClick={() => setIsBatchingMigrate(true)} disabled={isBatchingMigrate || !canBatchMigrate}>
          Batch-Migrate
        </StyledButton>
        <StyledButton onClick={() => setImportDrawerVisible(true)} disabled={isBatchingMigrate || !canImport}>
          Import Pipeline
        </StyledButton>
        <StyledButton type='primary' onClick={handleCreatePipeline} disabled={isBatchingMigrate}>
          Create Pipeline
        </StyledButton>
      </ActionHeaderWrapper>
      <PipelinesTable
        pagination={pagination}
        listPipelinesState={listPipelinesState}
        onTableChange={handleTableChangeToGetFilters}
        filteredEngine={filteredEngine}
        onRefresh={refresh}
        pipelineActions={pipelineActions}
        isBatchingMigrate={isBatchingMigrate}
        onCloseBatMchigrate={() => setIsBatchingMigrate(false)}
      />
      <ImportPipeline
        visible={importDrawerVisible}
        onHideDrawer={() => setImportDrawerVisible(false)}
        onRefresh={refresh}
        tenantId={tenantId}
      />
    </>
  )
}

export default accessControl(PipelineDetail, PERMISSION_SCOPE.TENANT, [RESOURCE_TYPE.PIPELINE])
