import React from 'react'

import { Button, message, Table, Tooltip } from 'infrad'
import { CenteredContainer, StyledTitle, StyledContent, StyledCheckCircleFilled, StyledSpan } from './style'

import { HorizontalDivider } from 'common-styles/divider'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import { PENDING_MY_ACTION_LIST, TICKET_DETAIL_KEY } from 'constants/routes/routes'
import { IApplyRequestResponse, ITickets } from 'api/types/accessRequest'

const { Column } = Table

interface ISuccessModalProps {
  formResponse: IApplyRequestResponse
  onCancel: () => void
}

const AccessRequestSuccessContent: React.FC<ISuccessModalProps> = ({ formResponse, onCancel }) => {
  const { ticketId, approverList, tickets } = formResponse || {}

  const handleCopy = () => {
    message.success('Copy Successfully!')
  }

  if (ticketId) {
    const requestDetailLink = `${window.location.origin}${PENDING_MY_ACTION_LIST}/${TICKET_DETAIL_KEY}/${ticketId}`
    return (
      <>
        <CenteredContainer>
          <StyledCheckCircleFilled />
        </CenteredContainer>
        <StyledTitle style={{ marginTop: '24px' }}>Successfully</StyledTitle>
        <StyledContent>
          Your request submitted successfully, please send the{' '}
          <Tooltip title={requestDetailLink}>
            <StyledSpan>link</StyledSpan>
          </Tooltip>{' '}
          to
          <StyledSpan> {approverList.map(person => person.email).join(',')}</StyledSpan> for approving. Please log in
          again to load new permissions after approval.
        </StyledContent>
        <CenteredContainer style={{ marginTop: '24px' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <HorizontalDivider size='20px' />
          <CopyToClipboard onCopy={handleCopy} text={requestDetailLink}>
            <Button type='primary'>Copy Link</Button>
          </CopyToClipboard>
        </CenteredContainer>
      </>
    )
  }
  // change role，multiply tickets
  if (tickets) {
    return (
      <>
        <CenteredContainer>
          <StyledCheckCircleFilled />
        </CenteredContainer>
        <StyledTitle style={{ marginTop: '24px' }}>Successfully</StyledTitle>
        <StyledContent style={{ textAlign: 'left' }}>
          Your request submitted successfully, please send the links to corresponding approvers below for approving.
          Please log in again to load new permissions after approval.
        </StyledContent>
        <Table dataSource={tickets}>
          <Column
            title='Permission group'
            key='Permission group'
            render={(text, record: ITickets) => <span>{record.tenantName + ' | ' + record.permissionGroupName}</span>}
          />
          <Column
            title='Approver'
            key='Approver'
            render={(text, record: ITickets) => (
              <span>
                {record.approverList.map(person => {
                  return (
                    <span key={person.email}>
                      {person.email}
                      <br />
                    </span>
                  )
                })}
              </span>
            )}
          />
          <Column
            title='Link'
            key='Link'
            render={(text, record: ITickets) => {
              const requestDetailLink = `${window.location.origin}${PENDING_MY_ACTION_LIST}/${TICKET_DETAIL_KEY}/${record.ticketId}`
              return (
                <CopyToClipboard onCopy={handleCopy} text={requestDetailLink}>
                  <Button type='primary'>Copy Link</Button>
                </CopyToClipboard>
              )
            }}
          />
        </Table>
        <CenteredContainer style={{ marginTop: '24px' }}>
          <Button onClick={onCancel}>OK</Button>
        </CenteredContainer>
      </>
    )
  }
  return null
}

export default AccessRequestSuccessContent
