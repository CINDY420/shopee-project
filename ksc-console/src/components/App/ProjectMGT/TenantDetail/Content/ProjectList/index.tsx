import React from 'react'
import { Col, Form, message, Row, Tag } from 'infrad'
import { Link, useParams } from 'react-router-dom'
import { useDebounce } from 'react-use'
import { PROJECT } from 'constants/routes/route'
import ExpandableTable from 'components/Common/ExpandableTable'
import TableSearchInput from 'components/Common/TableSearchInput'
import TableCreateButton from 'components/Common/TableCreateButton'
import QuotasTable from './QuotasTable'
import useAntdTable from 'hooks/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useGeneratePath from 'hooks/useGeneratePath'
import useCheckPermission from 'hooks/useCheckPermission'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import {
  projectControllerCreateProject,
  projectControllerListProjects,
} from 'swagger-api/apis/Project'
import { IListProjectsResponse, IProjectListItem } from 'swagger-api/models'
import { ITableParams } from 'types/table'
import CrudModal from 'components/Common/CrudModal'
import ProjectModalForm from 'components/App/ProjectMGT/Common/ProjectModalForm'
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from 'constants/permission'
import useCheckRoles from 'hooks/useCheckRoles'
import { PLATFORM_ADMIN_ID, TENANT_ADMIN_ID } from 'constants/auth'
import { generateRequestEnvQuotas } from 'helpers/project'

const ProjectList = () => {
  const { tenantId } = useParams()
  const getPath = useGeneratePath()
  const [searchVal, setSearchVal] = React.useState<string>()
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const checkProjectPermission = useCheckPermission(PERMISSION_RESOURCE.PROJECT)
  const checkJobPermission = useCheckPermission(PERMISSION_RESOURCE.SHOPEE_JOB)
  const permission = {
    canViewDetail: checkProjectPermission(PERMISSION_ACTION.GET),
    canViewJobList: checkJobPermission(),
  }
  const canCreateProject = useCheckRoles([
    {
      roleId: PLATFORM_ADMIN_ID,
    },
    {
      roleId: TENANT_ADMIN_ID,
      tenantId,
    },
  ])

  const [form] = Form.useForm()

  const listProjectsFnWithResource = React.useCallback(
    (tableQueryParams: ITableParams) => {
      if (tenantId)
        return projectControllerListProjects({
          tenantId,
          ...tableQueryParams,
          searchBy: searchVal,
        })
    },
    [tenantId, searchVal],
  )
  const [listProjectsState, listProjectsFn] = useAsyncIntervalFn<IListProjectsResponse>(
    listProjectsFnWithResource,
  )
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listProjectsFn })
  const { items: projectLists = [], total } = listProjectsState.value || {}

  useDebounce(
    () => {
      searchVal !== undefined && refresh()
    },
    500,
    [searchVal],
  )

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (displayName: string, record: IProjectListItem) =>
        permission.canViewJobList ? (
          <Link
            style={{ color: '#2673DD', fontWeight: 500 }}
            to={getPath(PROJECT, { projectId: record.projectId })}
          >
            {displayName}
          </Link>
        ) : (
          displayName
        ),
    },
    {
      title: 'ID',
      dataIndex: 'projectId',
      key: 'projectId',
    },
    {
      title: 'ENV',
      dataIndex: 'envs',
      key: 'envs',
      render: (envs: Array<string>) => envs.map((item) => <Tag key={item}>{item}</Tag>),
    },
    {
      title: 'Cluster',
      dataIndex: 'clusters',
      key: 'clusters',
      render: (clusters: Array<string>) => clusters.map((item) => <Tag key={item}>{item}</Tag>),
    },
  ]

  const handleSearchChange = (value: string) => {
    setSearchVal(value)
  }

  const handleCreateProject = async () => {
    const formData = await form.validateFields()
    const { projectName, uss, logStore, ...formEnvQuotas } = formData
    const envQuotas = generateRequestEnvQuotas(formEnvQuotas)
    const payload = { projectName, envQuotas, uss, logStore }
    if (tenantId)
      try {
        await projectControllerCreateProject({
          tenantId,
          payload,
        })
        handleCloseModalAfterSuccess()
      } catch (error) {
        message.error(error?.message || 'Create project failed')
      }
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalVisible(false)
  }

  const handleCloseModalAfterSuccess = () => {
    setIsModalVisible(false)
    refresh()
  }
  return (
    <>
      <Row justify="space-between">
        <Col>
          <TableSearchInput
            placeholder="Search Project..."
            value={searchVal}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </Col>
        {canCreateProject && (
          <Col>
            <TableCreateButton
              title="Create Project"
              onClick={() => {
                setIsModalVisible(true)
              }}
            />
          </Col>
        )}
      </Row>
      <ExpandableTable
        rowKey="projectId"
        columns={columns}
        dataSource={projectLists}
        Component={permission.canViewDetail ? QuotasTable : null}
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          ...TABLE_PAGINATION_OPTION,
          total,
        }}
        scroll={{ x: true }}
      />
      <CrudModal
        title="Create Project"
        width={1024}
        visible={isModalVisible}
        onOk={handleCreateProject}
        onCancel={handleCancel}
        destroyOnClose
      >
        <ProjectModalForm form={form} isEdit={false} />
      </CrudModal>
    </>
  )
}

export default ProjectList
