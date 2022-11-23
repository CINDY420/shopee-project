import React, { useState, useEffect } from 'react'

import { groupsControllerGetTenantList } from 'swagger-api/v3/apis/Tenants'
import { pipelinesControllerMovePipeline } from 'swagger-api/v3/apis/Pipelines'
import { ITenant } from 'api/types/application/group'
import { buildPipelineDetailRoute } from 'constants/routes/routes'
import history from 'helpers/history'

import { Form, message } from 'infrad'
import CrudDrawer from 'components/Common/CrudDrawer'
import MovePipelineForm from './MovePipelineForm'
import { StyledTitle } from './style'

interface IMovePipelineDrawer {
  visible: boolean
  tenantId: string
  pipelineName: string
  onHideDrawer: () => void
}

const MovePipelineDrawer: React.FC<IMovePipelineDrawer> = ({ visible, tenantId, pipelineName, onHideDrawer }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(true)
  const [tenants, setTenants] = useState<ITenant[]>([])

  const fetchTenants = async () => {
    const result = await groupsControllerGetTenantList({ offset: 0 })
    const { tenantList = [] } = result || {}
    setTenants(tenantList)
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  const handleFieldsChange = (disabled: boolean) => setDisabled(disabled)

  const handleCloseDrawer = () => {
    form.resetFields()
    setDisabled(true)
    onHideDrawer()
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values: any = await form.validateFields()
      const { targetTenantId } = values
      await pipelinesControllerMovePipeline({ tenantId: parseInt(tenantId), pipelineName, payload: { targetTenantId } })
      handleCloseDrawer()
      message.success(`Move pipeline ${pipelineName} successfully!`)
      history.push(buildPipelineDetailRoute({ tenantId: targetTenantId, pipelineName }))
    } catch (err) {
      err.message && message.error(err.message)
    }
    setLoading(false)
  }

  return (
    <CrudDrawer
      isSubmitDisabled={disabled}
      title={<StyledTitle>Move Pipeline</StyledTitle>}
      visible={visible}
      getContainer={false}
      closeDrawer={handleCloseDrawer}
      body={
        <MovePipelineForm
          form={form}
          tenants={tenants}
          tenantId={parseInt(tenantId)}
          onFieldsChange={handleFieldsChange}
        />
      }
      onSubmit={handleSubmit}
      isLoading={loading}
      submitText='Confirm'
    />
  )
}

export default MovePipelineDrawer
