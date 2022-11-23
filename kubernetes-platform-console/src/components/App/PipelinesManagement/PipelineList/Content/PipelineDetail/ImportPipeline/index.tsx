import React, { useState } from 'react'

import { pipelinesControllerImportPipelines } from 'swagger-api/v3/apis/Pipelines'

import { Form, message } from 'infrad'
import ImportForm from './ImportForm'
import CrudDrawer from 'components/Common/CrudDrawer'
import { StyledTitle } from './style'

interface IImportPipeline {
  visible: boolean
  onHideDrawer: () => void
  onRefresh: () => void
  tenantId: number
}

const ImportPipeline: React.FC<IImportPipeline> = ({ visible, onHideDrawer, onRefresh, tenantId }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(true)

  const handleFieldsChange = (disabled: boolean) => setDisabled(disabled)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values: any = await form.validateFields()
      const { tenantName, ...others } = values
      await pipelinesControllerImportPipelines({ tenantId, payload: others })
      handleCancel()
      onRefresh()
      message.success('Import pipelines successfully!')
    } catch (err) {
      err.message && message.error(err.message)
    }
    setLoading(false)
  }

  const handleCancel = () => {
    form.resetFields(['engine', 'project', 'names'])
    onHideDrawer()
  }

  return (
    <CrudDrawer
      isSubmitDisabled={disabled}
      title={<StyledTitle>Import Pipeline</StyledTitle>}
      visible={visible}
      getContainer={false}
      closeDrawer={handleCancel}
      body={<ImportForm form={form} onFieldsChange={handleFieldsChange} />}
      onSubmit={handleSubmit}
      isLoading={loading}
      submitText='Submit'
    />
  )
}

export default ImportPipeline
