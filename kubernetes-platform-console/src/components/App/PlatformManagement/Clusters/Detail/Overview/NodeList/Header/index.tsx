import * as React from 'react'
import { Dropdown, Button } from 'infrad'
import { SearchOutlined, DownOutlined } from 'infra-design-icons'

import { StyledMenu } from 'common-styles/menu'
import { FlexWrapper } from 'common-styles/flexWrapper'
import { StyledInput } from './style'
import { BATCH_ACTIONS, nodeActions } from 'constants/nodeActions'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

interface INodeListHeaderProps {
  onAction: (type: string, isBatch: boolean, nodeName?: string) => void
  batchDisabled: boolean
  searchVal: string
  onSearch: (searchVal: string) => void
}

const NodeListHeader: React.FC<INodeListHeaderProps> = ({ onAction, batchDisabled, searchVal, onSearch }) => {
  const accessControlContext = React.useContext(AccessControlContext)
  const resourceNodeActions = accessControlContext[RESOURCE_TYPE.NODE] || []

  const canBatchLabelNode = resourceNodeActions.includes(RESOURCE_ACTION.BatchLabel)
  const canBatchDrainNode = resourceNodeActions.includes(RESOURCE_ACTION.BatchDrain)
  const canBatchCordonNode = resourceNodeActions.includes(RESOURCE_ACTION.BatchCordon)
  const canBatchTaintNode = resourceNodeActions.includes(RESOURCE_ACTION.BatchTaint)
  const canBatchUncordonNode = resourceNodeActions.includes(RESOURCE_ACTION.BatchUncordon)

  const batchActionPermissionMap = {
    [nodeActions.LABEL]: canBatchLabelNode,
    [nodeActions.DRAIN]: canBatchDrainNode,
    [nodeActions.CORDON]: canBatchCordonNode,
    [nodeActions.TAINT]: canBatchTaintNode,
    [nodeActions.UNCORDON]: canBatchUncordonNode
  }

  const menu = (
    <StyledMenu>
      {BATCH_ACTIONS.map(action => (
        <StyledMenu.Item
          key={action}
          onClick={() => {
            onAction(action, true)
          }}
          disabled={!batchActionPermissionMap[action]}
        >
          Batch-{action}
        </StyledMenu.Item>
      ))}
    </StyledMenu>
  )

  return (
    <FlexWrapper justifyContent='space-between' margin='8px 0 24px 0'>
      <StyledInput
        value={searchVal}
        allowClear
        placeholder='Search Node Name/Node IP…'
        onChange={event => onSearch(event.target.value)}
        suffix={<SearchOutlined />}
      />
      <Dropdown overlay={menu} trigger={['click']} placement='bottomCenter' disabled={batchDisabled}>
        <Button type='primary'>
          Batch-Action <DownOutlined className='icon' />
        </Button>
      </Dropdown>
    </FlexWrapper>
  )
}

export default NodeListHeader
