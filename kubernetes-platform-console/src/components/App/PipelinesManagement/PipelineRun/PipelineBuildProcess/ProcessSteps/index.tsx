import React, { useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { selectedTenant } from 'states/applicationState/tenant'
import { selectedPipeline, selectedPipelineRun } from 'states/pipelineState'

import { pipelinesControllerConfirmPipelineRun } from 'swagger-api/v3/apis/Pipelines'
import { IStage, INextPendingInput } from 'api/types/application/pipeline'
import useDeepEqualEffect from 'hooks/useDeepEqualEffect'

import { Button, Select, Form, message as antdMessage } from 'infrad'
import Step from './Step'
import { StyledDiv, StyledModal, StyledForm } from './style'

const { Item } = StyledForm

interface IProcessSteps {
  jobId: string
  stepId: string
  onStepChange: (jobId: string, stepId: string, setpStatus: string) => void
  stages: IStage[]
  nextPendingInput: INextPendingInput
}

const ProcessSteps: React.FC<IProcessSteps> = ({ onStepChange, jobId, stepId, stages, nextPendingInput }) => {
  const tenant = useRecoilValue(selectedTenant)
  const pipeline = useRecoilValue(selectedPipeline)
  const pipelineRun = useRecoilValue(selectedPipelineRun)
  const { id: tenantId } = tenant
  const { name: pipelineName } = pipeline
  const { id: runId } = pipelineRun

  const [expandedArr, setExpandedArr] = useState<boolean[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(!!nextPendingInput)
  const [canModalConfirm, setCanModalConfirm] = useState<boolean>(false)

  const [form] = Form.useForm()

  const { id: inputId, inputs = [], message = 'Notice' } = nextPendingInput || {}

  useDeepEqualEffect(() => {
    const { id: firstJobId } = (stages && stages[0]) || {}
    const id = jobId || firstJobId
    const arr = stages.map(step => step.id === id)
    setExpandedArr(arr)
  }, [stages, jobId])

  useDeepEqualEffect(() => {
    setModalVisible(!!nextPendingInput)
  }, [nextPendingInput])

  const handleOk = async () => {
    const values = await form.validateFields()
    const parameter = []
    for (const [name, value] of Object.entries(values)) {
      parameter.push({
        name,
        value
      })
    }
    try {
      await pipelinesControllerConfirmPipelineRun({
        tenantId,
        pipelineName,
        runId,
        payload: {
          stepId,
          inputId,
          parameter
        }
      })
      handleCancel()
    } catch (e) {
      e.message && antdMessage.error(e.message)
    }
  }

  const handleCancel = () => {
    setModalVisible(false)
    setCanModalConfirm(false)
    form.resetFields()
  }

  const onModalVisibleChange = useCallback(() => {
    setModalVisible(true)
  }, [])

  const handleValuesChange = (_, allValues) => {
    if (Object.entries(allValues).length === inputs.length) {
      setCanModalConfirm(true)
    }
  }

  return (
    <>
      <StyledDiv>
        {stages.map((item, index) => (
          <Step
            {...item}
            key={index}
            expanded={expandedArr[index]}
            onStepChange={onStepChange}
            onModalVisibleChange={onModalVisibleChange}
          />
        ))}
      </StyledDiv>
      <StyledModal
        title={message}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer={() => document.body}
        footer={[
          <Button key='cancel' onClick={handleCancel} style={{ fontWeight: 500 }}>
            Cancel
          </Button>,
          <Button
            key='confirm'
            onClick={handleOk}
            type='primary'
            disabled={!canModalConfirm}
            style={{ fontWeight: 500 }}
          >
            Confirm
          </Button>
        ]}
      >
        <StyledForm form={form} layout='vertical' onValuesChange={handleValuesChange}>
          {inputs.map(input => {
            const { name, description, definition } = input
            const { choices = [] } = definition || {}
            return (
              <Item key={name} name={name} label={description} rules={[{ required: true }]}>
                <Select placeholder='Please choose one'>
                  {choices.map(choice => (
                    <Select.Option key={choice} value={choice}>
                      {choice}
                    </Select.Option>
                  ))}
                </Select>
              </Item>
            )
          })}
        </StyledForm>
      </StyledModal>
    </>
  )
}

export default ProcessSteps
