import React, { useState, useEffect, useCallback } from 'react'
import { Result, Button, Form, message } from 'infrad'
import CrudModal from 'components/Common/CrudModal'
import ApplyRoleForm from 'components/App/AccessApply/ApplyRoleForm'
import { Root } from 'components/App/AccessApply/style'
import {
  ticketControllerListUserSreTickets,
  ticketControllerCreateSreAddRoleTicket,
} from 'swagger-api/apis/Ticket'
import { getSession, defaultRouteRedirect } from 'helpers/session'
import { SRE_TICKET_STATUS } from 'constants/ticket'
import { hasRoles } from 'helpers/auth'

/**
 * 新用户权限申请、审批流程：
 * 1、新用户（未绑定任何tenant）访问平台时接口会返回403,通过check用户的roles.length===0跳转到此申请页；
 * 2、此页面提交tenant申请到sre工单系统后会有3种情况
 * （1）审批中：此页面展示pending状态
 * （2）close（未审批、人为关闭）：访问平台会报403继续跳到此页面让用户重复申请
 * （3）审批通过（用户有了tenant角色）：可以使用平台，不会跳到此页面
 */

const AccessApply: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [isTicketPending, setTicketPending] = useState(false)
  const [isSubmitLoading, setSubmitLoading] = useState(false)
  const userInfo = getSession()

  const handleClickApplyAccess = () => {
    if (isTicketPending) window.open(import.meta.env.VITE_SRE_TICKET_CONSOLE_LINK)
    else {
      setIsModalVisible(true)
      form.resetFields()
    }
  }
  const handleFieldsChange = () => setIsSubmitDisabled(false)
  // 对于旧用户访问则跳转到默认页
  const handleOldUserFn = async () => {
    const isOldUser = await hasRoles()
    isOldUser && defaultRouteRedirect()
  }

  const setTicketStatusFn = useCallback(async (email: string) => {
    const userTickets = await ticketControllerListUserSreTickets({ email })
    const hasPendingTickets = userTickets.items.some(
      (ticket) =>
        ticket.status === SRE_TICKET_STATUS.ASSIGN || ticket.status === SRE_TICKET_STATUS.APPROVAL,
    )
    if (hasPendingTickets) {
      setTicketPending(true)
      setIsModalVisible(false)
    }
  }, [])
  const handleSubmit = async () => {
    setSubmitLoading(true)
    try {
      const values = await form.validateFields()
      await ticketControllerCreateSreAddRoleTicket({
        payload: { userId: userInfo.userId, ...values },
      })
      message.success('Ticket created successfully!')
      setTicketStatusFn(userInfo.email)
    } catch (error) {
      error.message && message.error(error.message)
    }
    setSubmitLoading(false)
  }
  const handleSubmitCancel = () => setIsModalVisible(false)

  useEffect(() => {
    handleOldUserFn()
    setTicketStatusFn(userInfo.email)
  }, [setTicketStatusFn, userInfo])
  return (
    <Root>
      <Result
        status="404"
        title={isTicketPending ? 'Pending Approve' : 'No Permission'}
        subTitle={
          isTicketPending
            ? 'Ticket created successfully, click button to see ticket process'
            : 'Sorry, you are not authorized to access this page.'
        }
        extra={
          <Button onClick={handleClickApplyAccess} type="primary">
            {isTicketPending ? 'Ticket Process' : 'Apply Access'}
          </Button>
        }
      />
      <CrudModal
        visible={isModalVisible}
        title="Apple Access"
        onOk={handleSubmit}
        onCancel={handleSubmitCancel}
        isSubmitDisabled={isSubmitDisabled}
        isSubmitLoading={isSubmitLoading}
        centered
      >
        <ApplyRoleForm form={form} onFieldsChange={handleFieldsChange} />
      </CrudModal>
    </Root>
  )
}

export default AccessApply
