import * as React from 'react'
import { useRecoilValue } from 'recoil'
import { Button, Modal, Spin, Popover, message } from 'infrad'

import {
  Desc,
  Informer,
  StyleResult,
  SubTitle,
  TitleInformationIcon,
  Title,
  StyledTextArea,
  TextAreaWrapper,
  PromptBar,
  ApproverListIcon,
  TextNumCount
} from './style'
import { CenterWrapper } from 'common-styles/flexWrapper'
import { formatTime } from 'helpers/format'
import { selectedPod as selectedPodState } from 'states/applicationState/pod'
import { ticketControllerApplyTerminalAccess } from 'swagger-api/v3/apis/Ticket'
import { requestsControllerLatestAccessApplyRecord } from 'swagger-api/v3/apis/Requests'

import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'

import { IIApprover } from 'swagger-api/v3/models'
import { groupsControllerListTerminalApprovers } from 'swagger-api/v3/apis/Tenants'
import { IProjectActiveAccess, IProjectTerminalAccesses } from 'api/types/application/project'

const PermissionDenied: React.FC = () => {
  const selectedPod = useRecoilValue(selectedPodState)
  const { tenantId, projectName } = selectedPod
  const [getProjectActiveAccessRequestState, getProjectActiveAccessRequestFn] = useAsyncIntervalFn(
    requestsControllerLatestAccessApplyRecord
  )
  const [applyForProjectAccessRequestState, applyForProjectAccessRequestFn] = useAsyncIntervalFn(
    ticketControllerApplyTerminalAccess
  )

  const [activeRequest, setRequest] = React.useState<IProjectTerminalAccesses | IProjectActiveAccess | null>(null)
  const [approvers, setApprovers] = React.useState<IIApprover[]>([])

  const [reason, setReason] = React.useState('')
  const reasonLength = reason.length
  const hasExceededMaxLength = reasonLength > 100
  const isNullReason = reasonLength === 0

  const handleClickApply = () => {
    Modal.confirm({
      title: 'Are you sure to apply to access it?',
      content: 'The terminal approvers will receive an application email.',
      onOk() {
        applyForAccess()
      }
    })
  }

  const applyForAccess = async () => {
    const request = await applyForProjectAccessRequestFn({
      tenantId,
      projectName,
      payload: {
        reason
      }
    })
    message.success('Apply successfully!')
    setRequest(request)
  }

  const getActiveRequest = async () => {
    const request = await getProjectActiveAccessRequestFn({
      tenantId,
      projectName
    })
    setRequest(request)
  }

  const getListOfApprovers = async () => {
    try {
      const { approvers = [] } = await groupsControllerListTerminalApprovers({ tenantId })
      setApprovers(approvers)
    } catch (err) {
      console.error(err)
    }
  }

  React.useEffect(() => {
    getActiveRequest()
    getListOfApprovers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isApplyingAccess = applyForProjectAccessRequestState.loading
  const isFetchingActiveRequest = getProjectActiveAccessRequestState.loading

  if (isFetchingActiveRequest) {
    return (
      <CenterWrapper>
        <Spin />
      </CenterWrapper>
    )
  }

  const hasActiveRequest = activeRequest && activeRequest.status === 'PENDING'

  return (
    <div>
      <StyleResult
        title={<Title>No Permission</Title>}
        icon={<TitleInformationIcon />}
        subTitle={
          <SubTitle>
            Sorry, you have no permission to access terminal of project <span>{projectName}</span>
          </SubTitle>
        }
        extra={
          <div>
            <TextAreaWrapper>
              <StyledTextArea
                reasonOverLength={hasExceededMaxLength}
                placeholder='Please enter the specific purpose'
                maxLength={101}
                value={reason}
                onChange={({ target: { value } }) => {
                  setReason(value)
                }}
              />
              <PromptBar>
                {approvers?.length > 0 ? (
                  <span>
                    Approver list
                    <Popover
                      content={
                        <div>
                          <div>Approver list:</div>
                          {approvers.map(({ email }) => (
                            <div key={email}>{email}</div>
                          ))}
                        </div>
                      }
                      trigger='hover'
                    >
                      <ApproverListIcon />
                    </Popover>
                  </span>
                ) : (
                  <span>No approver in this tenant, please contact tenant admin</span>
                )}
                <TextNumCount reasonOverLength={hasExceededMaxLength}>{reasonLength}/100</TextNumCount>
              </PromptBar>
            </TextAreaWrapper>
            <Button
              disabled={hasActiveRequest || isNullReason || hasExceededMaxLength}
              loading={isApplyingAccess}
              type='primary'
              onClick={handleClickApply}
            >
              Request access
            </Button>
          </div>
        }
      />
      {hasActiveRequest && (
        <div>
          <Desc>
            You have applied at {formatTime(activeRequest.createdAt)}, please wait for the terminal approvers to
            approve.
          </Desc>
          <Informer>And you have 4 hours of terminal permission after approval.</Informer>
        </div>
      )}
    </div>
  )
}

export default PermissionDenied
