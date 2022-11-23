import * as React from 'react'
import { Button } from 'infrad'
import { SearchOutlined } from 'infra-design-icons'

import { applicationId } from 'helpers/applicationId'
import { throttle } from 'helpers/functionUtils'
import history from 'helpers/history'
import { getFilterUrlParam, getFilterItem, filterTypes } from 'helpers/queryParams'
import useUpdateApplicationToTree from 'hooks/tree/useUpdateApplicationToTree'

import { APPLICATIONS } from 'constants/routes/routes'
import { STATUS } from 'constants/application'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'

import { IApplicationList } from 'api/types/application/application'

import HealthyStatus from 'components/Common/HealthyStatus'
import { Table } from 'common-styles/table'

import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

import { useRecoilValue } from 'recoil'
import { selectedProject } from 'states/applicationState/project'

import ApplicationCrudDrawer from 'components/App/ApplicationsManagement/CreateApplication'

import { SearchRow, StyledInput } from './style'
import { applicationControllerListApplications } from 'swagger-api/v1/apis/Application'
import { IApplication } from 'swagger-api/v1/models'

const goToApplicationDetailPage = (app: { name: string; tenantId: number; projectName: string }) => {
  const id = applicationId(app)
  history.push(`${APPLICATIONS}/${id}`)
}

const statusFilters = Object.values(STATUS).map((item: string) => ({ text: item, value: item }))

const ApplicationTable: React.FC = () => {
  const project = useRecoilValue(selectedProject)
  const { tenantId, name: projectName, envs = [], cids = [] } = project || {}
  const [visible, setVisible] = React.useState(false)
  const updateApplicationToTreeFn = useUpdateApplicationToTree()

  const [searchVal, setSearchVal] = React.useState('')

  const accessControlContext = React.useContext(AccessControlContext)
  const applicationActions = accessControlContext[RESOURCE_TYPE.APPLICATION] || []
  const canCreateApplication = applicationActions.includes(RESOURCE_ACTION.Create)

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (item: IApplication) => {
        return (
          <a
            style={{ color: '#333', fontWeight: 500 }}
            onClick={() => goToApplicationDetailPage({ ...item, tenantId, projectName })}
          >
            {item.name}
          </a>
        )
      },
      sorter: true
    },
    {
      title: 'Environment',
      dataIndex: 'environments',
      key: 'environments',
      filters: envs.map((item: string) => ({ text: item, value: item })),
      render: (environments: string[]) => environments.join(',') || '--'
    },
    {
      title: 'CID',
      dataIndex: 'cids',
      key: 'cids',
      filters: cids.map((item: string) => ({ text: item, value: item })),
      render: (cids: string[]) => cids.join(',') || '--'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusFilters,
      render: (status: string) => status && <HealthyStatus status={status} />
    }
  ]

  const listApplicationsFnWithResource = React.useCallback(
    args => {
      const { filterBy, orderBy } = args || {}
      const extraFilterBy = getFilterUrlParam({
        name: getFilterItem('name', searchVal, filterTypes.contain)
      })

      return applicationControllerListApplications({
        tenantId,
        projectName,
        ...args,
        orderBy: orderBy?.length > 0 ? orderBy : undefined,
        filterBy: filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy
      })
    },
    [tenantId, projectName, searchVal]
  )

  const [listApplicationsState, listApplicationsFn] = useAsyncIntervalFn<any>(listApplicationsFnWithResource)
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listApplicationsFn })

  const handleSearchChange = React.useCallback(val => {
    setSearchVal(val)
  }, [])

  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  React.useEffect(() => {
    throttledRefresh()
  }, [searchVal, throttledRefresh])

  const { loading, value } = listApplicationsState
  const { apps = [], totalCount } = (value || {}) as IApplicationList

  return (
    <div>
      <SearchRow>
        <StyledInput
          value={searchVal}
          allowClear
          placeholder='Search Application...'
          onChange={event => handleSearchChange(event.target.value)}
          suffix={<SearchOutlined />}
        />
        {canCreateApplication && (
          <Button
            type='primary'
            onClick={() => {
              setVisible(true)
            }}
          >
            Create Application
          </Button>
        )}
      </SearchRow>
      <Table
        rowKey={(record: any) => {
          const { cid, environment, name } = record
          return `${name}-${cid}-${environment}`
        }}
        columns={columns}
        loading={loading}
        dataSource={apps}
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          ...TABLE_PAGINATION_OPTION,
          total: totalCount
        }}
      />
      {visible ? (
        <ApplicationCrudDrawer
          visible={visible}
          onHide={(visible: boolean) => setVisible(visible)}
          onRefresh={() => {
            refresh(false)
            updateApplicationToTreeFn(tenantId, projectName)
          }}
        />
      ) : null}
    </div>
  )
}

export default ApplicationTable
