import React, { useEffect, useState } from 'react'

import { useRecoilValue } from 'recoil'
import { selectedProject } from 'states/applicationState/project'
import { buildProjectDetailRoute } from 'constants/routes/routes'
import history from 'helpers/history'

import { Form, message } from 'infrad'
import CrudDrawer from 'components/Common/CrudDrawer'

import { projectControllerMoveProject } from 'swagger-api/v1/apis/Project'

import { groupsControllerGetTenantList } from 'swagger-api/v3/apis/Tenants'

import { ITenant } from 'api/types/application/group'

import MoveForm from './MoveForm'

import { StyledTitle } from './style'

interface IMoveDrawer {
  visible: boolean
  onHideDrawer: (boolean) => void
}

const MoveDrawer: React.FC<IMoveDrawer> = ({ visible, onHideDrawer }) => {
  const project = useRecoilValue(selectedProject)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [tenants, setTenants] = useState<ITenant[]>([])

  const { name: projectName, tenantId: sourceTenantId } = project || {}

  const fetchTenants = async () => {
    const result = await groupsControllerGetTenantList({ offset: 0 })
    const { tenantList = [] } = result || {}
    setTenants(tenantList)
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values: any = await form.validateFields()
      const { tenantId: targetTenantId } = values
      await projectControllerMoveProject({
        tenantId: sourceTenantId,
        projectName,
        payload: { targetTenant: targetTenantId.toString() }
      })
      onHideDrawer(false)
      message.success('Move success!')
      history.push(buildProjectDetailRoute({ tenantId: targetTenantId, projectName }))
    } catch (err) {
      err.message && message.error(err.message)
    }
    setLoading(false)
  }

  return (
    <CrudDrawer
      isSubmitDisabled={false}
      title={<StyledTitle>Move</StyledTitle>}
      visible={visible}
      getContainer={false}
      closeDrawer={() => onHideDrawer(false)}
      body={<MoveForm form={form} tenants={tenants} />}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  )
}

export default MoveDrawer
