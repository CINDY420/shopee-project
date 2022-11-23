import React from 'react'
import useAsyncFn from 'hooks/useAsyncFn'
import history from 'helpers/history'
import { Form, message } from 'infrad'
import CrudDrawer from 'components/Common/CrudDrawer'

import RunPipelineForm from './RunPipelineForm'
import { StyledTitle } from './style'

import {
  pipelinesControllerGetPipelineDetail,
  pipelinesControllerCreatePipelineRun
} from 'swagger-api/v3/apis/Pipelines'
import { buildPipelineHistoriesName } from 'constants/routes/name'
interface IRunPipelineDrawer {
  visible: boolean
  onHideDrawer: () => void
  onRefresh: () => void
  tenantId: number
  pipelineName: string
}

const RunPipelineDrawer: React.FC<IRunPipelineDrawer> = ({
  visible,
  onHideDrawer,
  onRefresh,
  tenantId,
  pipelineName
}) => {
  const [form] = Form.useForm()
  const [getPipelineState, getPipelineFn] = useAsyncFn(pipelinesControllerGetPipelineDetail)
  React.useEffect(() => {
    if (pipelineName && tenantId && visible) {
      getPipelineFn({ tenantId, pipelineName })
    }
  }, [visible, pipelineName, tenantId, getPipelineFn])

  const handleSubmit = async () => {
    try {
      const fieldData = await form.validateFields()
      const parameters = []
      Object.keys(fieldData).forEach(key => {
        switch (key) {
          case 'pipelineName':
            break
          case 'DEPLOY_CIDS':
            const cidString = fieldData[key].join(',')
            const cids = {
              name: key,
              value: cidString,
              type: 'string'
            }
            parameters.push(cids)
            break
          default:
            const item = {
              name: key,
              value: fieldData[key],
              type: fieldData[key] === true || fieldData[key] === false ? 'bool' : 'string'
            }
            parameters.push(item)
            break
        }
      })
      await pipelinesControllerCreatePipelineRun({ tenantId, pipelineName, payload: { parameters } })
      onHideDrawer()
      form.resetFields()
      onRefresh && onRefresh()
      message.success('Run Pipeline Successfully!')
      history.push(buildPipelineHistoriesName(tenantId, pipelineName))
    } catch (e) {
      e.message && message.error(e.message)
    }
  }

  const handleCancel = () => {
    onHideDrawer()
    form.resetFields()
  }

  return (
    <>
      <CrudDrawer
        isSubmitDisabled={false}
        title={<StyledTitle>Run Pipeline</StyledTitle>}
        visible={visible}
        closeDrawer={onHideDrawer}
        body={
          <RunPipelineForm
            form={form}
            tenantId={tenantId}
            pipelineName={pipelineName}
            getPipelineState={getPipelineState}
          />
        }
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        isLoading={getPipelineState.loading}
      />
    </>
  )
}

export default RunPipelineDrawer
