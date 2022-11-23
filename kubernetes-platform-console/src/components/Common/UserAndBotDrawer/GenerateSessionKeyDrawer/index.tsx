import React, { useState } from 'react'

import { Form, message } from 'infrad'
import CrudDrawer from 'components/Common/CrudDrawer'

import SessionKeyForm from './GenerateSessionKeyForm'
import SuccessModal from './SuccessModal'

import { groupsControllerGenerateBotAccessToken } from 'swagger-api/v3/apis/Tenants'
import { StyledTitle } from './style'

interface IUser {
  name: string
  id: number
  roleId: number
  detail?: string
}

interface ISessionKeyDrawer {
  visible: boolean
  onHideDrawer: () => void
  selectedUser: IUser
  tenantId: number
}

const SessionKeyDrawer: React.FC<ISessionKeyDrawer> = ({ visible, onHideDrawer, selectedUser, tenantId }) => {
  const { id } = selectedUser || {}
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [sessionKey, setSessionKey] = useState<string>()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values: any = await form.validateFields()
      const result = await groupsControllerGenerateBotAccessToken({ tenantId, botId: id, payload: values })
      const { sessionKey: key } = result
      setSessionKey(key)
      onHideDrawer()
      form.resetFields()
      setIsModalVisible(true)
    } catch (err) {
      err.message && message.error(err.message)
    }
    setLoading(false)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <CrudDrawer
        isSubmitDisabled={false}
        title={<StyledTitle>Generate Session Key</StyledTitle>}
        visible={visible}
        getContainer={false}
        closeDrawer={onHideDrawer}
        body={<SessionKeyForm form={form} selectedUser={selectedUser} />}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
      <SuccessModal visible={isModalVisible} sessionKey={sessionKey} handleOk={handleOk} handleCancel={handleCancel} />
    </>
  )
}

export default SessionKeyDrawer
