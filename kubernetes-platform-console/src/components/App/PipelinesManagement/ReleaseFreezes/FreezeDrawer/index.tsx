import React, { useState } from 'react'

import { IReleaseFreezeDetail } from 'api/types/application/pipeline'

import {
  freezesControllerCreateReleaseFreeze,
  freezesControllerUpdateReleaseFreeze
} from 'swagger-api/v3/apis/ReleaseFreezes'

import { Form, message } from 'infrad'
import CrudDrawer from 'components/Common/CrudDrawer'
import FreezeForm from './FreezeForm'
import { StyledTitle } from './style'

interface ICreateFreezeDrawer {
  visible: boolean
  onHideDrawer: () => void
  selectedFreeze?: IReleaseFreezeDetail
  onRefresh: () => void
}

const FreezeDrawer: React.FC<ICreateFreezeDrawer> = ({ visible, onHideDrawer, selectedFreeze, onRefresh }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(true)

  const { id: releaseFreezeId } = selectedFreeze || {}

  const handleFieldsChange = (disabled: boolean) => setDisabled(disabled)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values: any = await form.validateFields()
      const { timeSlot, env: envs, ...others } = values
      const startTime = timeSlot[0].valueOf()
      const endTime = timeSlot[1].valueOf()
      selectedFreeze
        ? await freezesControllerUpdateReleaseFreeze({
            releaseFreezeId,
            payload: {
              envs: envs.split('/'),
              startTime,
              endTime,
              ...others
            }
          })
        : await freezesControllerCreateReleaseFreeze({ payload: { envs, startTime, endTime, ...others } })
      handleCancel()
      onRefresh()
      message.success(`${selectedFreeze ? 'Edit' : 'Create'} release freeze successfully!`)
    } catch (err) {
      err.message && message.error(err.message)
    }
    setLoading(false)
  }

  const handleCancel = () => {
    form.resetFields()
    onHideDrawer()
  }

  return (
    <CrudDrawer
      isSubmitDisabled={disabled}
      title={<StyledTitle>{selectedFreeze ? 'Edit' : 'Release Freeze'}</StyledTitle>}
      visible={visible}
      getContainer={false}
      closeDrawer={handleCancel}
      body={
        <FreezeForm form={form} selectedFreeze={selectedFreeze} onFieldsChange={handleFieldsChange} visible={visible} />
      }
      onSubmit={handleSubmit}
      isLoading={loading}
      submitText={selectedFreeze ? 'Save' : 'Submit'}
    />
  )
}

export default FreezeDrawer
