import React from 'react'
import { Dropdown, Menu, Button, Space } from 'infrad'
import { IArrowDown } from 'infra-design-icons'
import {
  NodeAction,
  NodeBatchActions,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/constant'
import { IEksNodeItem } from 'src/swagger-api/models'
import { useSize } from 'ahooks'
import OperationBar from 'src/components/Common/OperationBar'
import {
  NodeContext,
  getDispatchers,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/useNodeContext'
import { MenuInfo } from 'node_modules/rc-menu/lib/interface'

interface IBatchActionProps {
  isBatchOperating: boolean
  onBatchOperatingStateChange: (batching: boolean) => void
  onSelectedRowStateChange: (state: {
    selectedRowKeys: React.Key[]
    selectedRows: IEksNodeItem[]
  }) => void
  selectedRowState: {
    selectedRowKeys: React.Key[]
    selectedRows: IEksNodeItem[]
  }
  containerElement: HTMLElement
  handleGetBatchActionType: (action: NodeAction) => void
}

const BatchAction: React.FC<IBatchActionProps> = ({
  isBatchOperating,
  onBatchOperatingStateChange,
  onSelectedRowStateChange,
  selectedRowState,
  containerElement,
  handleGetBatchActionType,
}) => {
  const containerSize = useSize(containerElement)
  const { width: containerWidth = 0 } = containerSize || {}

  const operationBarMargin = 24
  const operationBarWidth = containerWidth ? containerWidth - 2 * operationBarMargin : 0

  const { dispatch } = React.useContext(NodeContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const [actionType, setActionType] = React.useState<NodeAction>()
  const handleMenuClick = (menuInfo: MenuInfo) => {
    onBatchOperatingStateChange(true)
    setActionType(menuInfo.key as NodeAction)
    handleGetBatchActionType(menuInfo.key as NodeAction)
  }

  const handleConfirmBatchAction = () => {
    dispatchers.enableEdit(actionType)
    dispatchers.updateSelectedNodes(selectedRowState.selectedRows)
  }

  const handleCancelBatchAction = () => {
    onBatchOperatingStateChange(false)
    onSelectedRowStateChange({
      selectedRowKeys: [],
      selectedRows: [],
    })
    dispatchers.exitEdit()
  }

  return (
    <>
      <Dropdown
        overlay={
          <Menu
            onClick={handleMenuClick}
            items={Object.entries(NodeBatchActions).map(([key, value]) => ({ label: value, key }))}
          />
        }
        overlayStyle={{ width: 85 }}
      >
        <Button>
          <Space size={8}>
            Batch Action
            <IArrowDown />
          </Space>
        </Button>
      </Dropdown>
      <OperationBar
        visible={isBatchOperating}
        onSubmit={handleConfirmBatchAction}
        onCancel={handleCancelBatchAction}
        selectedCount={selectedRowState?.selectedRows?.length}
        parent={containerElement}
        style={{
          position: 'absolute',
          bottom: 0,
          width: `${operationBarWidth}px`,
          margin: `0 ${operationBarMargin}px`,
        }}
        disabled={selectedRowState?.selectedRows?.length === 0}
      />
    </>
  )
}

export default BatchAction
