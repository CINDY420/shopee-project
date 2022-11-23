import React from 'react'
import { Modal, Button, Badge, message, Table } from 'infrad'
import { IEksNodeItem, IEksGetClusterDetailResponse } from 'src/swagger-api/models'
import { ColumnsType } from 'infrad/lib/table'
import {
  SelectedNodeWrapper,
  StyledDescription,
  StyledAlert,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/NodeActions/MoreActions/style'
import Icon, { InfoCircleOutlined } from 'infra-design-icons'
import {
  NodeContext,
  getDispatchers,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/useNodeContext'
import { NodeAction } from 'src/components/App/Cluster/ClusterDetail/NodeTable/constant'
import {
  eksNodeController_cordonNodes,
  eksNodeController_unCordonNodes,
  eksNodeController_drainNodes,
  eksNodeController_deleteNodes,
} from 'src/swagger-api/apis/EksNode'
import { useParams } from 'react-router-dom'
import {
  nodeStatusColorMap,
  SchedulingStatusColorMap,
  NodeStatusTypes,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable'
import {
  StyledPopover,
  StyledStatusTable,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/style'
import { ReactComponent as ProvisioningSvg } from 'src/assets/provisioning.svg'

interface IMoreActionProps {
  clusterDetail: IEksGetClusterDetailResponse
}

const nodeStatusConditionColumns = [
  {
    title: 'Type',
    dataIndex: 'meta',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
    render: (reason: string) => reason ?? '-',
  },
  {
    title: 'Message',
    dataIndex: 'message',
    render: (message: string) => message ?? '-',
  },
]

const columns: ColumnsType<IEksNodeItem> = [
  {
    title: 'Node',
    dataIndex: 'nodeName',
  },
  {
    title: 'Private IP',
    dataIndex: 'privateIp',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status: string, record) => (
      <div style={{ whiteSpace: 'nowrap' }}>
        {status === NodeStatusTypes.PROVISIONING ? (
          <span style={{ marginLeft: '-8px' }}>
            <Icon component={ProvisioningSvg} style={{ marginRight: '8px' }} />
            {status}
          </span>
        ) : (
          <Badge color={nodeStatusColorMap[status]} text={status} />
        )}
        <StyledPopover
          title="Condition"
          content={
            <StyledStatusTable
              columns={nodeStatusConditionColumns}
              dataSource={record.condition}
              pagination={false}
              scroll={{ y: 350 }}
              rowKey="nodeName"
            />
          }
          getPopupContainer={() => document.body}
          placement="right"
          trigger="click"
        >
          <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 6 }} />
        </StyledPopover>
      </div>
    ),
  },
  {
    title: 'Scheduling status',
    dataIndex: 'schedulingStatus',
    render: (status: string) => (
      <span style={{ color: SchedulingStatusColorMap?.[status] }}>{status}</span>
    ),
  },
]

const modalAlertCopywritingMaps: Record<string, JSX.Element> = {
  [NodeAction.CORDON]: (
    <div>
      <div>
        Are you sure to perform Cordon operation on the following nodes, and at the same time change
        the state to SchedulingDisabled state?
      </div>
      <div style={{ marginTop: '24px' }}>
        When the Node scheduling status is scheduled, the prompt is Node to be SchedulingDisabled
      </div>
    </div>
  ),
  [NodeAction.UNCORDON]: (
    <div>
      Are you sure to perform Uncordon operation on the following nodes, and at the same time change
      the state to schedulabled state?
    </div>
  ),
  [NodeAction.DELETE]: (
    <StyledAlert
      message={
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {
            'Are you sure you want to remove the following nodes? \nWhen a Node is deleted, the Pod running on it will be scheduled to other Nodes.'
          }
        </div>
      }
      type="warning"
      showIcon
    />
  ),
  [NodeAction.DRAIN]: (
    <StyledAlert
      message={
        <div>
          <div>Are you sure you want to remove the following nodes?</div>
          <ul style={{ paddingLeft: '22px' }}>
            <li>Node state returns to schedulDisabled after Drain operation</li>
            <li>
              Performing a Drain operation on a node will expel the Pod running on the node to other
              nodes
            </li>
            <li>Pods of type DaemonSet will not be evicted</li>
          </ul>
        </div>
      }
      type="warning"
      showIcon
    />
  ),
}

const modalOkTextMaps: Record<string, { isDanger: boolean; text: string }> = {
  [NodeAction.CORDON]: {
    isDanger: false,
    text: 'Confirm',
  },
  [NodeAction.UNCORDON]: {
    isDanger: false,
    text: 'Confirm',
  },
  [NodeAction.DELETE]: {
    isDanger: true,
    text: 'Remove',
  },
  [NodeAction.DRAIN]: {
    isDanger: true,
    text: 'Confirm',
  },
}

const MoreActions: React.FC<IMoreActionProps> = ({ clusterDetail }) => {
  const { state, dispatch } = React.useContext(NodeContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { action, selectedNodes } = state
  const modalVisible = [
    NodeAction.CORDON,
    NodeAction.UNCORDON,
    NodeAction.DRAIN,
    NodeAction.DELETE,
  ].includes(action)
  const handleCancel = () => {
    dispatchers.exitEdit()
  }

  const { clusterId } = useParams<{
    clusterId: string
  }>()

  const handleConfirm = async () => {
    const nodeNames = selectedNodes.map((selectedNode) => selectedNode.nodeName)
    switch (action) {
      case NodeAction.CORDON: {
        await eksNodeController_cordonNodes({
          clusterId: Number(clusterId),
          payload: { nodeNames },
        })
        message.success('Cordon node Successfully!')
        dispatchers.exitEdit()
        break
      }
      case NodeAction.UNCORDON: {
        await eksNodeController_unCordonNodes({
          clusterId: Number(clusterId),
          payload: { nodeNames },
        })
        message.success('UnCordon node Successfully!')
        break
      }
      case NodeAction.DRAIN: {
        await eksNodeController_drainNodes({
          clusterId: Number(clusterId),
          payload: { nodeNames },
        })
        message.success('Drain node Successfully!')
        break
      }
      case NodeAction.DELETE: {
        const { privateIp, nodeGroup } = selectedNodes?.[0]
        await eksNodeController_deleteNodes({
          clusterId: Number(clusterId),
          payload: { hostIPs: [privateIp], nodeGroupId: nodeGroup },
        })
        message.success('Delete node Successfully!')
        break
      }
    }
    dispatchers.exitEdit()
    dispatchers.requestRefresh()
  }

  return (
    <Modal
      title={`${selectedNodes?.length > 1 ? `Batch ${action}` : action} ${
        action === NodeAction.DELETE ? 'Node' : ''
      }`}
      visible={modalVisible}
      width={884}
      getContainer={document.body}
      onCancel={handleCancel}
      footer={
        <div>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" danger={modalOkTextMaps[action]?.isDanger} onClick={handleConfirm}>
            {modalOkTextMaps[action]?.text}
          </Button>
        </div>
      }
    >
      {modalAlertCopywritingMaps[action]}
      {action === (NodeAction.DELETE || NodeAction.DRAIN) && (
        <StyledDescription title="Basic Information">
          <StyledDescription.Item label="AZ">{clusterDetail?.AZv2}</StyledDescription.Item>
          <StyledDescription.Item label="Env">{clusterDetail?.env}</StyledDescription.Item>
          <StyledDescription.Item label="Platform">
            {clusterDetail?.platformName}
          </StyledDescription.Item>
        </StyledDescription>
      )}
      <SelectedNodeWrapper>{`${selectedNodes?.length} ${
        selectedNodes?.length > 1 ? 'Nodes have' : 'Node has'
      } been selected`}</SelectedNodeWrapper>
      <Table
        columns={columns}
        dataSource={selectedNodes}
        pagination={false}
        rowKey="nodeName"
        scroll={{ y: 830 }}
      />
    </Modal>
  )
}

export default MoreActions
