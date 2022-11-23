import * as React from 'react'
import DetailLayout from 'components/Common/DetailLayout'
import Content from 'components/App/ProjectMGT/ProjectDetail/Content'
import { Root } from 'components/App/ProjectMGT/ProjectDetail/style'
import Breadcrumbs, { CRUMB_TYPE } from 'components/App/ProjectMGT/Common/BreadCrumb'
import Overview from 'components/App/ProjectMGT/ProjectDetail/Overview'
import { useRecoilValue } from 'recoil'
import { selectedProject } from 'states'
import generateEnvsAndClusters, { generateClusters } from 'helpers/generateEnvsAndClusters'
import { ExclamationCircleOutlined, FormOutlined, ITrash } from 'infra-design-icons'
import CrudModal from 'components/Common/CrudModal'
import ProjectModalForm from 'components/App/ProjectMGT/Common/ProjectModalForm'
import { Form, message, Modal } from 'infrad'
import {
  projectControllerDeleteProject,
  projectControllerGetProject,
  projectControllerUpdateProject,
} from 'swagger-api/apis/Project'
import { useNavigate, useParams } from 'react-router-dom'
import useCheckRoles from 'hooks/useCheckRoles'
import { PLATFORM_ADMIN_ID, TENANT_ADMIN_ID } from 'constants/auth'

import { tenantControllerGetTenant } from 'swagger-api/apis/Tenant'
import useGeneratePath from 'hooks/useGeneratePath'
import { TENANT } from 'constants/routes/route'
import { useRemoteRecoil } from 'hooks/useRecoil'
import { generateRequestEnvQuotas } from 'helpers/project'

interface IProjectDetailContext {
  tenantName: string
  tenantCmdbName: string
  projectName: string
}
export const ProjectDetailContext = React.createContext<IProjectDetailContext>(null!)

const ProjectDetail: React.FC = () => {
  const { displayName: projectName, envClusterMetrics, uss } = useRecoilValue(selectedProject)
  const navigate = useNavigate()
  const [_, getProjectFn] = useRemoteRecoil(projectControllerGetProject, selectedProject)

  const [envs, clusters] = generateEnvsAndClusters(envClusterMetrics)
  const clusterItems = generateClusters(envClusterMetrics)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [tenantName, setTenantName] = React.useState('')
  const [tenantCmdbName, setTenantCmdbName] = React.useState('')
  const { tenantId, projectId } = useParams()
  const getPath = useGeneratePath()
  const [form] = Form.useForm()

  const canEditProject = useCheckRoles([
    {
      roleId: PLATFORM_ADMIN_ID,
    },
    {
      roleId: TENANT_ADMIN_ID,
      tenantId,
    },
  ])

  const handleEditProject = async () => {
    const formData = await form.validateFields()
    const { projectName, uss, logStore, ...formEnvQuotas } = formData
    const envQuotas = generateRequestEnvQuotas(formEnvQuotas)
    const payload = { projectName, envQuotas, uss, logStore }
    if (tenantId && projectId)
      try {
        await projectControllerUpdateProject({
          tenantId,
          projectId,
          payload,
        })
        handleCancel()
        getProjectFn({ tenantId, projectId })
        message.success('Edit project successfully')
      } catch (error) {
        message.error(error?.message || 'Edit project failed')
      }
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalVisible(false)
  }

  const handleDeleteProject = () => {
    Modal.confirm({
      title: 'Notice',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this project?',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        if (tenantId && projectId) {
          try {
            await projectControllerDeleteProject({
              tenantId,
              projectId,
            })
            message.success('Deleted project successfully')
            const path = getPath(TENANT, { tenantId })
            navigate(path)
          } catch (error) {
            message.error(error?.message || 'Delete project failed')
          }
        }
      },
    })
  }

  const getTenantName = React.useCallback(async () => {
    if (tenantId) {
      const { displayName, tenantCmdbName } = await tenantControllerGetTenant({ tenantId })
      setTenantCmdbName(tenantCmdbName)
      setTenantName(displayName)
    }
  }, [tenantId])

  React.useEffect(() => {
    getTenantName()
  }, [getTenantName])

  return (
    <>
      <DetailLayout
        title="Project:"
        resource={projectName}
        tags={[`Env: ${envs.join(', ')}`, `Cluster: ${clusters.join(', ')}`]}
        body={
          <ProjectDetailContext.Provider value={{ tenantName, projectName, tenantCmdbName }}>
            <Root>
              {clusterItems.length > 0 && <Overview clusterItems={clusterItems} envs={envs} />}
              <Content />
            </Root>
          </ProjectDetailContext.Provider>
        }
        isHeaderWithBottomLine
        isHeaderWithBreadcrumbs
        breadcrumbs={<Breadcrumbs crumbName={CRUMB_TYPE.PROJECT} />}
        buttons={
          canEditProject
            ? [
                {
                  icon: <FormOutlined />,
                  text: 'Edit',
                  onClick: () => {
                    setIsModalVisible(true)
                  },
                },
                {
                  icon: <ITrash />,
                  text: 'Delete',
                  tooltip: 'Delete can only be performed if there is no Job under the project',
                  onClick: () => {
                    handleDeleteProject()
                  },
                },
              ]
            : []
        }
      />
      <CrudModal
        title="Edit Project"
        width={1024}
        visible={isModalVisible}
        onOk={handleEditProject}
        onCancel={handleCancel}
        destroyOnClose
      >
        <ProjectModalForm form={form} isEdit projectName={projectName} projectUSS={uss} />
      </CrudModal>
    </>
  )
}

export default ProjectDetail
