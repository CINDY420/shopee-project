import * as React from 'react'
import { Form, message } from 'infrad'
import { useRecoilValue } from 'recoil'

import { selectedProject } from 'states/applicationState/project'
import { selectedTenant } from 'states/applicationState/tenant'

import { projectsControllerGetResourceQuotas, projectsControllerUpdate } from 'swagger-api/v3/apis/Projects'
import { projectControllerCreateProject } from 'swagger-api/v1/apis/Project'

import CrudDrawer from 'components/Common/CrudDrawer'
import ProjectForm from './ProjectForm'
import { useAsyncFn } from 'react-use'
import { SDU_TYPE } from 'constants/deployment'
interface IProps {
  visible: boolean
  onHide: (visible: boolean) => void
  onRefresh?: () => void
  isEdit?: boolean
}

const getQuotasMapFormData = values => {
  let quotasMap = {}

  Object.entries(values).forEach((item: any) => {
    const [key, value] = item
    if (typeof key === 'string' && key.includes('---')) {
      const [, name, count] = key.split('---')
      quotasMap = {
        ...quotasMap,
        [name]: {
          ...quotasMap[name],
          name,
          [`${count}Total`]: Number(value)
        }
      }
    }
  })

  return quotasMap
}

const getSelectedQuotasKeys = quotas => {
  const selectedQuotasKeys = []

  Object.entries(quotas).forEach(([key, quotaNames]: any) => {
    quotaNames &&
      quotaNames.forEach(quotaName => {
        const prefix = `${key}---${quotaName}---`
        selectedQuotasKeys.push(`${prefix}cpu`, `${prefix}memory`)
      })
  })

  return selectedQuotasKeys
}

const formatQuotaValues = values => {
  const formattedQuotas = []
  const { quotas: quotaNamesMap } = values
  const quotasMap = getQuotasMapFormData(values)

  Object.values(quotaNamesMap).forEach((quotaNames: string[]) => {
    quotaNames &&
      quotaNames.forEach(quotaName => {
        quotaName && formattedQuotas.push(quotasMap[quotaName])
      })
  })

  return formattedQuotas
}

const ProjectCrudDrawer: React.FC<IProps> = ({ visible, onHide, onRefresh, isEdit }) => {
  const currentSelectedTenant = useRecoilValue(selectedTenant)
  const currentSelectedProject = useRecoilValue(selectedProject)
  const { name, tenantId } = currentSelectedProject

  const [listQuotasState, listQuotasFn] = useAsyncFn(projectsControllerGetResourceQuotas)

  const [disabled, setDisabled] = React.useState(true)

  const [form] = Form.useForm()
  const { resetFields } = form

  const handleSubmit = async () => {
    try {
      const selectedQuotasKeys = getSelectedQuotasKeys(form.getFieldValue('quotas'))
      const values = await form.validateFields([
        'name',
        'environment',
        'CID',
        'quotas',
        'orchestrator',
        ...selectedQuotasKeys
      ])
      const quotas = formatQuotaValues(values)

      if (isEdit) {
        await projectsControllerUpdate({
          projectName: values.name,
          tenantId: currentSelectedTenant.id,
          payload: {
            project: values.name,
            cids: values.CID,
            quotas
          }
        })
      } else {
        const payload = {
          project: values.name,
          cids: values.CID,
          envs: values.environment,
          orchestrators: values.orchestrator,
          quotas: values.orchestrator.includes(SDU_TYPE.ECP) ? quotas : undefined
        }
        await projectControllerCreateProject({
          tenantId: currentSelectedTenant.id,
          payload
        })
      }

      onHide(false)
      onRefresh && onRefresh()
      message.success(`Successfully ${isEdit ? 'updated' : 'created'} project!`)
    } catch (e) {
      e.message && message.error(e.message)
    }
  }

  const handleCancel = () => {
    resetFields()
    onHide(false)
  }

  const handleFieldsChange = (disabled: boolean) => setDisabled(disabled)

  React.useEffect(() => {
    if (name && tenantId && visible) {
      listQuotasFn({ projectName: name, tenantId })
    }
  }, [visible, listQuotasFn, name, tenantId])

  const project = React.useMemo(
    () => ({
      ...currentSelectedProject,
      quotas: listQuotasState.value || { clusters: [] }
    }),
    [currentSelectedProject, listQuotasState.value]
  )

  return (
    <CrudDrawer
      className='create-project-drawer'
      title={isEdit ? 'Edit Project' : 'Create Project'}
      visible={visible}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      body={
        <ProjectForm
          isEdit={isEdit}
          form={form}
          onFieldsChange={handleFieldsChange}
          selectedGroup={currentSelectedTenant}
          selectedProject={project}
        />
      }
      closeDrawer={() => onHide(false)}
      isSubmitDisabled={disabled}
      isLoading={listQuotasState.loading}
    />
  )
}

export default ProjectCrudDrawer
