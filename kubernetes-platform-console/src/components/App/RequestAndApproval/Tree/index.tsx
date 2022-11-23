import * as React from 'react'
import { Tree } from 'infrad'
import { useRecoilValue } from 'recoil'

import history from 'helpers/history'
import { ticketCenterSelectedTreeNodes, ticketCenterSelectedExpandedNodes } from 'states/requestAndApproval'

import { TICKET_CENTER_KEY, PENDING_MY_ACTION, MY_REQUESTS } from 'constants/routes/routes'

import { DirectoryTreeWrapper } from 'common-styles/directoryWrapper'

const { DirectoryTree } = Tree

const TICKET_CENTER_TREE = [
  {
    key: PENDING_MY_ACTION,
    title: 'Pending My Action'
  },
  {
    key: MY_REQUESTS,
    title: 'My Requests'
  }
]

const RequestAndApprovalDirectoryTree: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = React.useState([])
  const [expandedKeys, setExpandedKeys] = React.useState([])

  const defaultSelectedKeys = useRecoilValue(ticketCenterSelectedTreeNodes)
  const defaultExpandedKeys = useRecoilValue(ticketCenterSelectedExpandedNodes)

  React.useEffect(() => {
    setExpandedKeys(Array.from(new Set([...expandedKeys, ...defaultExpandedKeys])))
    setSelectedKeys(defaultSelectedKeys)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultExpandedKeys, defaultSelectedKeys])

  const treeData = React.useMemo(() => {
    return [].concat({
      key: TICKET_CENTER_KEY,
      title: 'Tickets Center',
      children: TICKET_CENTER_TREE.map(node => ({
        key: `${TICKET_CENTER_KEY}/${node.key}`,
        title: node.title,
        children: null,
        selectable: true,
        isLeaf: true
      })),
      selectable: false,
      isLeaf: false
    })
  }, [])

  return (
    <DirectoryTreeWrapper>
      <DirectoryTree
        style={{ width: '100%' }}
        showIcon={false}
        treeData={treeData}
        selectedKeys={[...selectedKeys]}
        expandedKeys={[...expandedKeys]}
        onExpand={keys => {
          setExpandedKeys(keys)
        }}
        onSelect={selectedKeys => {
          const resource = selectedKeys[0]

          if (resource) {
            history.push(`/${resource}`)
          }
        }}
        expandAction='doubleClick'
      />
    </DirectoryTreeWrapper>
  )
}

export default RequestAndApprovalDirectoryTree
