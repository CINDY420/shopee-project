import React, { useState } from 'react'

import { useSetRecoilState } from 'recoil'
import { selectedPipeline } from 'states/pipelineState'

import { pipelinesControllerMigratePipeline, pipelinesControllerGetPipelineDetail } from 'swagger-api/v3/apis/Pipelines'

import { Form, message } from 'infrad'
import CrudDrawer from 'components/Common/CrudDrawer'
import MigtatePipelineForm from './MigratePipelineForm'
import { StyledTitle } from './style'

interface IMigratePipelineDrawer {
  visible: boolean
  tenantId: string
  pipelineName: string
  engine: string
  onHideDrawer: () => void
}

const MigratePipelineDrawer: React.FC<IMigratePipelineDrawer> = ({
  visible,
  tenantId,
  pipelineName,
  engine,
  onHideDrawer
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(true)

  const setSelectedPipeline = useSetRecoilState(selectedPipeline)

  const handleFieldsChange = (disabled: boolean) => setDisabled(disabled)

  const handleCloseDrawer = () => {
    form.resetFields(['destEngine'])
    setDisabled(true)
    onHideDrawer()
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values: any = await form.validateFields()
      const { destEngine } = values
      await pipelinesControllerMigratePipeline({ tenantId: Number(tenantId), pipelineName, payload: { destEngine } })
      handleCloseDrawer()
      const pipeline = await pipelinesControllerGetPipelineDetail({ tenantId: Number(tenantId), pipelineName })
      setSelectedPipeline(pipeline)
      message.success(`Migrate pipeline ${pipelineName} successfully!`)
    } catch (err) {
      err.message && message.error(err.message)
    }
    setLoading(false)
  }

  return (
    <CrudDrawer
      isSubmitDisabled={disabled}
      title={<StyledTitle>Migrate Pipeline</StyledTitle>}
      visible={visible}
      getContainer={false}
      closeDrawer={handleCloseDrawer}
      body={
        <MigtatePipelineForm
          form={form}
          tenantId={Number(tenantId)}
          pipelineName={pipelineName}
          engine={engine}
          onFieldsChange={handleFieldsChange}
        />
      }
      onSubmit={handleSubmit}
      isLoading={loading}
      submitText='Confirm'
    />
  )
}

export default MigratePipelineDrawer
