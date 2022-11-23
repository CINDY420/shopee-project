/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { Button } from 'infrad'
import { SearchOutlined } from 'infra-design-icons'

import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { AccessControlContext } from 'hooks/useAccessControl'

import { projectControllerListProject } from 'swagger-api/v1/apis/Project'
import { getFilterUrlParam, getFilterItem, filterTypes } from 'helpers/queryParams'
import { throttle } from 'helpers/functionUtils'
import useUppdateProjectToTree from 'hooks/tree/useUppdateProjectToTree'

import ProjectsTable from './ProjectsTable'
import ProjectCrudDrawer from 'components/App/ApplicationsManagement/Common/ProjectCrudDrawer'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

import { SearchRow, StyledInput } from './style'

interface IProjectListProps {
  tenantName: string
  tenantId: number
  onRefreshGroup: () => void
}

const ProjectList: React.FC<IProjectListProps> = ({ tenantName, tenantId, onRefreshGroup }) => {
  const [searchVal, setSearchVal] = React.useState('')
  const [visible, setVisible] = React.useState(false)
  const updateProjectToTreeFn = useUppdateProjectToTree()

  const accessControlContext = React.useContext(AccessControlContext)
  const projectActions = accessControlContext[RESOURCE_TYPE.PROJECT] || []
  const canCreateProject = projectActions.includes(RESOURCE_ACTION.Create)

  const listProjectsFnWithResource = React.useCallback(
    args => {
      if (tenantId) {
        const { filterBy, orderBy } = args || {}
        const extraFilterBy = getFilterUrlParam({
          name: getFilterItem('name', searchVal, filterTypes.contain)
        })

        return projectControllerListProject({
          tenantId,
          ...args,
          orderBy: orderBy?.length > 0 ? orderBy : undefined,
          filterBy: filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy
        })
      }
    },
    [tenantId, searchVal]
  )

  const [listProjectsState, listProjectsFn] = useAsyncIntervalFn<any>(listProjectsFnWithResource)
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listProjectsFn })

  const handleSearchChange = React.useCallback(val => {
    setSearchVal(val)
  }, [])

  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  React.useEffect(() => {
    throttledRefresh()
  }, [searchVal, throttledRefresh])

  return (
    <>
      <SearchRow>
        <StyledInput
          value={searchVal}
          allowClear
          placeholder='Search Project...'
          onChange={event => handleSearchChange(event.target.value)}
          suffix={<SearchOutlined />}
        />
        {canCreateProject && (
          <Button
            type='primary'
            onClick={() => {
              setVisible(true)
            }}
            data-cy='create-project'
          >
            Create Project
          </Button>
        )}
      </SearchRow>
      <ProjectsTable pagination={pagination} listProjectsState={listProjectsState} onTableChange={handleTableChange} />
      {visible ? (
        <ProjectCrudDrawer
          data-cy='create-project-drawer'
          visible={visible}
          onHide={(visible: boolean) => setVisible(visible)}
          onRefresh={() => {
            refresh()
            onRefreshGroup()
            updateProjectToTreeFn(tenantName)
          }}
        />
      ) : null}
    </>
  )
}

export default ProjectList
