import * as React from 'react'

import { useRecoilValue } from 'recoil'
import { selectedRequest } from 'states/requestAndApproval'
import { TICKET_STATUS } from 'constants/requestAndApproval'

import { Descriptions } from 'infrad'
import moment from 'moment'

const DefaultDetail: React.FC = () => {
  const request = useRecoilValue(selectedRequest)
  const { status, applicantName, createTime, ticketType, purpose, assigneeList } = request?.metaInfo || {}
  const { tenantName, project, permissionGroupName } = request?.extraInfo || {}

  return (
    <>
      <Descriptions.Item label='Applicant'>{applicantName}</Descriptions.Item>
      <Descriptions.Item label='Applied Time'>
        {createTime && moment(createTime).format('YYYY-MM-DD HH:mm:ss')}
      </Descriptions.Item>
      {project && <Descriptions.Item label='Project'>{project}</Descriptions.Item>}
      <Descriptions.Item label='Tenant'>{tenantName}</Descriptions.Item>
      {permissionGroupName && <Descriptions.Item label='Permission Group'>{permissionGroupName}</Descriptions.Item>}
      {purpose && <Descriptions.Item label='Purpose'>{purpose}</Descriptions.Item>}
      <Descriptions.Item label='Type' span={2}>
        {ticketType}
      </Descriptions.Item>
      {status === TICKET_STATUS.OPEN && (
        <Descriptions.Item label='Approver List' span={2}>
          {assigneeList.join(', ')}
        </Descriptions.Item>
      )}
    </>
  )
}

export default DefaultDetail
