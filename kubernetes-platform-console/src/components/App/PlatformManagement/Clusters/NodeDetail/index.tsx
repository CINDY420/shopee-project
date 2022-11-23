import * as React from 'react'
import { useRecoilValue } from 'recoil'
import { Tabs, Modal, message } from 'infrad'

import DetailLayout, { IDetailLayoutProps } from 'components/App/ApplicationsManagement/Common/DetailLayout'
import Overview from './Overview'
import Label from './Label'
import Taints from './Taints'
import Breadcrumbs from '../Common/Breadcrumbs'
import PodList from './PodList'

import { selectedNode } from 'states/clusterState/node'
import { INode } from 'api/types/cluster/node'
import { putClusterNodeActions } from 'helpers/api'

import accessControl from 'hocs/accessControl'
import { Card } from 'common-styles/cardWrapper'
import { useQueryParam, StringParam } from 'use-query-params'
import { VerticalDivider } from 'common-styles/divider'
import NodeActions from 'components/App/PlatformManagement/Clusters/Detail/Overview/NodeList/Actions'
import Drawer from '../Detail/Overview/NodeList/Drawer'
import { QuestionCircleFilled } from 'infra-design-icons'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { PERMISSION_SCOPE, RESOURCE_TYPE } from 'constants/accessControl'

const { confirm } = Modal

const { TabPane } = Tabs

const getActionResultNodes = (nodes: string[]) => {
  if (!nodes) return 'no node'
  const length = nodes.length
  if (length > 0) {
    return `node${nodes.length > 1 ? 's' : ''} ${nodes.toString()}`
  } else {
    return 'no node'
  }
}

const NodeDetail: React.FC = () => {
  const node: INode = useRecoilValue(selectedNode)

  const tabs: IDetailLayoutProps['tabs'] = [
    {
      name: 'Overview',
      Component: Overview,
      props: {
        node
      }
    },
    {
      name: 'Label',
      Component: Label,
      props: {
        node
      }
    },
    {
      name: 'Taints',
      Component: Taints,
      props: {
        node
      }
    }
  ]

  const [selectedTab, setSelectedTab] = useQueryParam('selectedTab', StringParam)
  const [actionType, setActionType] = React.useState('Label')
  const [actionNodes, setActionNodes] = React.useState([])
  const [isDrawerVisible, setIsDrawerVisible] = React.useState(false)
  const [, setIsConfirming] = React.useState(false)

  const [, putClusterNodeActionsFn] = useAsyncIntervalFn(putClusterNodeActions)

  const closeDrawer = () => {
    setIsDrawerVisible(false)
  }

  const cancelActionsHandler = () => {
    setActionNodes([])
  }

  const handleNodeActionConfirm = ({
    type,
    nodes,
    result,
    onOk,
    submitCallback = null,
    cancelCallback = null,
    setIsConfirming
  }) => {
    const length = nodes.length
    const nodeName = length > 1 ? `${nodes[0]} and ${length - 1} more nodes` : nodes[0]
    const moreContent = type === 'Drain' ? `${type} will cordon the node and mark it unschedulable. ` : ''
    confirm({
      icon: <QuestionCircleFilled />,
      title: `${type} the node '${nodeName}'?`,
      content: `${moreContent}This operation cannot be canceled.`,
      okText: 'Confirm',
      centered: true,
      onOk () {
        if (onOk) {
          onOk(type, result, submitCallback)
        }
        setIsConfirming(false)
      },
      onCancel () {
        if (cancelCallback) {
          cancelCallback()
        }
        setIsConfirming(false)
      }
    })
  }

  const handleConfirm = async (type, result, submitCallback?) => {
    const res = await putClusterNodeActionsFn({
      actionType: type.toLowerCase(),
      clusterName: node.cluster,
      actionConfig: result
    })
    message.success(
      `Submit Successfully! With ${getActionResultNodes(res.success)} success, With ${getActionResultNodes(
        res.fail
      )} failed.`
    )
    setActionNodes([])
    closeDrawer()
    if (submitCallback) {
      submitCallback()
    }
  }

  const triggerAction = (type, nodeNames) => {
    switch (type) {
      case 'Taint':
      case 'Label':
        setIsDrawerVisible(true)
        break
      default:
        setIsConfirming(true)
        handleNodeActionConfirm({
          type,
          nodes: nodeNames,
          result: { nodes: nodeNames },
          onOk: handleConfirm,
          cancelCallback: () => {
            cancelActionsHandler()
          },
          setIsConfirming
        })
    }
  }

  const handleActions = (type, isBatch, nodeName?) => {
    setActionType(type)
    triggerAction(type, [nodeName])
    setActionNodes([nodeName])
  }

  return (
    <>
      <DetailLayout
        breadcrumbs={<Breadcrumbs />}
        state={node.status}
        title={`Node: ${node.name}`}
        tags={[`Node IP: ${node.IP}`]}
        body={
          <div style={{ overflow: 'auto' }}>
            <VerticalDivider size='24px' />
            <Card padding='0 24px 24px 24px'>
              <Tabs activeKey={selectedTab} onChange={setSelectedTab} animated={false} destroyInactiveTabPane={true}>
                {tabs.map((tab: any) => {
                  const { name, Component, props: tabProps } = tab

                  return (
                    <TabPane tab={name} key={name}>
                      <Component {...tabProps} />
                    </TabPane>
                  )
                })}
              </Tabs>
            </Card>
            <VerticalDivider size='24px' />
            <PodList clusterName={node.cluster} name={node.name} />
          </div>
        }
        CustomButton={() => <NodeActions onAction={handleActions} nodeName={node.name} />}
      />
      <Drawer
        visible={isDrawerVisible}
        type={actionType}
        closeDrawer={closeDrawer}
        nodeNames={actionNodes}
        onCancel={cancelActionsHandler}
        onSubmit={(result, submitCallback) => {
          setIsConfirming(true)
          handleNodeActionConfirm({
            type: actionType,
            nodes: actionNodes,
            result,
            onOk: handleConfirm,
            submitCallback,
            setIsConfirming
          })
        }}
      />
    </>
  )
}

export default accessControl(NodeDetail, PERMISSION_SCOPE.GLOBAL, [RESOURCE_TYPE.NODE])
