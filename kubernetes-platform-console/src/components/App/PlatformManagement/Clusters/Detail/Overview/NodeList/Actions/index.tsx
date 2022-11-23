import * as React from 'react'
import { Dropdown } from 'infrad'
import { MoreOutlined } from 'infra-design-icons'

import { StyledMenu } from 'common-styles/menu'
import { StyledButton } from './style'
import { INSIDE_MENU_ACTIONS, OUTSIDE_MENU_ACTIONS, nodeActions } from 'constants/nodeActions'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'
interface IActionsProps {
  onAction?: (type: string, isBatch: boolean, nodeName?: string) => void
  nodeName: string
}

const Actions: React.FC<IActionsProps> = props => {
  const { onAction, nodeName } = props

  const accessControlContext = React.useContext(AccessControlContext)
  const resourceNodeActions = accessControlContext[RESOURCE_TYPE.NODE] || []

  const canLabelNode = resourceNodeActions.includes(RESOURCE_ACTION.Label)
  const canDrainNode = resourceNodeActions.includes(RESOURCE_ACTION.Drain)
  const canCordonNode = resourceNodeActions.includes(RESOURCE_ACTION.Cordon)
  const canTaintNode = resourceNodeActions.includes(RESOURCE_ACTION.Taint)
  const canUncordonNode = resourceNodeActions.includes(RESOURCE_ACTION.Uncordon)

  const nodeActionPermissionMap = {
    [nodeActions.LABEL]: canLabelNode,
    [nodeActions.DRAIN]: canDrainNode,
    [nodeActions.CORDON]: canCordonNode,
    [nodeActions.TAINT]: canTaintNode,
    [nodeActions.UNCORDON]: canUncordonNode
  }

  const menu = (
    <StyledMenu>
      {INSIDE_MENU_ACTIONS.map(action => (
        <StyledMenu.Item
          key={action}
          onClick={() => {
            onAction(action, false, nodeName)
          }}
          disabled={!nodeActionPermissionMap[action]}
        >
          {action}
        </StyledMenu.Item>
      ))}
    </StyledMenu>
  )

  return (
    <div>
      {OUTSIDE_MENU_ACTIONS.map(action => (
        <StyledButton
          key={action.action}
          onClick={() => {
            onAction(action.action, false, nodeName)
          }}
          type='link'
          disabled={!nodeActionPermissionMap[action.action]}
        >
          <action.icon />
          {action.action}
        </StyledButton>
      ))}
      <Dropdown overlay={menu} trigger={['click']} placement='bottomLeft'>
        <StyledButton className='ant-dropdown-link' onClick={e => e.preventDefault()} type='link'>
          <MoreOutlined className='more-icon' /> More
        </StyledButton>
      </Dropdown>
    </div>
  )
}

export default Actions
