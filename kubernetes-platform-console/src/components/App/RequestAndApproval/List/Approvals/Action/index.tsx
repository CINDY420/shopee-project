import * as React from 'react'
import { message, Input } from 'infrad'
import { ActionButton, StyledAuditResponseDiv } from 'components/App/RequestAndApproval/List/Approvals/Action/style'

import useAsyncFn from 'hooks/useAsyncFn'
import moment from 'moment-timezone'

import { ticketControllerUpdateTicketForm, ticketControllerUpdateTask } from 'swagger-api/v1/apis/Ticket'
import { ITicket } from 'swagger-api/v1/models'
import { TICKET_STAGE, APPROVAL_ACTION_TYPE, ACTION_ALERT_NAMES } from 'constants/requestAndApproval'
import { AUTH_TYPE } from 'constants/approval'
import Modal from 'infrad/lib/modal/Modal'
import { isShopeeScaleDeploymentTicket } from 'helpers/ticket/determineTicketType'

const APPROVE_POD_COUNT_NOTICE = 'The current pod count is not equal to the runtime pod count, are you to approve？'
const APPROVE_APPLIED_TIME_NOTICE = 'The ticket was submitted 7 days ago, are you to approve？'
const DEFAULT_APPROVE_NOTICE = 'Are you sure to approve this request？'
const DEFAULT_REFUSE_NOTICE = 'Are you sure you want to refuse the ticket? '

const { TextArea } = Input

interface IActionProps {
  onSuccess: () => void
  ticket: ITicket
  action: APPROVAL_ACTION_TYPE.APPROVE | APPROVAL_ACTION_TYPE.REJECT
  canInputAuditResponse?: boolean
  size?: 'middle' | 'small' | 'large'
  inputAuditResponse?: string
  onAuditResponseChange?: (auditResponse: string) => void
}

const Action: React.FC<IActionProps> = ({
  onSuccess,
  ticket,
  action,
  canInputAuditResponse = true,
  size = 'middle',
  inputAuditResponse,
  onAuditResponseChange
}) => {
  const { ticketId, ticketType, stage } = ticket?.metaInfo || {}
  const { extraInfo } = ticket || {}
  const taskId = isShopeeScaleDeploymentTicket(extraInfo) ? extraInfo.taskId : '0'
  const response = isShopeeScaleDeploymentTicket(extraInfo) ? extraInfo.variables?.auditResponse : ''

  const [modalVisible, setModalVisible] = React.useState(false)
  const [auditResponse, setAuditResponse] = React.useState(response)

  const isRefuseAction = action === APPROVAL_ACTION_TYPE.REJECT

  const [handleTicketState, handleTicketFn] = useAsyncFn(ticketControllerUpdateTask, {
    errorHandle: () => message.error(`Failed to ${ACTION_ALERT_NAMES[action]}!`)
  })

  const handleAction = async () => {
    if (ticketType === AUTH_TYPE.DEPLOYMENT_SCALE) {
      await ticketControllerUpdateTicketForm({
        ticketId,
        payload: {
          form: {
            auditResponse: inputAuditResponse || auditResponse
          }
        }
      })
    }
    handleTicketFn({
      ticketId,
      taskId,
      payload: {
        action
      }
    }).then(() => {
      setModalVisible(false)
      message.success(`Successfully ${ACTION_ALERT_NAMES[action]}!`)
      onSuccess()
    })
  }

  const getApproveNotice = () => {
    if (ticketType !== AUTH_TYPE.DEPLOYMENT_SCALE) {
      return DEFAULT_APPROVE_NOTICE
    } else {
      const { createTime } = ticket?.metaInfo
      const {
        currentReleasePodCount = 0,
        runtimeReleasePodCount = 0,
        currentCanaryPodCount = 0,
        runtimeCanaryPodCount = 0
      } = isShopeeScaleDeploymentTicket(extraInfo) ? extraInfo?.variables : {}
      const current = moment()
      const create = moment(createTime)
      if (currentReleasePodCount !== runtimeReleasePodCount || currentCanaryPodCount !== runtimeCanaryPodCount) {
        return APPROVE_POD_COUNT_NOTICE
      } else if (current.diff(create) >= 7) {
        return APPROVE_APPLIED_TIME_NOTICE
      } else {
        return DEFAULT_APPROVE_NOTICE
      }
    }
  }

  const handleAuditResponseChange = (e: { target: { value: string } }) => {
    if (onAuditResponseChange) {
      onAuditResponseChange(e.target.value)
    } else {
      setAuditResponse(e.target.value)
    }
  }

  const auditResponseInput = () => {
    if (canInputAuditResponse && isRefuseAction && ticketType === AUTH_TYPE.DEPLOYMENT_SCALE) {
      return (
        <>
          <StyledAuditResponseDiv>Add audit response</StyledAuditResponseDiv>
          <TextArea autoSize={{ minRows: 2 }} value={auditResponse} onChange={handleAuditResponseChange} />
        </>
      )
    } else {
      return null
    }
  }

  return (
    <>
      <ActionButton
        type={isRefuseAction ? 'default' : 'primary'}
        onClick={() => setModalVisible(true)}
        disabled={stage !== TICKET_STAGE.PENDING}
        loading={handleTicketState.loading}
        size={size}
      >
        {isRefuseAction ? 'Refuse' : 'Approve'}
      </ActionButton>
      <Modal
        title='Notice'
        visible={modalVisible}
        onOk={handleAction}
        onCancel={() => setModalVisible(false)}
        getContainer={() => document.body}
        okText='Confirm'
        confirmLoading={handleTicketState.loading}
      >
        <div>{isRefuseAction ? DEFAULT_REFUSE_NOTICE : getApproveNotice()}</div>
        {auditResponseInput()}
      </Modal>
    </>
  )
}

export default Action
