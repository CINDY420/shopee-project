import * as React from 'react'
import { FormOutlined } from 'infra-design-icons'
import { message, Modal, Dropdown, Menu } from 'infrad'

import { useRecoilState } from 'recoil'
import { selectedProject } from 'states/applicationState/project'
import { projectsControllerDeleteProject } from 'swagger-api/v3/apis/Projects'
import { projectControllerGetDetail } from 'swagger-api/v1/apis/Project'
import { roleControllerGetRbacUserInfo } from 'swagger-api/v3/apis/UserRole'
import { getSession } from 'helpers/session'

import DetailLayout from 'components/App/ApplicationsManagement/Common/DetailLayout'
import Overview from './Overview'
import Content from './Content'
import { VerticalDivider } from 'common-styles/divider'
import ProjectCrudDrawer from 'components/App/ApplicationsManagement/Common/ProjectCrudDrawer'
import { buildGroupDetailRoute } from 'constants/routes/routes'
import useAsyncFn from 'hooks/useAsyncFn'
import useUppdateProjectToTree from 'hooks/tree/useUppdateProjectToTree'
import MoveDrawer from 'components/App/ApplicationsManagement/Common/ProjectMoveDrawer'

import { useRemoteRecoil } from 'hooks/useRecoil'
import history from 'helpers/history'
import { getTags } from 'helpers/header'
import { Root, Operation, StyledButton } from './style'

import accessControl from 'hocs/accessControl'
import { AccessControlContext } from 'hooks/useAccessControl'
import { PERMISSION_SCOPE, RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

const { confirm } = Modal

const ProjectDetail: React.FC = () => {
  const [project, setProject] = useRecoilState(selectedProject)
  const [, selectProjectFn] = useRemoteRecoil(projectControllerGetDetail, selectedProject)
  const [visible, setVisible] = React.useState(false)
  const [moveDrawerVisible, setMoveDrawerVisible] = React.useState(false)
  const [deleteProjectState, deleteProjectFn] = useAsyncFn(projectsControllerDeleteProject)
  const updateProjectToTreeFn = useUppdateProjectToTree()
  const [userRoles, setUserRoles] = React.useState([])

  const accessControlContext = React.useContext(AccessControlContext)
  const projectActions = accessControlContext[RESOURCE_TYPE.PROJECT] || []
  const projectQuotaActions = accessControlContext[RESOURCE_TYPE.PROJECT_QUOTA] || []

  const canDeleteProject = projectActions.includes(RESOURCE_ACTION.Delete)
  const canEditProjectQuota = projectQuotaActions.includes(RESOURCE_ACTION.Edit)

  const loginedUser = getSession()
  const { userId } = loginedUser

  const getUserRolesFn = React.useCallback(async () => {
    const response = await roleControllerGetRbacUserInfo({ userId })
    const { roles } = response
    setUserRoles(roles)
  }, [userId])

  React.useEffect(() => {
    getUserRolesFn()
  }, [getUserRolesFn])

  const { tenantId, name: projectName } = project || {}

  const formattedProject = { ...project, clusters: project.simpleClusters }

  const deleteProjectConfirm = (projectName?: string, onOk?: () => any) => {
    confirm({
      title: `Do you want to delete project "${projectName}"?`,
      content: "This operation can't be recovered",
      okText: 'Yes',
      centered: true,
      onOk() {
        if (onOk) {
          onOk()
        }
      }
    })
  }

  React.useEffect(() => {
    if (visible) {
      selectProjectFn({ tenantId, projectName })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const deleteProjectConfirmFn = () => {
    deleteProjectConfirm(projectName, async () => {
      await deleteProjectFn({ tenantId, projectName })
      setProject({})
      history.push(buildGroupDetailRoute({ tenantId }))
      message.success('Delete success!')
      updateProjectToTreeFn(tenantId)
    })
  }

  const handleMenuClick = e => {
    switch (e.key) {
      case 'move':
        setMoveDrawerVisible(true)
        break
      case 'delete':
        deleteProjectConfirmFn()
        break
    }
  }

  const menu = (
    <Menu style={{ position: 'relative', zIndex: 999 }} onClick={handleMenuClick}>
      <Menu.Item key='move'>
        <StyledButton type='link' disabled={userRoles.find(role => role.tenantId === 0) === undefined}>
          Move
        </StyledButton>
      </Menu.Item>
      <Menu.Item key='delete'>
        <StyledButton type='link' disabled={!canDeleteProject} loading={deleteProjectState.loading}>
          Delete
        </StyledButton>
      </Menu.Item>
    </Menu>
  )

  return tenantId ? (
    <DetailLayout
      title={`Project: ${projectName}`}
      tags={getTags(formattedProject)}
      body={
        <Root>
          <Overview />
          <VerticalDivider size='1em' />
          <Content />
          {visible ? (
            <ProjectCrudDrawer
              visible={visible}
              onHide={(visible: boolean) => setVisible(visible)}
              isEdit={true}
              onRefresh={() => selectProjectFn({ tenantId, projectName })}
            />
          ) : null}
          {moveDrawerVisible ? (
            <MoveDrawer
              visible={moveDrawerVisible}
              onHideDrawer={(visible: boolean) => setMoveDrawerVisible(visible)}
            />
          ) : null}
        </Root>
      }
      buttons={[
        {
          icon: <FormOutlined />,
          text: 'Edit Project',
          visible: canEditProjectQuota,
          click: () => {
            setVisible(true)
          }
        }
      ]}
      ExtraButton={() => <MoreButton menu={menu} />}
    />
  ) : null
}

const MoreButton = props => {
  const { menu } = props

  return (
    <Dropdown overlay={menu}>
      <Operation type='link'>... More</Operation>
    </Dropdown>
  )
}

export default accessControl(ProjectDetail, PERMISSION_SCOPE.TENANT, [
  RESOURCE_TYPE.PROJECT,
  RESOURCE_TYPE.PROJECT_QUOTA,
  RESOURCE_TYPE.APPLICATION
])
